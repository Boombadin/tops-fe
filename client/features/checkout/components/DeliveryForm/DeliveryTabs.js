import React, { PureComponent } from 'react';
import { string, func } from 'prop-types';
import styled from 'styled-components';
import { breakpoint, HideDesktop, HideMobile } from '@central-tech/core-ui';
import withLocales from '../../../../hoc/withLocales';
import { TextGuide } from '../../../../components/Typography';

const DELIVERY_HOME_ICON = '/assets/icons/delivery-home-icon.svg';
const CLICK_AND_COLLECT_ICON = '/assets/icons/click-and-collect-icon.svg';

const DeliveryContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const DeliveryOptionContainer = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 20px 0 20px;
    cursor: pointer;
    border-bottom: solid 1px #f3f3f3;
    width: calc(100% - 1px);

    @media screen and (max-width: 360px) {
      padding: 0 0 0 20px;
    }

    ${props =>
      props.borderRight &&
      `
        border-right: solid 1px #f3f3f3;
    `}

    ${props =>
      props.active &&
      props.left &&
      `
        background-color: #f5ffe1;
        color: #199000;
        border-radius: 4px 0 0;
    `}

    ${props =>
      props.active &&
      props.right &&
      `
        background-color: #f5ffe1;
        color: #199000;
        border-radius: 0 4px 0 0;
    `}

    ${breakpoint('xs', 'md')`
      height: 40px
    `}
`;

const DeliveryOptionIcon = styled.img`
  width: 25px;
  ${breakpoint('md')`
    width: 40px;
  `}
`;
const DeliveryOptionDescription = styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 20px;

  @media screen and (max-width: 360px) {
    padding-left: 10px;
  }

  ${breakpoint('xs', 'md')`
    width: auto;
  `}
`;

const DeliveryOptionDescriptionTitle = styled.span`
  color: #2a2a2a;
  font-size: 15px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.6px;
  ${breakpoint('xs', 'md')`
    font-size: 13px;
    letter-spacing: -0.4px;
    line-height: 17px;
  `}
  ${props =>
    props.active &&
    `
      color: #199000;
    `}
`;

const DeliveryOptionDescriptionText = styled.span`
  color: #666666;
  font-size: 11px;
  line-height: 18px;

  ${props =>
    props.active &&
    `
        color: #199000;
    `}
  ${breakpoint('xs', 'md')`
    display: none;
  `}
`;

class DeliveryTabs extends PureComponent {
  render() {
    const {
      deliveryMethod,
      onClick,
      translate,
      handleDeliveryClick,
    } = this.props;
    return (
      <DeliveryContainer>
        <DeliveryOptionContainer
          left
          borderRight
          active={deliveryMethod === 'home_delivery' ? 'active' : ''}
          onClick={() => onClick('home_delivery')}
        >
          <DeliveryOptionIcon src={DELIVERY_HOME_ICON} />
          <DeliveryOptionDescription>
            <DeliveryOptionDescriptionTitle
              active={deliveryMethod === 'home_delivery' ? 'active' : ''}
            >
              {translate('checkout_delivery.delivery_home')}
            </DeliveryOptionDescriptionTitle>
            <DeliveryOptionDescriptionText
              active={deliveryMethod === 'home_delivery' ? 'active' : ''}
            >
              <TextGuide
                type="caption-2"
                color={
                  deliveryMethod === 'home_delivery' ? '#199000' : '#666666'
                }
              >
                {translate('checkout_delivery.delivery_home_sub')}
              </TextGuide>
            </DeliveryOptionDescriptionText>
          </DeliveryOptionDescription>
        </DeliveryOptionContainer>

        <DeliveryOptionContainer
          right
          active={deliveryMethod === 'click_and_collect' ? 'active' : ''}
          onClick={() => onClick('click_and_collect')}
        >
          <DeliveryOptionIcon src={CLICK_AND_COLLECT_ICON} />
          <DeliveryOptionDescription>
            <HideMobile>
              <DeliveryOptionDescriptionTitle
                active={deliveryMethod === 'click_and_collect' ? 'active' : ''}
              >
                {translate('checkout_delivery.click_and_collect')}
              </DeliveryOptionDescriptionTitle>
            </HideMobile>
            <HideDesktop>
              <DeliveryOptionDescriptionTitle
                active={deliveryMethod === 'click_and_collect' ? 'active' : ''}
              >
                {translate('checkout_delivery.click_and_collect_mobile1')}
                <br />
                {translate('checkout_delivery.click_and_collect_mobile2')}
              </DeliveryOptionDescriptionTitle>
            </HideDesktop>
            <DeliveryOptionDescriptionText
              active={deliveryMethod === 'click_and_collect' ? 'active' : ''}
            >
              <TextGuide
                type="caption-2"
                color={
                  deliveryMethod === 'click_and_collect' ? '#199000' : '#666666'
                }
              >
                {translate('checkout_delivery.click_and_collect_sub')}
              </TextGuide>
            </DeliveryOptionDescriptionText>
          </DeliveryOptionDescription>
        </DeliveryOptionContainer>
      </DeliveryContainer>
    );
  }
}

DeliveryTabs.propTypes = {
  deliveryMethod: string.isRequired,
  onClick: func,
  translate: func,
};

DeliveryTabs.defaultProps = {
  deliveryMethod: '',
  onClick: () => {},
  translate: () => {},
};

export default withLocales(DeliveryTabs);
