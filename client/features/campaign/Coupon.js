import React from 'react';
import styled from 'styled-components';
import withLocales from '../../hoc/withLocales';
import CouponItem from './components/CouponItem';
import { map } from 'lodash';
import { Icon, Button, Row, Col, Margin } from '@central-tech/core-ui';
import { TextGuide } from '../../components/Typography';
import CouponModal from '../modal/CouponModal';
import { getCouponCode } from './utils';

const CouponWrap = styled.div`
  padding: 26px 20px 30px;
`;
const CouponIcon = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5px;
  justify-content: ${props => props.justifyContent || 'flex-start'};
`;
const CouponListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const AddCoupon = styled(Button)`
  width: 150px;
  height: 40px;
  border-radius: 4px;
  border: solid 1px #808080;
  background-color: #ffffff;
  color: #2a2a2a;
  font-size: 13px;
  line-height: 40px;
`;
class Coupon extends React.PureComponent {
  state = {
    openModalCoupon: false,
  };

  handleClick = () => {
    this.setState({
      openModalCoupon: true,
    });
  };

  render() {
    const { cartTotals, translate } = this.props;
    const couponsCode = getCouponCode(cartTotals);
    return (
      <CouponWrap>
        <Row justify="space-between">
          <Col>
            <Margin xs="0 0 10px 0">
              <CouponIcon>
                <Icon
                  src="/assets/icons/icon-coupon.svg"
                  width={35}
                  style={{ marginRight: 10 }}
                />
                <TextGuide type="topic" bold>
                  {translate('coupon_popup.coupons')}
                </TextGuide>
              </CouponIcon>
            </Margin>
          </Col>
          <Col align="right">
            {couponsCode.length > 0 ? (
              <CouponIcon justifyContent="flex-end" onClick={this.handleClick}>
                <Icon
                  src="/assets/icons/ic-edit.svg"
                  width={12}
                  style={{ marginRight: 3, cursor: 'pointer' }}
                />
                <TextGuide
                  type="caption-2"
                  color="#666666"
                  style={{ cursor: 'pointer' }}
                >
                  {translate('coupon_popup.edit_coupons')}
                </TextGuide>
              </CouponIcon>
            ) : (
                <AddCoupon onClick={this.handleClick}>
                  {translate('coupon_popup.add_coupons')}
                </AddCoupon>
              )}
          </Col>
        </Row>
        <Row>
          <Col xs="auto">
            <CouponListWrap>
              {couponsCode.length > 0 &&
                map(couponsCode, coupon => {
                  return <CouponItem label={coupon.coupon_code} />;
                })}
            </CouponListWrap>
          </Col>
        </Row>
        {this.state.openModalCoupon && (
          <CouponModal
            openModalCoupon={this.state.openModalCoupon}
            onModalClose={() => this.setState({ openModalCoupon: false })}
            cartTotals={cartTotals}
          />
        )}

      </CouponWrap>
    );
  }
}

export default withLocales(Coupon);
