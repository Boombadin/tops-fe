import React from 'react';
import styled from 'styled-components';
import { Icon, Space } from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';
import withLocales from '../../../hoc/withLocales';

const CouponEmptyWarp = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  left: 0;
  top: 45%;
`;
const CouponEmpty = ({ translate }) => {
  return (
    <CouponEmptyWarp>
      <Icon
        src="/assets/icons/my-coupons.svg"
        width={48}
        style={{ marginBottom: 10 }}
      />
      <TextGuide type="body" color="#cccccc" style={{ textAlign: 'center' }}>
        {translate('coupon_popup.empty_coupon')}
      </TextGuide>
      <Space />
    </CouponEmptyWarp>
  );
};

export default withLocales(CouponEmpty);
