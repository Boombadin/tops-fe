import React from 'react';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import { Text, breakpoint, Col, Row, Button, HideDesktop } from '@central-tech/core-ui';
import { getCouponCode } from '../campaign/utils';
import withLocales from '../../hoc/withLocales';
import ModalTemplate from './components/ModalTemplate';
import CouponCardItem from '../campaign/components/CouponCardItem';
import CouponEmpty from '../campaign/components/CouponEmpty';
import AddCoupon from '../campaign/components/AddCoupon';
import { get } from 'lodash';
const OverflowSection = styled.div`
  overflow: auto;
  overflow-x: hidden;
  max-height: 50vh;
  min-height: 40vh;
  ${breakpoint('xs', 'md')`
    max-height: none;
    height: 100%;
    min-height: 0px;
  `}
`;

const ContentWrap = styled.div`
  background: #fff;
  ${breakpoint('xs', 'md')`
    padding: 20px;
  `}
`;
const LineSpace = styled.div`
  margin: 0 -30px 28px;
  border-bottom: 1px dashed #e8e8e8;
  padding: 0 0 20px 0;
  ${breakpoint('xs', 'md')`
    margin: 0 -20px 18px;
  `}
`;
class CouponModal extends React.PureComponent {
  render() {
    const { openModalCoupon, onModalClose, cartTotals, translate } = this.props;
    const coupons = getCouponCode(cartTotals);
    return (
      <ModalTemplate
        open={openModalCoupon}
        onModalClose={onModalClose}
        close={onModalClose}
        maxWidth={'500px'}
        borderContent={'none'}
        backgroundContent={'#ffffff'}
        isLine={false}
        title={translate('coupon_popup.title')}
        description={translate('coupon_popup.sub_title')}
        topSpace
        backButtonIcon
      >
        <OverflowSection>
          <ContentWrap>
            <AddCoupon coupons={coupons} cartId={get(cartTotals, 'extension_attributes.cart_id')} />
            <LineSpace />
            {coupons.length > 0 ? <CouponCardItem coupons={coupons} cartId={get(cartTotals, 'extension_attributes.cart_id')} /> : <CouponEmpty />}
          </ContentWrap>
        </OverflowSection>
      </ModalTemplate>
    );
  }
}

export default withLocales(CouponModal);
