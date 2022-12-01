import Cookies from 'js-cookie';
import countBy from 'lodash/countBy';
import find from 'lodash/find';
import map from 'lodash/map';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import PQueue from 'p-queue';
import PropTypes from 'prop-types';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import CartApi from '@client/apis/cart';
import CustomerApi from '@client/apis/customer';
import ProductApi from '@client/apis/product';
import { hitTimeStamp } from '@client/constants/hitTimeStamp';
import { useReduxContext } from '@client/contexts';
import { CartAction } from '@client/contexts/cart/actions';
import { CART_INITIAL_STATE, cartReducer } from '@client/contexts/cart/reducer';
import {
  Product,
  ProductEmarsys,
  ProductListPriceInclTax,
  ProductWithPriceInclTax,
} from '@client/features/gtm/models/Product';
import {
  addCartItem,
  changeCartItemQty,
  closeNoStockModal,
  deleteCartItem,
  endAddTOCart,
  endLoadingCart,
  fetchCartCompleted,
  fetchCartFail,
  fetchCartTotals,
  fetchShippingMethods,
  notifyLimitQty,
  notifyMaxQty,
  notifyOutOfStock,
  replaceCartItem,
  resetNotifyLimitQty,
  resetNotifyMaxQty,
  resetNotifyOutOfStock,
  showNoStockModal,
  startLoadingCart,
} from '@client/reducers/cart';
import { showDeliveryToolBar } from '@client/reducers/customer';
import {
  addProductSkusToCookies,
  errorTypes,
  formatCartBundle,
  getErrorType,
} from '@client/utils/cart';
import { unsetCookie } from '@client/utils/cookie';

export const CartContext = createContext();

const initialAdultConfirmationModal = {
  isShow: false,
  selectedProduct: null,
};

export function useCartContext() {
  return useContext(CartContext);
}

function handleProductOutOfStock({
  product,
  reduxDispatch,
  showNoStockModal,
  closeNoStockModal,
}) {
  const isInStock = product.extension_attributes?.stock_item?.is_in_stock;

  if (!isInStock) {
    reduxDispatch(closeNoStockModal());
    reduxDispatch(showNoStockModal(product, 'out_of_stock'));
  }

  return !isInStock;
}

function handleUnauthenticatedUser({ ref, reduxState, history }) {
  if (!isLoggedIn(reduxState)) {
    history.push(`/login?ref=${ref}`);
    return true;
  }

  return false;
}

function handleUnknownShippingAddress({
  productSku,
  addProductSkusToCookies,
  reduxState,
  reduxDispatch,
  showDeliveryToolBar,
}) {
  const currentAddress = reduxState.customer?.currentShipping;

  if (!currentAddress) {
    addProductSkusToCookies([productSku]);
    reduxDispatch(showDeliveryToolBar());
  }

  return !currentAddress;
}

function transformPackProduct(product) {
  const bundleOptions =
    product?.extension_attributes?.bundle_product_options?.[0];
  const qtyPerPack = bundleOptions?.product_links?.[0]?.qty;

  return {
    sku: product?.sku,
    qty: 1,
    product_option: {
      extension_attributes: {
        bundle_options: [
          {
            option_id: bundleOptions?.option_id || '',
            option_qty: qtyPerPack,
            option_selections: [
              parseInt(bundleOptions?.product_links?.[0]?.id),
            ],
          },
        ],
      },
    },
  };
}

function transformProduct(product) {
  return {
    sku: product?.sku,
    qty: 1,
  };
}

function handleUnauthorizedError({ history, unsetCookie }) {
  unsetCookie('user_token');
  history.push('/login?token_expired=true');
}

async function handleCartEmptyError({
  productSku,
  errorMessage,
  reduxState,
  CustomerApi,
  Cookies,
  setRetryProductSkus,
}) {
  const userToken = Cookies.get('user_token');
  const customerShippingInfo = await CustomerApi.getShippingInfo(userToken);
  const customerStoreCode = customerShippingInfo?.current_store;

  const storeCode = reduxState?.storeConfig?.current?.code;
  const currentStoreCode = storeCode?.replace(/_en|_th/gi, '');

  if (
    (customerStoreCode && customerStoreCode !== currentStoreCode) ||
    errorMessage === 'No such entity with %fieldName = %fieldValue' ||
    errorMessage === 'Current customer does not have an active cart.'
  ) {
    setRetryProductSkus
      ? setRetryProductSkus(productSkus => [...productSkus, productSku])
      : window.location.reload();
  }
}

function isLoggedIn(reduxState) {
  return Object.keys(reduxState.customer || {}).length > 0;
}

function isIdleQueue(queue) {
  return queue.size === 0 && queue.pending === 0;
}

function handleRequiredAdultConfirmation({
  product,
  openAdultConfirmationModal,
}) {
  if (
    (product.is_alcohol_restriction === '1' || product.alcohol_cms_popup) &&
    !Cookies.get('confirm_age_20_up')
  ) {
    openAdultConfirmationModal(product);
    return true;
  }

  return false;
}

export async function addProductQueue({
  product,
  openAdultConfirmationModal,
  reduxState,
  reduxDispatch,
  cart,
  transformedProduct,
  setRetryProductSkus,
  history,
}) {
  try {
    if (
      handleRequiredAdultConfirmation({
        product,
        openAdultConfirmationModal,
      }) ||
      handleProductOutOfStock({
        product,
        reduxDispatch,
        showNoStockModal,
        closeNoStockModal,
      })
    ) {
      throw new Error();
    }

    const addItemResponse = await CartApi.addItem(cart?.id, transformedProduct);

    if (addItemResponse.data?.error) {
      const errorMessage = addItemResponse.data?.error?.message;
      const errorType = getErrorType(errorMessage);
      const httpStatus = addItemResponse.data?.status;
      const productSku = product?.sku;

      if (httpStatus === 401) {
        handleUnauthorizedError({ history, unsetCookie });
      } else if (httpStatus === 404) {
        handleCartEmptyError({
          productSku,
          errorMessage: addItemResponse.data?.error?.message,
          reduxState,
          CustomerApi,
          Cookies,
          setRetryProductSkus,
        });
      } else if (errorType === errorTypes.product_group_limit) {
        const productGroupError =
          addItemResponse.data?.error?.parameters?.product_group_error;
        await reduxDispatch(resetNotifyLimitQty());
        reduxDispatch(notifyLimitQty(productGroupError, productSku));
      } else if (errorType === errorTypes.out_of_stock) {
        await reduxDispatch(resetNotifyOutOfStock());
        reduxDispatch(notifyOutOfStock(productSku));
      } else if (errorType === errorTypes.limit_qty_200) {
        await reduxDispatch(resetNotifyLimitQty());
        reduxDispatch(notifyLimitQty(errorTypes.limit_qty_200, productSku));
      } else {
        await reduxDispatch(closeNoStockModal());
        reduxDispatch(showNoStockModal(product, errorType));
      }
      throw new Error();
    } else if (addItemResponse.data.item) {
      dataLayer.push({
        event: 'eec.AddToCart',
        ecommerce: {
          currencyCode: 'THB',
          add: {
            products: [Product(product)],
          },
        },
        hit_timestamp: hitTimeStamp,
      });

      const cartItem = {
        ...transformedProduct,
        ...addItemResponse.data?.item,
      };

      reduxDispatch(replaceCartItem(cartItem));
      reduxDispatch(endAddTOCart(transformedProduct));
    }
  } catch (_e) {
    reduxDispatch(deleteCartItem(product?.sku));
  }
}

export async function changeProductQtyQueue({
  reduxStateRef,
  productSku,
  newProductQty,
  reduxDispatch,
  changeProductQty,
  memorizedQty,
  history,
}) {
  const reduxState = reduxStateRef.current;
  const product = find(
    reduxState.cart?.cart?.items,
    item => item.sku === productSku,
  );

  if (!product) {
    return;
  }

  try {
    const changeItemQtyResponse = await CartApi.changeItemQty(
      reduxState.cart?.cart?.id,
      product.item_id,
      productSku,
      newProductQty,
    );

    if (changeItemQtyResponse.data?.error) {
      const errorMessage = changeItemQtyResponse.data?.error?.message;
      const errorType = getErrorType(errorMessage);
      const httpStatus = changeItemQtyResponse.data?.status;

      if (
        errorType === errorTypes.product_group_limit ||
        errorType === errorTypes.product_group_limit_alert
      ) {
        const productGroupError =
          changeItemQtyResponse.data?.error?.parameters?.product_group_error;

        await reduxDispatch(resetNotifyLimitQty());
        reduxDispatch(notifyLimitQty(productGroupError, productSku));

        const remainingQty =
          changeItemQtyResponse.data?.error?.parameters?.remain_qty || 1;

        changeProductQty({
          productSku,
          qty: remainingQty,
        });
        return;
      }

      if (httpStatus === 401) {
        handleUnauthorizedError({ history, unsetCookie });
      } else if (httpStatus === 404) {
        handleCartEmptyError({
          productSku,
          errorMessage: changeItemQtyResponse.data?.error?.message,
          reduxState,
          CustomerApi,
          Cookies,
        });
      } else if (errorType === errorTypes.out_of_stock) {
        await reduxDispatch(resetNotifyOutOfStock());
        reduxDispatch(notifyOutOfStock(productSku));
      } else if (errorType === errorTypes.limit_qty_200) {
        await reduxDispatch(resetNotifyLimitQty());
        reduxDispatch(notifyLimitQty(errorTypes.limit_qty_200, productSku));
      } else {
        await reduxDispatch(closeNoStockModal());
        reduxDispatch(showNoStockModal(product, errorType));
      }
      throw new Error();
    } else {
      const productGTM = ProductWithPriceInclTax(product);
      productGTM.quantity = 1;

      dataLayer.push(
        newProductQty > memorizedQty
          ? {
              event: 'eec.AddToCart',
              ecommerce: {
                currencyCode: 'THB',
                add: {
                  products: [productGTM],
                },
              },
              hit_timestamp: hitTimeStamp,
            }
          : {
              event: 'eec.RemoveFromCart',
              ecommerce: {
                remove: {
                  products: [productGTM],
                },
              },
              hit_timestamp: hitTimeStamp,
            },
      );
    }
  } catch (_e) {
    reduxDispatch(changeCartItemQty({ productSku, qty: memorizedQty }));
  }
}

export async function deleteProductQueue({
  cartId,
  memorizedProduct,
  reduxDispatch,
  history,
}) {
  try {
    const deleteItemResponse = await CartApi.deleteItem(
      cartId,
      memorizedProduct.item_id,
    );

    if (deleteItemResponse.data?.error) {
      const errorMessage = deleteItemResponse.data?.error?.message;
      const httpStatus = deleteItemResponse.data?.status;

      if (httpStatus === 401) {
        handleUnauthorizedError({ history, unsetCookie });
      } else if (httpStatus === 404) {
        window.location.reload();
      } else if (
        errorMessage ===
        'The "undefined" value\'s type is invalid. The "int" type was expected. Verify and try again.'
      ) {
        throw new Error('Item does not exist in cart');
      }
      throw new Error();
    }

    dataLayer.push({
      event: 'eec.RemoveFromCart',
      ecommerce: {
        remove: {
          products: [ProductWithPriceInclTax(memorizedProduct)],
        },
      },
      hit_timestamp: hitTimeStamp,
    });
  } catch (e) {
    if (e.message !== 'Item does not exist in cart') {
      reduxDispatch(addCartItem(memorizedProduct));
    }
  }
}

export async function deleteProductBundleQueue({
  cartId,
  product,
  remainingQty,
  history,
}) {
  const deleteItemBundleResponse = await CartApi.deleteItemBundle(
    cartId,
    product.item_id,
    product.sku,
    remainingQty,
  );

  if (deleteItemBundleResponse.data?.error) {
    const httpStatus = deleteItemBundleResponse.data?.status;

    if (httpStatus === 401) {
      handleUnauthorizedError({ history, unsetCookie });
    } else if (httpStatus === 404) {
      window.location.reload();
    }
    throw new Error();
  }
}

function CartProvider({ children }) {
  const [retryProductSkus, setRetryProductSkus] = useState([]);
  const [cart, cartDispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  const [adultConfirmationModal, setAdultConfirmationModal] = useState(
    initialAdultConfirmationModal,
  );
  const history = useHistory();
  const location = useLocation();
  const { reduxState, reduxAction } = useReduxContext();
  const reduxStateRef = useRef(reduxState);
  const reduxDispatch = reduxAction.dispatch;

  const cartApiRequestQueue = useRef(new PQueue({ concurrency: 1 }));
  const debouncingProducts = useRef(cart.debouncingProducts);

  async function addProduct(product, { beforeAction } = {}) {
    if (beforeAction) {
      beforeAction(product);
    }

    const productSku = product.sku;

    const reduxState = reduxStateRef.current;
    const cart = reduxState.cart?.cart;

    if (
      handleUnauthenticatedUser({
        reduxState,
        history,
        ref: `${location.pathname}${location.search}`,
      }) ||
      handleUnknownShippingAddress({
        productSku,
        addProductSkusToCookies,
        reduxState,
        reduxDispatch,
        showDeliveryToolBar,
      })
    ) {
      return;
    }

    const transformedProduct =
      product.type_id === 'bundle'
        ? transformPackProduct(product)
        : transformProduct(product);

    reduxDispatch(addCartItem(transformedProduct));
    reduxDispatch(startLoadingCart());

    await cartApiRequestQueue.current.add(() =>
      addProductQueue({
        product,
        productSku,
        openAdultConfirmationModal,
        reduxState,
        reduxDispatch,
        cart,
        transformedProduct,
        setRetryProductSkus,
      }),
    );
    // Final action for any request.
    if (
      isIdleQueue(cartApiRequestQueue.current) &&
      debouncingProducts?.current?.length <= 0
    ) {
      reduxDispatch(endLoadingCart());
      fetchCart({ loadCart: true, loadCartTotals: true });
    }
  }

  async function addProductsFromCookies() {
    const reduxState = reduxStateRef.current;

    const currentAddress = reduxState.customer?.currentShipping;
    const retryProductSkus = Cookies.get('products_to_add_to_cart');

    if (!retryProductSkus || !currentAddress) {
      return;
    }

    try {
      const storeCode = reduxState.storeConfig?.current?.code;
      const productSkus = JSON.parse(retryProductSkus) || [];

      const { items } = await ProductApi.getBySkus({
        storeCode,
        skus: productSkus,
      });

      items?.forEach(product => {
        addProduct(product);
      });
    } finally {
      Cookies.remove('products_to_add_to_cart');
    }
  }

  async function changeProductQty({ productSku, qty }) {
    const product = find(
      reduxStateRef.current.cart?.cart?.items,
      item => item.sku === productSku,
    );

    if (!product) {
      return;
    }

    const memorizedQty = product?.qty;
    reduxDispatch(changeCartItemQty({ productSku, qty }));

    const stockQty = product?.extension_attributes?.stock_item?.qty;
    const maxSaleQty = product?.extension_attributes?.stock_item?.max_sale_qty;

    let newProductQty;
    if (qty > stockQty && qty <= maxSaleQty) {
      newProductQty = stockQty;
      await reduxDispatch(resetNotifyOutOfStock());
      reduxDispatch(notifyOutOfStock(productSku));
    } else if (qty > maxSaleQty) {
      newProductQty = maxSaleQty;
      await reduxDispatch(resetNotifyMaxQty());
      reduxDispatch(notifyMaxQty(productSku));
    } else {
      newProductQty = qty;
    }

    if (newProductQty !== qty) {
      reduxDispatch(changeCartItemQty({ productSku, qty: newProductQty }));
    }

    if (newProductQty !== memorizedQty) {
      reduxDispatch(startLoadingCart());

      await cartApiRequestQueue.current.add(() =>
        changeProductQtyQueue({
          changeProductQty,
          memorizedQty,
          newProductQty,
          productSku,
          reduxDispatch,
          reduxStateRef,
          history,
        }),
      );

      if (
        isIdleQueue(cartApiRequestQueue.current) &&
        debouncingProducts?.current?.length <= 0
      ) {
        reduxDispatch(endLoadingCart());
        fetchCart({ loadCart: true, loadCartTotals: true });
      }
    }
  }

  async function deleteCart() {
    const reduxState = reduxStateRef.current;
    const cartStore = reduxState.cart;
    const cart = cartStore?.cart;

    if (!cart?.id || !cartStore?.loaded) {
      return;
    }

    reduxDispatch(startLoadingCart());

    const cartResponse = await CartApi.deleteCart();

    if (cartResponse.data?.error) {
      const httpStatus = cartResponse.data?.status;

      if (httpStatus === 401) {
        handleUnauthorizedError({ history, unsetCookie });
        return;
      } else if (httpStatus === 404) {
        window.location.reload();
        return;
      }
      return;
    }

    // GTM
    dataLayer.push({
      event: 'eec.RemoveFromCart',
      ecommerce: {
        remove: {
          products: ProductListPriceInclTax(cart?.items),
        },
      },
      hit_timestamp: hitTimeStamp,
    });

    await fetchCart({ loadCart: true, loadCartTotals: true });
    cartApiRequestQueue.current.clear();
  }

  async function deleteProduct({ productSku }) {
    const reduxState = reduxStateRef.current;
    const cart = reduxState.cart?.cart;

    const memorizedProduct = find(cart?.items, item => item.sku === productSku);
    if (!memorizedProduct) {
      return;
    }

    reduxDispatch(deleteCartItem(productSku));
    reduxDispatch(startLoadingCart());

    await cartApiRequestQueue.current.add(() =>
      deleteProductQueue({ cartId: cart?.id, memorizedProduct, reduxDispatch }),
    );
    // Final action for any request.
    if (
      isIdleQueue(cartApiRequestQueue.current) &&
      debouncingProducts?.current?.length <= 0
    ) {
      reduxDispatch(endLoadingCart());
      fetchCart({ loadCart: true, loadCartTotals: true });
      reduxDispatch(fetchShippingMethods(cart?.id));
    }
  }

  async function deleteProductBundle({ productSkus = [] }) {
    const reduxState = reduxStateRef.current;
    const cartStore = reduxState.cart;
    const cart = cartStore?.cart;

    const deleteQty = countBy(productSkus);
    const uniqueProductSku = Object.keys(deleteQty);

    reduxDispatch(startLoadingCart());

    for (const productSku of uniqueProductSku) {
      const product = find(cart.items, item => item.sku === productSku);

      let remainingQty = product.qty - deleteQty?.[productSku];
      remainingQty = remainingQty < 0 ? 0 : remainingQty;

      reduxDispatch(changeCartItemQty({ productSku, qty: remainingQty }));

      try {
        await cartApiRequestQueue.current.add(() =>
          deleteProductBundleQueue({
            cartId: cart?.id,
            product,
            remainingQty,
            history,
          }),
        );
      } catch (_e) {
        return;
      }
    }

    if (
      isIdleQueue(cartApiRequestQueue.current) &&
      debouncingProducts?.current?.length <= 0
    ) {
      reduxDispatch(endLoadingCart());
      fetchCart({ loadCart: true, loadCartTotals: true });
      reduxDispatch(fetchShippingMethods(cart?.id));
    }
  }

  async function fetchCart({ loadCart = false, loadCartTotals = false } = {}) {
    const reduxState = reduxStateRef.current;

    if (!isLoggedIn(reduxState)) {
      return;
    }

    reduxDispatch(startLoadingCart());

    const cart = reduxState.cart?.cart;
    const cartId = cart?.id;
    const cartLoad = cartId ? loadCart : true;
    const totalsLoad = cartId ? loadCartTotals : true;

    try {
      const cartResponse = await CartApi.get(cartId, cartLoad);

      if (cartResponse.data?.cart?.isStoreNotMatch) {
        return window.location.reload();
      }

      const fetchCartTotalsResult = fetchCartTotals(cartId, totalsLoad);
      const cartTotalsResponse = await reduxDispatch(fetchCartTotalsResult);

      if (cartResponse && cartTotalsResponse) {
        const fetchedCart = cartResponse?.data?.cart;
        const baseMediaUrl = reduxState?.storeConfig?.current?.base_media_url;

        const productItems = map(
          merge(fetchedCart.items, cartTotalsResponse.items),
          item => ({
            ...item,
            imageUrl: `${baseMediaUrl}catalog/product${item.image}`,
          }),
        );

        const updatedCart = {
          ...fetchedCart,
          items: productItems,
        };

        // GTM Abandon Cart
        const products = updatedCart.items?.map(item => ProductEmarsys(item));
        dataLayer.push({
          event: 'CartContentUpdate',
          CartContent: products,
        });

        const formatCart = formatCartBundle(updatedCart);
        await reduxDispatch(fetchCartCompleted(formatCart));

        return formatCart;
      }
    } catch (e) {
      reduxDispatch(fetchCartFail());
    }
  }

  function closeAdultConfirmationModal() {
    setAdultConfirmationModal({ selectedProduct: null, isShow: false });
  }

  function openAdultConfirmationModal(product) {
    setAdultConfirmationModal({ selectedProduct: product, isShow: true });
  }

  function submitAdultConfirmationModal({ isAdult, productToAdd }) {
    if (isAdult) {
      Cookies.set('confirm_age_20_up', true, { expires: 1 });
      addProduct(productToAdd);
    }

    closeAdultConfirmationModal();
  }

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (reduxState?.cart?.cart?.id) {
      addProductsFromCookies();
    }
  }, [reduxState?.cart?.cart?.id]);

  useEffect(() => {
    if (
      retryProductSkus.length > 0 &&
      isIdleQueue(cartApiRequestQueue.current)
    ) {
      addProductSkusToCookies(retryProductSkus);
      setRetryProductSkus([]);
      window.location.reload();
    }
  }, [retryProductSkus]);

  useEffect(() => {
    reduxStateRef.current = reduxState;
  }, [reduxState]);

  useEffect(() => {
    debouncingProducts.current = cart.debouncingProducts;
  }, [cart.debouncingProducts]);

  const cartAction = useMemo(
    () => ({
      ...CartAction({ cart, cartDispatch }),
      addProduct,
      changeProductQty,
      deleteCart,
      deleteProduct,
      deleteProductBundle,
      fetchCart,

      closeAdultConfirmationModal,
      openAdultConfirmationModal,
      submitAdultConfirmationModal,
    }),
    [cart],
  );

  const cartStore = {
    cart,
    adultConfirmationModal,
    cartAction,
  };

  return (
    <CartContext.Provider value={cartStore}>{children}</CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
