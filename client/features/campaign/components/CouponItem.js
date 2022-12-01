import React from 'react';
import styled from 'styled-components';
import { TextGuide } from '../../../components/Typography';

const CouponItemWrap = styled.div`
  border-radius: 3px;
  border: solid 1px #80bd00;
  background-color: rgba(128, 189, 0, 0.1);
  padding: 5px 10px;
  min-width: 98px;
  height: 30px;
  text-align: center;
  margin: 0 10px 10px 0;
`;
const CouponItem = ({ label }) => (
  <CouponItemWrap>
    <TextGuide color="#199000" type="body">
      {label}
    </TextGuide>
  </CouponItemWrap>
);

export default CouponItem;
