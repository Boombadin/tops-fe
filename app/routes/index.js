import Express from 'express';
import { cache } from '../utils/redis';
import cartController from '../controllers/cartController';
import categoryController from '../controllers/categoryController';
import cmsController from '../controllers/cmsController';
import productController from '../controllers/productController';
import t1pController from '../controllers/t1pController';
import customerController from '../controllers/customerController';
import storeConfigController from '../controllers/storeConfigController';
import cmsBlockController from '../controllers/cmsBlockController';
import regionController from '../controllers/regionController';
import shippingAddressController from '../controllers/shippingAddressController';
import checkoutController from '../controllers/checkoutController';
import subscriptionController from '../controllers/subscriptionController';
import urlRewriteController from '../controllers/urlRewriteController';
import wishlistController from '../controllers/wishlistController';
import orderController from '../controllers/orderController';
import searchController from '../controllers/searchController';
import bannerController from '../controllers/bannerController';
import zendeskController from '../controllers/zendeskController';
import mdcController from '../controllers/mdcController';
import authController from '../controllers/authController';
import nybController from '../controllers/nybController';
import deeplinkController from '../controllers/deeplinkController';
import megaMenuController from '../controllers/megaMenuController';
import consentController from '../controllers/consentController';

const router = Express.Router();

// CMS Block Api
router.get('/cmsblock/:slug', cache, cmsBlockController.getAll);

// Store Config Api
router.get('/store/config', storeConfigController.fetch);
router.get('/store/config/default', storeConfigController.fetchDefaultConfig);
router.get('/store/config/seller', storeConfigController.fetchBySellerCode);
router.get('/store/delete', storeConfigController.deleteStoreConfigsCache);
router.get(
  '/store/default/delete',
  storeConfigController.deleteDefaultStoreConfigsCache,
);
// T1P Api
router.get('/t1p/login', t1pController.loginT1P);
router.get('/t1p/callback', t1pController.callback);

// Customer Api
router.get('/customer', customerController.getData);
router.put('/customer/update', customerController.update);
router.get('/customer/group', customerController.fetchCustomerGroup);
router.post('/customer/addAddress', customerController.createAddress);
router.put('/customer/updateAddress', customerController.updateAddress);
router.delete('/customer/deleteAddress', customerController.deleteAddress);
router.get('/customer/shippingInfo', customerController.getShippingInfo);
router.put(
  '/customer/updateShippingInfo',
  customerController.updateShippingInfo,
);

// Subscription Api
router.post('/subscription/guest', subscriptionController.addGuestSubscription);

// Cart Api
router.get('/cart', cartController.get);
router.post('/cart/addItem', cartController.addItem);
router.delete('/cart/deleteItem', cartController.deleteItem);
router.post('/cart', cartController.createCart);
router.delete('/cart/deleteItemBundle', cartController.deleteItemBundle);
router.delete('/cart/deleteAll', cartController.deleteAll);
router.put('/cart/changeItemQty', cartController.changeItemQty);
router.put(
  '/cart/setCustomerPreferences',
  cartController.setCustomerPreferences,
);
router.get('/cart/shippingMethods', cartController.getShippingMethods);
router.post('/cart/transfer', cartController.transfer);
router.post(
  '/cart/updateDiffCartProduct',
  cartController.updateDiffCartProduct,
);
// router.post('/cart/replaceMulti', cartController.transfer);
router.post('/cart/valify', cartController.valify);
router.put('/cart/putCoupon', cartController.putCoupon);
router.delete('/cart/deleteCoupon', cartController.deleteCoupon);
router.delete('/cart/deleteCart', cartController.deleteCart);
router.get('/cart/totals', cartController.getTotals);

// Category Api
router.get('/categories', cache, categoryController.getAll);
router.get('/categories/:id/products', cache, categoryController.getProducts);
router.get('/categories/productSets', cache, categoryController.getProductSets);
router.get('/categories/:slug', cache, categoryController.getOne);

// Cms Api
router.get('/cms/search/', cmsController.search);

// Product
router.get('/products', cache, productController.fetch);
router.get('/products-by-skus', productController.fetchBySkus);
router.get(
  '/products/catalog-service',
  productController.fetchCatalogServiceBySku,
);
router.get('/products/set', cache, productController.fetchSet);
router.get(
  '/products/campaignCatalog',
  cache,
  productController.fetchCampaignCatalog,
);
router.get('/products/promotions/', cache, productController.fetchPromotion);
router.get('/products/:slug', cache, productController.fetchOne);
router.get(
  '/products/:key/:slug/:condition',
  cache,
  productController.fetchByFilter,
);
router.get('/relative-products/:sku', cache, productController.fetchRelative);
router.get('/product/similarity', productController.fetchProductSimilarity);
router.get('/product/association', productController.fetchProductAssociation);
router.get(
  '/product/recommendations',
  cache,
  productController.fetchProductRecommendPersonal,
);
router.get(
  '/product/recommendations/items',
  cache,
  productController.fetchProductRecommendPersonalWithItem,
);

// Region API
router.get('/region/province', cache, regionController.getProvince);
router.get('/region/district', cache, regionController.getDistrict);
router.get('/region/subdistrict', cache, regionController.getSubDistrict);
router.get('/region/postcode', cache, regionController.getRegionByPostcode);

router.post(
  '/shipping/current',
  shippingAddressController.setCurrentShippingAddress,
);

// Checkout
router.get('/checkout/payment', checkoutController.getAllPayment);
router.get('/checkout/storeCard', checkoutController.getStoreCard);
router.post('/checkout/createOrder', checkoutController.createOrder);
router.post(
  '/checkout/addDeliverySlot',
  checkoutController.addDeliverySlotInfo,
);
router.get(
  '/checkout/validateDeliverySlot',
  checkoutController.validateDeliverySlot,
); // MDC V2.3
router.post('/checkout/pay2c2p', checkoutController.createOrderPay2c2p);
router.delete('/checkout/deleteStoreCard', checkoutController.deleteStoreCard);
router.get('/checkout/storelocator', checkoutController.getStorLocator);
router.get('/checkout/storePickUpSlot', checkoutController.getStorPickUpSlot);
router.get('/checkout/deliverySlot', checkoutController.getDeliverySlot); // MDC V2.3
router.delete('/checkout/deliverySlot', checkoutController.deleteDeliverySlot); // MDC V2.3

// Search
router.get('/search/products', cache, searchController.fetchProducts);
router.get('/search/suggestions', cache, searchController.fetchSuggestions);

// Url Rewrite
router.get('/url-rewrite/:path', cache, urlRewriteController.get);

// Wishlist
router.get('/wishlist/mine/products', wishlistController.getProducts);
router.get('/wishlist/mine', wishlistController.get);
router.post('/wishlist/items', wishlistController.addItem);
router.delete('/wishlist/items/:itemProductId', wishlistController.removeItem);

// Order
router.get('/order/:id', orderController.get);
router.get(
  '/order/incrementId/:increment_id',
  orderController.getOneByIncrementId,
);
router.get('/orders/:customerId/:pageNumber', orderController.getAll);

// Banner
router.get('/banners', cache, bannerController.get);

// Zendesk
router.post('/zendesk-ticket', zendeskController.postTicket);

// Auth
router.get('/mdc/authorization', mdcController.decryptToken);

// Account
router.post('/register', authController.register);
router.get('/isEmailAvailable/:email', authController.isEmailAvailable);
router.put('/account/forgot-password', authController.forgotPassword);
router.post('/account/reset-password', authController.resetPassword);
router.get('/tops/callback', authController.callback);
router.get('/tops/set-store-token', authController.setTokenAndStore);

// Consent
router.get('/consent', consentController.fetch);
router.post('/consent', consentController.updateUserConsent);
router.post('/consent/user-info', consentController.fetchUserConsent);

// Auth Magento
router.post('/login', authController.login);
router.post('/socialLogin', authController.socialLogin);

// NYB
router.post('/nyb/calculate', nybController.calculate);
router.get('/nyb/calculate/step-1/:discountType', nybController.calculateStep1);
router.get('/nyb/calculate/step-2/:issue', nybController.calculateStep2);
router.get('/nyb/discount-type', nybController.selectDiscoutType);

// Deeplink
router.post('/deeplink', deeplinkController.deeplink);

// Mega Menu
router.get('/mega-menu/search', cache, megaMenuController.fetch);

export default router;
