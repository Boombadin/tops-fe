import React, { useState } from 'react';
import styled from 'styled-components';

import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

const CVVInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 10px;
`;

const ButtonTooltip = styled.div`
  cursor: pointer;
`;

const CVVTextInfo = styled.span`
  color: #0488cc;
  margin-left: 4px;
  line-height: 2;
`;

const TooltipWrapper = styled.div`
  margin: 0 0 2px 15px;
  align-self: center;
  position: relative;

  @media only screen and (max-width: 480px) {
    margin: 0 0 2px 11px;
  }
`;

const TooltipContent = styled.div`
  width: 211px;
  position: absolute;
  background: #ffffff;
  border-radius: 10px;
  bottom: 35px;
  right: -55px;
  border: 1px solid #f2f2f2;
  box-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.05);
  min-height: 152px;

  &:after {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    bottom: -9px;
    left: 45%;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid #ffffff;
  }
`;

const Tooltip = props => {
  const {
    translate,
    children,
    uniqueId = '',
    buttonContent = null,
    buttonClassName = '',
  } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const handleToggleTooltip = value => {
    setShowTooltip(value);
  };
  return (
    <TooltipWrapper>
      <ButtonTooltip
        data-testid={generateTestId({
          type: ELEMENT_TYPE.BUTTON,
          action: ELEMENT_ACTION.VIEW,
          moduleName: 'Tooltip',
          uniqueId,
        })}
        className={buttonClassName}
        onClick={() => handleToggleTooltip(!showTooltip)}
      >
        {buttonContent ? (
          <React.Fragment>{buttonContent}</React.Fragment>
        ) : (
          // <MdHelpCircle fontSize="18px" color="#aaa" />
          <CVVInfo>
            <img src="/assets/icons/question-cvv.svg" />
            <CVVTextInfo>
              {translate('payment.credit_card.tooltip.cvv.title')}
            </CVVTextInfo>
          </CVVInfo>
        )}
      </ButtonTooltip>
      {showTooltip && (
        <TooltipContent
          className="tooltip-position-bottom"
          onClick={() => handleToggleTooltip(false)}
          data-testid={generateTestId({
            type: ELEMENT_TYPE.INFO,
            action: ELEMENT_ACTION.VIEW,
            moduleName: 'Tooltip-Content',
            uniqueId,
          })}
        >
          {children}
        </TooltipContent>
      )}
    </TooltipWrapper>
  );
};

export default withLocales(Tooltip);
