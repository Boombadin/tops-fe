import React from 'react';
import styled from 'styled-components';

import Tooltip from '@client/components/Tooltip';
import { TextGuide } from '@client/components/Typography';
import withLocales from '@client/hoc/withLocales';

const TooltipContent = styled.div`
  padding: 20px 22px;
  min-height: 152px;
`;

const ImageCvvDetail = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const TooltipCvv = ({ translate }) => {
  return (
    <Tooltip uniqueId={'cvv_info'}>
      <TooltipContent>
        <ImageCvvDetail>
          <img src="/assets/icons/cvv.svg" />
        </ImageCvvDetail>
        <TextGuide type="caption-3" align="center">
          {translate('payment.credit_card.tooltip.cvv.detail')}
        </TextGuide>
      </TooltipContent>
    </Tooltip>
  );
};

export default withLocales(TooltipCvv);
