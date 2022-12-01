import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import pt from 'prop-types';
import styled from 'styled-components';
import { get, isEmpty } from 'lodash';
import withLocales from '../../../hoc/withLocales';
import { withRouter } from 'react-router-dom';
import { TextGuide } from '../../../components/Typography';
import { addressStringBuilder } from '../../../features/address/utils';
import { Icon, breakpoint } from '@central-tech/core-ui';
import {
  onBoardingCartClose,
  onBoardingDeliveryOpen,
  onBoardingNextStepCart,
} from '../../../reducers/layout';
import OnBoardingDelivery from '../../../features/onboarding/OnBoardingDelivery';

const DeliveryToolBarWrap = styled.div`
  display: flex;
  cursor: pointer;
  margin-right: 10px;
  @media only screen and (max-width: 991px) {
    background: #ffffff;
    height: 40px;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
`;
const TextSection = styled(TextGuide)`
  display: flex;
  align-items: center;
  ${breakpoint('md')`
    justify-content: flex-end;
  `}
`;
const TextAddress = styled(TextGuide)`
  font-size: 14px;
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${props => props.color || '#2a2a2a'};
  ${breakpoint('md')`
    max-width: 180px;
  `}
  ${breakpoint('lg')`
    max-width: 250px;
  `}
  ${breakpoint('xl')`
    max-width: 300px;
  `}
`;
const EditIcon = styled(Icon)`
  display: none;
  @media only screen and (max-width: 991px) {
    display: block;
  }
`;
const AddAddress = styled(TextGuide)`
  cursor: pointer;
  :hover {
    color: #b30208;
  }
`;

@withLocales
class DeliveryToolBar extends PureComponent {
  render() {
    const {
      currentShipping,
      onClick,
      translate,
      color,
      langCode,
      onBoardingDelivery,
      onBoardingNextStepCart,
    } = this.props;

    const shippingMethod = get(currentShipping, 'shipping_method', '');

    return (
      <OnBoardingDelivery
        showOnBoarding={onBoardingDelivery}
        onClickBoardingNextStep={() => onBoardingNextStepCart()}
      >
        <DeliveryToolBarWrap>
          <Icon
            width={12}
            src="/assets/icons/ic-location.svg"
            style={{ marginRight: 5 }}
          />
          <TextSection type="caption" size={14}>
            <TextGuide
              type="caption"
              className="default-font"
              size={14}
              style={{ whiteSpace: 'nowrap' }}
              bold
            >
              {shippingMethod === 'pickup'
                ? translate('delivery_tool_bar.pickup_at')
                : translate('delivery_tool_bar.delivery_to')}
            </TextGuide>
            {!isEmpty(currentShipping) ? (
              <React.Fragment>
                <TextAddress
                  type="caption"
                  size={14}
                  style={{ paddingLeft: 10, whiteSpace: 'nowrap' }}
                  onClick={onClick}
                  color={color}
                >
                  {shippingMethod === 'pickup'
                    ? get(currentShipping, 'name', '')
                    : addressStringBuilder(currentShipping, true, langCode)}
                </TextAddress>
                <EditIcon
                  width={10}
                  src="/assets/icons/ic-edit.svg"
                  style={{ marginLeft: 5 }}
                />
              </React.Fragment>
            ) : (
              <AddAddress
                type="caption"
                color="danger"
                size={14}
                style={{ paddingLeft: 10, whiteSpace: 'nowrap' }}
                onClick={onClick}
              >
                {translate('delivery_tool_bar.add_select_address')}
              </AddAddress>
            )}
          </TextSection>
        </DeliveryToolBarWrap>
      </OnBoardingDelivery>
    );
  }
}

DeliveryToolBar.propTypes = {
  currentShipping: pt.object.isRequired,
  onClick: pt.func.isRequired,
  color: pt.string,
};

DeliveryToolBar.defaultProps = {
  color: '#2a2a2a',
};

const mapStateToProps = state => ({
  onBoardingDelivery: state.layout.onBoardingDelivery,
});

const mapDispatchToProps = dispatch => ({
  onBoardingDeliveryOpen: () => dispatch(onBoardingDeliveryOpen()),
  onBoardingNextStepCart: () => dispatch(onBoardingNextStepCart()),
  onBoardingCartClose: () => dispatch(onBoardingCartClose()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeliveryToolBar),
);
