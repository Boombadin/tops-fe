import React from 'react';
import styled from 'styled-components';

import withLocales from '@client/hoc/withLocales';
import { Loader } from '@client/magenta-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

const ReorderButtonWrapper = styled.div`
  border-radius: 1px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 28px;

  @media (max-width: 991px) {
    padding: 0 16px;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  border-top: solid 1px #ededed;
  margin-top: 9px;
`;

const FooterButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 991px) {
    justify-content: center;
    flex-direction: column;
  }
`;

const TrackingButton = styled.button`
  width: 293px;
  height: 36px;
  border-radius: 5px;
  border: solid 1px #ed1d23;
  background-color: #ed1d23;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  margin: 31px 10px 29px 0;

  @media (max-width: 991px) {
    width: 100%;
    margin: 16px 0 6px 0;
  }
`;

const ReorderButton = styled.button`
  width: 293px;
  height: 36px;
  border-radius: 5px;
  border: solid 1px #ed1d23;
  background-color: #ffffff;
  color: #544943;
  font-size: 13px;
  font-weight: bold;
  margin: 31px 0 29px;

  @media (max-width: 991px) {
    width: 100%;
    margin: 0 0 22px 0;
  }
`;

const OrderDetailButtonFooter = ({
  orderId,
  translate,
  loadingReorder,
  orderTracking,
  handleTrackClick,
  handleReorderClick,
}) => {
  return (
    <ReorderButtonWrapper>
      <Line />
      <FooterButtonWrapper>
        {orderTracking && (
          <TrackingButton
            data-testid={generateTestId({
              type: ELEMENT_TYPE.BUTTON,
              action: ELEMENT_ACTION.VIEW,
              moduleName: 'OrderDetailButtonFooter',
              uniqueId: `handleTrackClick-${orderId}`,
            })}
            onClick={handleTrackClick}
            disabled={loadingReorder}
          >
            {translate('order_history.table.track_order')}
          </TrackingButton>
        )}
        <ReorderButton
          data-testid={generateTestId({
            type: ELEMENT_TYPE.BUTTON,
            action: ELEMENT_ACTION.ADD,
            moduleName: 'OrderDetailButtonFooter',
            uniqueId: `handleReorderClick-${orderId}`,
          })}
          onClick={handleReorderClick}
          disabled={loadingReorder}
        >
          {loadingReorder ? (
            <Loader
              data-testid={`view-loading-reorder-${orderId}`}
              active
              inline
              size="small"
            />
          ) : (
            translate('order_history.table.repeat')
          )}
        </ReorderButton>
      </FooterButtonWrapper>
    </ReorderButtonWrapper>
  );
};
export default withLocales(OrderDetailButtonFooter);
