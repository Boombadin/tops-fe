import { format } from 'date-fns';
import addHours from 'date-fns/add_hours';
import { isEmpty } from 'lodash';
import React, { Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import styled from 'styled-components';

import TrackOrderButton from '@/client/features/orderHistory/components/TrackOrderButton';
import { validURL } from '@/client/utils/order';
import withLocales from '@client/hoc/withLocales';
import { Loader } from '@client/magenta-ui';
import { formatPrice } from '@client/utils/price';

import { OrderAddress } from './elements';
import ReorderButton from './ReorderButton';

const ButtonFooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 32px;
`;

const timezoneBangkok = 7;
const MobileOrdersTable = ({
  orders,
  translate,
  lang,
  loading,
  onLoadmore,
  hasMoreItems,
  loadMore,
  disabled,
  handleOpenTrackClick,
}) => {
  return isEmpty(orders) ? null : (
    <Fragment>
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
            <div className="mobile-table-row">
              <div className="info-row">
                <span className="title">
                  {translate('order_history.table.number')}
                </span>
                <span className="number">
                  <a
                    href={`/${lang?.url || 'th'}/order-detail/${
                      order?.entity_id
                    }`}
                  >
                    {order?.increment_id}
                  </a>
                </span>
              </div>
              <div className="info-row">
                <span className="title">
                  {translate('order_history.table.date')}
                </span>
                <span className="date-time">
                  <span className="date">
                    {format(
                      addHours(order.created_at, timezoneBangkok),
                      'DD/MM/YY',
                    )}
                  </span>
                  <span className="time">
                    {format(
                      addHours(order.created_at, timezoneBangkok),
                      'HH:mm',
                    )}
                  </span>
                </span>
              </div>
              <div className="info-row">
                <span className="title">
                  {translate('order_history.table.status')}
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
              </div>
              <div className="info-row">
                <span className="title">
                  {translate('order_history.table.price')}
                </span>
                <span className="price">
                  {formatPrice(order?.base_grand_total)}
                </span>
              </div>
              <div className="info-row">
                <span className="title">
                  {translate('order_history.table.address')}
                </span>
                <OrderAddress
                  translate={translate}
                  {...order.extension_attributes}
                />
              </div>
              <ButtonFooterWrapper>
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
              </ButtonFooterWrapper>
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

export default withLocales(MobileOrdersTable);
