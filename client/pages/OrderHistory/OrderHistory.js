import { FullScreenLoading } from '@central-tech/core-ui';
import { find, get, isEmpty, map, reduce, size, unionBy } from 'lodash';
import pt from 'prop-types';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { checkLimitQty } from '@/client/utils/order';
import OrderLimitQtyModal from '@client/features/order/OrderLimitQtyModal';

import './OrderHistory.scss';

import ProductApi from '../../apis/product';
import Layout from '../../components/Layout';
import MetaTags from '../../components/MetaTags';
import { Desktop, Tablet } from '../../components/Responsive';
import Tabbar from '../../components/Tabbar';
import CartItemsDifferentModal from '../../features/modal/CartItemsDifferentModal';
import { addItems } from '../../reducers/cart';
import { fetchOrders, reorderToCart } from '../../reducers/order';
import { getCurrentStoreConfigSelector, langSelector } from '../../selectors';
import { countDiffItems } from '../../utils/diffItemCheck';
import { fullpathUrl } from '../../utils/url';
import { Context } from './Context';
import DesktopOrdersTable from './DesktopOrdersTable';
import { Breadcrumbs } from './elements';
import MobileOrdersTable from './MobileOrdersTable';
import { OrderBanner } from './OrderBanner';

class OrderHistory extends Component {
  static propTypes = {
    translate: pt.func.isRequired,
    orders: pt.array.isRequired,
    customer: pt.object.isRequired,
    getOrders: pt.func.isRequired,
    storeConfig: pt.object.isRequired,
    ordersSearch: pt.object.isRequired,
    ordersTotal: pt.number.isRequired,
  };

  static initialState = (state, dispatch) => {
    const customerId = get(state, 'customer.items.id');
    return dispatch(fetchOrders(customerId));
  };

  state = {
    itemsMissingModal: {
      show: false,
      items: [],
    },
    processedOrderId: '',
    hasMoreItems: false,
    loadingReorder: false,
    modalValidateOpened: false,
    modalValidateMessage: '',
  };

  componentDidMount() {
    if (isEmpty(this.props.orders)) {
      this.fetchInitialData();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.ordersSearch && nextProps.ordersTotal) {
      const currentPage = nextProps.ordersSearch.current_page;
      const pageSize = nextProps.ordersSearch.page_size;
      const productsTotal = nextProps.ordersTotal;

      const fetchOrderOver =
        nextProps.loading === false && currentPage * pageSize > productsTotal;

      if (fetchOrderOver) {
        this.setState({ hasMoreItems: false });
      }
    }
  }

  fetchInitialData() {
    const { customer } = this.props;

    if (!get(customer, 'id', '')) {
      this.props.history.push('/');
    }

    this.fetchOrders(get(customer, 'id'), 1);
    this.setState({ hasMoreItems: true });
  }

  fetchOrders(customerId, page) {
    const { getOrders, customer } = this.props;

    if (!get(customer, 'id', '')) {
      this.props.history.push('/');
    }

    getOrders(get(customer, 'id'), page);
    this.setState({ hasMoreItems: true });
  }

  confirmReorder = async () => {
    this.setState({
      itemsMissingModal: {
        show: false,
        items: [],
      },
    });
  };

  handleReorderClick = async orderId => {
    this.setState({
      processedOrderId: orderId,
      loadingReorder: true,
    });
    const { loadingReorder } = this.state;
    const { orders, storeConfig, cart } = this.props;
    const { code: storeCode } = storeConfig;
    const order = find(orders, { entity_id: orderId });

    const skus = map(get(order, 'items', []), item => get(item, 'sku', ''));
    const { items: products } = await ProductApi.getCatalogServiceBySku({
      storeCode,
      skus,
    });

    const diffItems = countDiffItems(
      map(get(order, 'items', []), item => ({
        ...item,
        qty: get(item, 'qty_ordered', 1),
      })),
      products,
      storeConfig,
      cart,
    );

    let productsToAdd = reduce(
      get(order, 'items', []),
      (acc, item) => {
        const product = find(products, { sku: get(item, 'sku', '') });

        if (!product) return acc;

        return [
          ...acc,
          {
            ...product,
            ...item,
            qty: get(item, 'qty_ordered', 1),
          },
        ];
      },
      [],
    );
    if (!isEmpty(diffItems)) {
      const updateItems = [];
      map(productsToAdd, item => {
        const diffItem = find(diffItems, { sku: get(item, 'sku', '') });
        const findTypeErrorNotAvailable = find(
          get(diffItem, 'error', []),
          val => {
            return (
              val?.text === 'out_of_stock' ||
              val?.text === 'not_available' ||
              val?.text === 'product_disabled'
            );
          },
        );

        if (
          isEmpty(diffItem) ||
          (!isEmpty(diffItem) && isEmpty(findTypeErrorNotAvailable))
        ) {
          updateItems.push(item);
        }
      });

      this.itemsToAdd = reduce(
        updateItems,
        (acc, item) => {
          const diffItem = find(diffItems, { sku: get(item, 'sku', '') });

          if (!diffItem) {
            return acc.concat(item);
          }

          const findTypeErrorNotEnoughQuant = find(
            get(diffItem, 'error', []),
            val => {
              return (
                val?.text === 'not_enough_quant' || val?.text === 'max_qty'
              );
            },
          );

          if (!isEmpty(findTypeErrorNotEnoughQuant)) {
            return acc.concat({
              ...item,
              qty: findTypeErrorNotEnoughQuant?.missingQuantity || 1,
            });
          }

          return acc.concat({
            ...item,
          });
        },
        [],
      );

      productsToAdd = this.itemsToAdd;
    }

    const compareProduct = unionBy(
      productsToAdd,
      get(cart, 'items', []),
      'sku',
    );

    if (checkLimitQty(compareProduct)) {
      this.setState({
        loadingReorder: false,
        modalValidateOpened: true,
        modalValidateMessage: this.props.translate(
          'product.notification.reorder_limit_qty_200',
        ),
        processedOrderId: '',
      });
      return;
    }

    if (!loadingReorder) {
      const response = await this.props.reorderToCart(productsToAdd, diffItems);

      if (size(response?.diffItems) > 0) {
        this.setState({
          itemsMissingModal: {
            show: true,
            items: response.diffItems,
          },
        });
      }

      this.setState({
        processedOrderId: '',
        loadingReorder: false,
      });
    }
  };

  handleBack = () => {
    this.props.history.push('/profile');
  };

  openTrackClick = url => {
    window.open(url, '_blank');
  };

  handleCloseModalLimitQty = () => {
    this.setState({
      modalValidateOpened: false,
      modalValidateMessage: '',
    });
  };

  render() {
    const { orders, translate, loading, customer, loaded } = this.props;
    const { itemsMissingModal, processedOrderId } = this.state;
    return (
      <Layout
        title={translate('order_history.order_history')}
        onHandleBack={this.handleBack}
        backLabelButton={translate('right_menu.profile.profile')}
      >
        <MetaTags
          canonicalUrl={fullpathUrl(this.props.location)}
          title={translate('meta_tags.order_history.title')}
          keywords={translate('meta_tags.order_history.keywords')}
          description={translate('meta_tags.order_history.description')}
        />

        <Tabbar />

        <Breadcrumbs />

        <Context.Provider
          value={{
            reorder: this.handleReorderClick,
            processedOrderId,
          }}
        >
          <div className="order-history-root">
            <Desktop>
              <OrderBanner
                src="/assets/images/history_banner.png"
                title={translate('order_history.order_history')}
              />
              <DesktopOrdersTable
                orders={orders}
                loading={loading}
                loadMore
                hasMoreItems={this.state.hasMoreItems && !this.props.loading}
                onLoadmore={page => this.fetchOrders(customer.id, page)}
                disabled={this.state.loadingReorder}
                handleOpenTrackClick={this.openTrackClick}
              />
            </Desktop>
            <Tablet>
              <MobileOrdersTable
                orders={orders}
                loading={loading}
                loadMore
                hasMoreItems={this.state.hasMoreItems && !this.props.loading}
                onLoadmore={page => this.fetchOrders(customer.id, page)}
                disabled={this.state.loadingReorder}
                handleOpenTrackClick={this.openTrackClick}
              />
            </Tablet>
          </div>
        </Context.Provider>

        <OrderLimitQtyModal
          visible={this.state.modalValidateOpened}
          message={this.state.modalValidateMessage}
          onModalClose={() => this.handleCloseModalLimitQty()}
        />

        <CartItemsDifferentModal
          open={itemsMissingModal.show}
          products={itemsMissingModal.items}
          handleTransferCart={() => this.confirmReorder()}
        />
        {loading ||
          (!loaded && (
            <FullScreenLoading
              icon="/assets/icons/loader-2.gif"
              width="100px"
              height="auto"
            />
          ))}
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  orders: state.order.items,
  loading: state.order.loading,
  ordersSearch: state.order.search_criteria,
  ordersTotal: state.order.total_count,
  customer: state.customer.items,
  storeConfig: getCurrentStoreConfigSelector(state),
  lang: langSelector(state),
  cart: state.cart.cart,
  loaded: state.cart.loaded,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getOrders: fetchOrders,
      addItems,
      reorderToCart,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
