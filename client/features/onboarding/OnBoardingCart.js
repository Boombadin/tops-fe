import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Icon, Tooltip, Button, breakpoint } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';
import { TextGuide } from '../../components/Typography';

const OnBoardingWrapper = styled.div`
  display: flex;
  width: 330px;
  height: auto;
  align-items: center;
  justify-content: space-between;

  ${breakpoint('xs', 'md')`
    width: 280px;
    padding: 1px 0 0;
  `}
`;

const OnBoardingSection = styled.div`
  > .onboarding-cart-wrapper {
    ${props => props.showOnBoarding && 'z-index: 1000;'}
  }
`;

const OnBoardingIcon = styled(Icon)`
  margin-left: 20px;
  margin-right: 10px;
`;

const ButtonOnBoardingNextStep = styled(Button)`
  flex: 0 0 60px;
  padding: 0;
  border-radius: 0 3px 3px 0px;
  border-left: 1px solid #f4f4f4;
`;

function OnBoardingCart({
  showOnBoarding,
  onClickBoardingNextStep,
  children,
  translate,
}) {
  return (
    <OnBoardingSection>
      <Tooltip
        className="onboarding-cart-wrapper"
        align="right"
        show={showOnBoarding}
        disabled={!showOnBoarding}
        radius={5}
        border="1px solid #e8e8e8"
        renderTooltip={
          <OnBoardingWrapper>
            <OnBoardingIcon
              width={30}
              src="/assets/icons/ic_onboading_cart.png"
            />
            <TextGuide type="body" color="#121212" lineHeight="20px">
              {translate('onboarding.cart')}
            </TextGuide>
            <ButtonOnBoardingNextStep
              size={12}
              height={60}
              color="#ffffff"
              hoverColor="#ffffff"
              textColor="#ec1d24"
              onClick={onClickBoardingNextStep}
            >
              {translate('onboarding.button.close')}
            </ButtonOnBoardingNextStep>
          </OnBoardingWrapper>
        }
      >
        {children}
      </Tooltip>
    </OnBoardingSection>
  );
}

export default withRouter(withLocales(OnBoardingCart));
