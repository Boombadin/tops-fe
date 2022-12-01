import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Icon, Tooltip, Button, breakpoint } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';
import { TextGuide } from '../../components/Typography';

const OnBoardingWrapper = styled.div`
  display: flex;
  width: 330px;
  /* height: 60px; */
  height: auto;
  align-items: center;
  justify-content: space-between;

  ${breakpoint('xs', 'md')`
    width: 280px;
    padding: 1px 0 0;
  `}
`;

const OnBoardingSection = styled.div`
  > .onboarding-delivery-wrapper {
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

function OnBoardingDelivery({
  showOnBoarding,
  onClickBoardingNextStep,
  children,
  translate,
}) {
  // useEffect(() => {
  //   const screenMobile = window.matchMedia('(max-width: 769px)');
  //   if (showOnBoarding && screenMobile.matches) {
  //     document.documentElement.style.overflow = 'hidden';
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.documentElement.style.overflow = 'auto';
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [showOnBoarding]);

  return (
    <OnBoardingSection showOnBoarding={showOnBoarding}>
      <Tooltip
        className="onboarding-delivery-wrapper"
        align="center"
        show={showOnBoarding}
        disabled={!showOnBoarding}
        radius={5}
        border="1px solid #e8e8e8"
        renderTooltip={
          <OnBoardingWrapper>
            <OnBoardingIcon
              width={30}
              src="/assets/icons/ic_onboading_map.png"
            />
            <TextGuide type="body" color="#121212" lineHeight="20px">
              {translate('onboarding.delivery')}
            </TextGuide>
            <ButtonOnBoardingNextStep
              size={12}
              height={60}
              color="#ffffff"
              hoverColor="#ffffff"
              textColor="#ec1d24"
              onClick={onClickBoardingNextStep}
            >
              {translate('onboarding.button.next')}
            </ButtonOnBoardingNextStep>
          </OnBoardingWrapper>
        }
      >
        {children}
      </Tooltip>
    </OnBoardingSection>
  );
}

export default withRouter(withLocales(OnBoardingDelivery));
