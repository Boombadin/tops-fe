import { format } from 'date-fns';
import addHours from 'date-fns/add_hours';
import { isEmpty } from 'lodash';
import React, { Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import TrackOrderButton from '@/client/features/orderHistory/components/TrackOrderButton';
import { validURL } from '@/client/utils/order';
import withLocales from '@client/hoc/withLocales';
import { Loader } from '@client/magenta-ui';
import { formatPrice } from '@client/utils/price';

import './OrderHistory.scss';

import OrderAddress from './elements/OrderAddress';
import ReorderButton from './ReorderButton';

const DesktopOrdersTable = ({
  lang,
  orders,
  translate,
  loading,
  onLoadmore,
  hasMoreItems,
  loadMore,
  disabled,
  handleOpenTrackClick,
}) => {
  const timezoneBangkok = 7;

  return isEmpty(orders) ? null : (
    <Fragment>
      <div className="table-title">
        <span className="number">
          {translate('order_history.table.number')}
        </span>
        <span className="date">{translate('order_history.table.date')}</span>
        <span className="status">
          {translate('order_history.table.status')}
        </span>
        <span className="price">{translate('order_history.table.price')}</span>
        <span className="address">
          {translate('order_history.table.address')}
        </span>
        <span className="no-title" />
      </div>
      {loadMore ? (
        <InfiniteScroll
          className="product-grid--infinite"
          element="div"
          pageStart={1}
          hasMore={hasMoreItems}
          loader={null}
          threshold={10}
          loadMore={onLoadmore}
        >
          {orders.map(order => (
            <div className="table-row">
              <span className="number">
                <a
                  href={`/${lang?.url || 'th'}/order-detail/${
                    order?.entity_id
                  }`}
                >
                  {order?.increment_id}
                </a>
              </span>
              <span className="date-time">
                <span className="date">
                  {format(
                    addHours(order.created_at, timezoneBangkok),
                    'DD/MM/YY',
                  )}
                </span>
                <span className="time">
                  {format(addHours(order.created_at, timezoneBangkok), 'HH:mm')}
                </span>
              </span>
              {order?.extension_attributes?.order_status ? (
                <span
                  className={`status ${order?.extension_attributes?.order_status}`}
                >
                  {order?.extension_attributes?.order_status}
                </span>
              ) : (
                <span className={`status new`}>
                  {translate('order_history.status.new')}
                </span>
              )}
              <span className="price">
                {formatPrice(order?.base_grand_total)}
              </span>
              <OrderAddress {...order?.extension_attributes} />
              <div className="re-order-button">
                {order?.extension_attributes?.tracking_info?.length > 0 &&
                  validURL(
                    order?.extension_attributes?.tracking_info[0]?.track_link,
                  ) && (
                    <TrackOrderButton
                      orderId={order?.entity_id}
                      handleTrackClick={() =>
                        handleOpenTrackClick(
                          order?.extension_attributes?.tracking_info[0]
                            ?.track_link,
                        )
                      }
                    />
                  )}
                <ReorderButton orderId={order.entity_id} disabled={disabled} />
              </div>
            </div>
          ))}
          {loading && <Loader className="load-more" active inline="centered" />}
        </InfiniteScroll>
      ) : (
        ''
      )}
    </Fragment>
  );
};

export default withLocales(DesktopOrdersTable);
