import { breakpoint } from '@central-tech/core-ui';
import React from 'react';
import styled from 'styled-components';

import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

const OrderTracking = styled.button`
  width: 100px;
  height: 32px;
  font-size: 13px;
  align-self: center;
  min-width: 80px;
  max-width: 120px;
  padding: 5px 0;
  line-height: 22px;
  font-weight: bold;
  border-radius: 5px;
  border: solid 1px #ed1d23;
  background-color: #ed1d23;
  color: #ffffff;
  cursor: pointer;
  margin: 0 8px 0 27px;
  ${breakpoint('xs', 'md')`
    width: 100%;
    height: 36px;
    max-width: none;
    margin: 0 0 5px 0;
  `}
`;

const TrackOrderButton = ({ translate, orderId, handleTrackClick }) => {
  return (
    <OrderTracking
      data-testid={generateTestId({
        type: ELEMENT_TYPE.BUTTON,
        action: ELEMENT_ACTION.VIEW,
        moduleName: 'TrackOrderButton',
        uniqueId: `handleTrackClick-${orderId}`,
      })}
      onClick={handleTrackClick}
      color="#544943"
      radius={5}
    >
      {translate('order_history.table.track_order')}
    </OrderTracking>
  );
};

export default withLocales(TrackOrderButton);
