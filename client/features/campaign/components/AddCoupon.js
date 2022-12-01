import React from 'react';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import withLocales from '../../../hoc/withLocales';
import styled from 'styled-components';
import { Button, Icon, FullScreenLoading } from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';
import { putCoupon, fetchShippingMethods } from '../../../reducers/cart';

const FormAddCouponWrap = styled.div`
  /* margin-bottom: 28px;
  border-bottom: 1px dashed #e8e8e8;
  padding: 0 0 20px 0; */
`;
const FormAddCoupon = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FormInput = styled.input`
  width: calc(100% - 110px);
  height: 30px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  padding: 3px 10px;
  ::placeholder {
    font-family: Thonburi, sans-serif !important;
    line-height: 20px;
    font-size: 14px;
    color: #bfbfbf;
  }
`;
const ErrorMsg = styled.div`
  padding-top: 5px;
`;

const AddCouponButton = styled(Button)`
  opacity: 1;
`;
class AddCoupon extends React.PureComponent {
  state = {
    couponCode: '',
    couponErr: '',
    successMsg: '',
  };

  handleApplyCoupon = () => {
    const { translate, cartId } = this.props;
    if (this.state.couponCode) {
      const couponResp = this.props.putCoupon(this.state.couponCode);
      couponResp.then(resp => {
        if (get(resp.data, 'message')) {
          let errorMsg = resp.data.message;
          if (errorMsg === 'Coupon code is not valid') {
            errorMsg = translate('errors.coupons.is_valid');
          }
          if (errorMsg === 'This coupon is used.') {
            errorMsg = translate('errors.coupons.is_used');
          }
          if (errorMsg === 'can not apply it.') {
            errorMsg = translate('errors.coupons.not_apply');
          }
          this.setState({
            couponErr: errorMsg,
            successMsg: '',
          });
        } else {
          this.setState({
            couponErr: '',
            couponCode: '',
            successMsg: translate('coupon_popup.applied_coupon'),
          });
          this.clearInputCouponCode();
          this.props.fetchShippingMethods(cartId);
        }
      });
    }
  };

  handleRef = c => {
    this.inputRef = c;
  };

  clearInputCouponCode = () => {
    this.inputRef.value = '';
    this.inputRef.focus();
    this.setState({ couponCode: '' });
  };

  render() {
    const { translate, coupons } = this.props;
    const findCouponSpace =
      this.state.couponCode.replace(/\s/g, '') === '' ? true : false;

    const disableButton =
      this.props.applyCouponLoading ||
      isEmpty(this.state.couponCode) ||
      findCouponSpace === true;
    return (
      <FormAddCouponWrap>
        <FormAddCoupon>
          <FormInput
            ref={this.handleRef}
            type="text"
            name="coupon"
            label=""
            placeholder={translate('coupon_popup.placeholder')}
            required
            onChange={e =>
              this.setState({
                couponCode: e.target.value,
              })
            }
          />
          <AddCouponButton
            disabled={disableButton}
            color={disableButton ? '#bfbfbf' : 'danger'}
            height={30}
            width={100}
            radius="4px"
            onClick={() => this.handleApplyCoupon()}
          >
            <TextGuide
              type="body"
              align="center"
              color={disableButton ? '#808080' : '#ffffff'}
            >
              {translate('coupon_popup.btn_add_coupon')}
            </TextGuide>
          </AddCouponButton>
        </FormAddCoupon>
        {this.state.couponErr && (
          <TextGuide type="caption-2" color="#ec1d24">
            <ErrorMsg>{this.state.couponErr}</ErrorMsg>{' '}
          </TextGuide>
        )}
        {this.state.successMsg && coupons.length > 0 && (
          <TextGuide type="caption-2" color="#199000">
            <ErrorMsg>
              <Icon
                width={12}
                src="/assets/icons/checked-o.svg"
                style={{ marginRight: 5 }}
              />
              {this.state.successMsg}
            </ErrorMsg>
          </TextGuide>
        )}
        {this.props.applyCouponLoading && (
          <FullScreenLoading
            icon="/assets/icons/loader-2.gif"
            width="100px"
            height="auto"
          />
        )}
      </FormAddCouponWrap>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  applyCouponLoading: state.cart.applyCouponLoading,
});
const mapDispatchToProps = dispatch => ({
  putCoupon: coupon => dispatch(putCoupon(coupon)),
  fetchShippingMethods: cartId => dispatch(fetchShippingMethods(cartId)),
});
export default withLocales(
  connect(mapStateToProps, mapDispatchToProps)(AddCoupon),
);
