import { breakpoint } from '@central-tech/core-ui';
import React from 'react';
import styled from 'styled-components';

import withLocales from '@client/hoc/withLocales';
import { Loader } from '@client/magenta-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

import { Context } from './Context';

const Reorder = styled.button`
  width: 100px;
  height: 32px;
  font-size: 13px;
  align-self: center;
  min-width: 80px;
  max-width: 120px;
  padding: 5px 0;
  line-height: 22px;
  font-weight: 700;
  border-radius: 5px;
  border: solid 1px #ed1d23;
  background-color: #ffffff;
  color: #544943;
  cursor: pointer;
  ${breakpoint('xs', 'md')`
    width: 100%;
    height: 36px;
    max-width: none;

  `}
`;

const ReorderButton = ({ translate, orderId, disabled }) => {
  return (
    <Context.Consumer>
      {({ processedOrderId, reorder }) => (
        <Reorder
          data-testid={generateTestId({
            type: ELEMENT_TYPE.BUTTON,
            action: ELEMENT_ACTION.ADD,
            moduleName: 'Reorder',
            uniqueId: `reorder-${orderId}`,
          })}
          onClick={() => reorder(orderId)}
          disabled={disabled}
          color="#544943"
          radius={5}
        >
          {processedOrderId === orderId ? (
            <Loader active inline size="mini" />
          ) : (
            translate('order_history.table.repeat')
          )}
        </Reorder>
      )}
    </Context.Consumer>
  );
};

export default withLocales(ReorderButton);
