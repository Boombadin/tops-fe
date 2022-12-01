import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Icon, Tooltip, Button, breakpoint } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';
import { TextGuide } from '../../components/Typography';

const BackgroundOnBoarding = styled.div`
  display: none;

  ${breakpoint('xs', 'md')`
    display: block;
    background-color: #000000;
    position: fixed;
    width: 100%;
    z-index: 1000;
    opacity: 0.9;
    top: 0;
    left: 0;
    bottom: 0;
  `}
`;

const OnBoardingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OnBoardingSection = styled.div`
  > .onboarding-wrapper {
    ${props => props.showOnBoarding && 'z-index: 1000;'}
  }

  > .onboarding-wrapper ${Tooltip.Section} {
    width: 330px;
    height: 60px;
    margin: ${props => props.contentMargin || '0'};

    ${breakpoint('xs', 'md')`
      width: 280px;
      padding: 1px 0 0;
    `}
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

function OnBoardingContainer({
  align,
  isBackground = false,
  iconOnBoarding,
  showOnBoarding,
  onClickBoardingNextStep,
  textButton,
  detail,
  contentWidth,
  contentHeight,
  contentMargin,
  children,
}) {
  useEffect(() => {
    const screenMobile = window.matchMedia('(max-width: 769px)');
    if (showOnBoarding && isBackground && screenMobile.matches) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, [showOnBoarding, isBackground]);

  return (
    <React.Fragment>
      {isBackground && <BackgroundOnBoarding />}
      <OnBoardingSection
        contentWidth={contentWidth}
        contentHeight={contentHeight}
        contentMargin={contentMargin}
        showOnBoarding={showOnBoarding}
      >
        <Tooltip
          className="onboarding-wrapper"
          align={align}
          show={showOnBoarding}
          disabled={!showOnBoarding}
          radius={5}
          border="1px solid #e8e8e8"
          renderTooltip={
            <OnBoardingWrapper>
              <OnBoardingIcon width={30} src={iconOnBoarding} />
              <TextGuide as="caption" color="#121212">
                {detail}
              </TextGuide>
              <ButtonOnBoardingNextStep
                size={12}
                height={60}
                color="#ffffff"
                hoverColor="#ffffff"
                textColor="#ec1d24"
                onClick={onClickBoardingNextStep}
              >
                {textButton}
              </ButtonOnBoardingNextStep>
            </OnBoardingWrapper>
          }
        >
          {children}
        </Tooltip>
      </OnBoardingSection>
    </React.Fragment>
  );
}

export default withRouter(withLocales(OnBoardingContainer));
