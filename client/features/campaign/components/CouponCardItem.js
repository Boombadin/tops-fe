import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { map } from 'lodash';
import withLocales from '../../../hoc/withLocales';
import { TextGuide } from '../../../components/Typography';
import { Icon, breakpoint, FullScreenLoading } from '@central-tech/core-ui';
import { deleteCoupon, fetchShippingMethods } from '../../../reducers/cart';

const CouponItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const CouponCard = styled.div`
  border: 1px solid #ededed;
  background: #f5f5f5;
  height: 90px;
  position: relative;
  padding: 5px 20px;

  ${props =>
    props.cardLeft &&
    css`
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      width: calc(100% - 75px);
    `}
  ${props =>
    props.cardRight &&
    css`
      width: 75px;
      border-left: 1px dashed #fff;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      display: flex;
      justify-content: center;
      &:before,
      &:after {
        content: '';
        position: absolute;
        display: block;
        width: 0.9em;
        height: 0.9em;
        background: #fff;
        border-radius: 50%;
        left: -0.5em;
      }
      &:before {
        top: -0.4em;
      }
      &:after {
        bottom: -0.4em;
      }
    `}
`;

const DelIcon = styled(Icon)`
  cursor: pointer;
`;
class CouponCardItem extends React.PureComponent {
  handleDeleteCoupon = couponCode => {
    const { cartId } = this.props;
    if (couponCode) {
      const msg = `${this.props.translate(
        'summary.confirm_coupon_deletion',
      )}  ${couponCode}`;
      if (confirm(msg)) {
        this.props.deleteCoupon(couponCode);
        this.props.fetchShippingMethods(cartId);
      }
    }
  };
  render() {
    const { coupons, translate, cartId } = this.props;
    return map(coupons, coupon => {
      return (
        <React.Fragment>
          <CouponItem>
            <CouponCard cardLeft>
              <TextGuide type="topic" bold size={14}>
                {translate('coupon_popup.coupon_item.title')}
              </TextGuide>
              <TextGuide type="section" bold color="danger">
                {coupon.coupon_amount.replace(/-฿|-\u0e3f|,/g, '')}{' '}
                {translate('coupon_popup.coupon_item.baht')}
              </TextGuide>
              <TextGuide type="caption-2">
                {' '}
                {translate('coupon_popup.coupon_item.coupon_code')}
                {coupon.coupon_code}
              </TextGuide>
            </CouponCard>
            <CouponCard
              cardRight
              onClick={() => this.handleDeleteCoupon(coupon.coupon_code)}
            >
              <DelIcon src="/assets/icons/trash.svg" width={12} />
            </CouponCard>
          </CouponItem>
          {this.props.deleteCouponLoading && (
            <FullScreenLoading
              icon="/assets/icons/loader-2.gif"
              width="100px"
              height="auto"
            />
          )}
        </React.Fragment>
      );
    });
  }
}

const mapStateToProps = (state, ownProps) => ({
  deleteCouponLoading: state.cart.deleteCouponLoading,
});
const mapDispatchToProps = dispatch => ({
  deleteCoupon: coupon => dispatch(deleteCoupon(coupon)),
  fetchShippingMethods: cartId => dispatch(fetchShippingMethods(cartId)),
});
export default withLocales(
  connect(mapStateToProps, mapDispatchToProps)(CouponCardItem),
);
