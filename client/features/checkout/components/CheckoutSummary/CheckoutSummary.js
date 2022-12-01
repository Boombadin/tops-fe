import React, { Fragment } from 'react';
import pt from 'prop-types';
import styled from 'styled-components';
import { get, isEmpty } from 'lodash';
import withLocales from '../../../../hoc/withLocales';
import { formatPriceWithLocale as formatPrice } from '../../../../utils/price';
import { format } from '../../../../utils/time';
import {
  Padding,
  Text,
  HideMobile,
  Margin,
  breakpoint,
} from '@central-tech/core-ui';
import { addressStringBuilder } from '../../../address/utils';
import { value } from '../../utils';
import { TextGuide } from '../../../../components/Typography';

const CheckoutSummaryBlock = styled.div`
  background: #ffffff;
  border-bottom: dashed 1px #f8f8f8;
  border-radius: 5px 5px 0 0;
  ${breakpoint('xs', 'md')`
    background: #f7f7f7;
  `}
  ${props =>
    props.shipping &&
    `
    background: #f8f8f8;
    color: #666666;
    border-radius: 0 0 5px 5px;
    border-top: 1px dashed #f8f8f8;
  `}
`;
const TextTitle = styled(Text)`
  color: #ec1d24;
  font-size: 15px;
  line-height: 28px;
  letter-spacing: -0.6px;
`;
const Price = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Label = styled(Text)`
  font-size: 13px;
  color: #2a2a2a;
  line-height: 22px;
  letter-spacing: -0.4px;
  width: ${props => props.width || 'auto'};
  ${props =>
    props.small &&
    `
    font-size: 11px;
    line-height: 18px;
  `}
  ${props =>
    props.OneLine &&
    `
    white-space: nowrap;
  `}
`;
const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: dashed 1px #e8e8e8;
  margin-top: 10px;
  padding-top: 5px;
`;
const Shipping = styled.div`
  display: flex;
  word-break: break-word;
  ${props => props.NewLine && `display: block`}
`;
const Line = styled.div`
  border: dashed 1px #e8e8e8;
`;
const CheckoutSummary = ({
  translate,
  summary,
  shipAddress,
  lang,
  countRowItems,
  isShowSummary,
}) => {
  const itemsCart = countRowItems;
  const isT1C = summary.t1c_card !== '' && summary.t1c_phone !== '';
  const isMember = summary.t1c_card !== '' || summary.t1c_phone !== '';
  const storeAttr = get(shipAddress, 'custom_attributes', []);
  const shippingMethod = get(shipAddress, 'shipping_method');
  const activeLang = get(lang, 'code', '');
  const showAddr =
    shippingMethod === 'delivery' ? (
      <TextGuide type="caption-2" color="#666666">
        {addressStringBuilder(shipAddress, false, activeLang)}
      </TextGuide>
    ) : (
      <TextGuide type="caption-2" color="#666666">
        {value(storeAttr, 'description')}
        {value(storeAttr, 'contact_phone') && (
          <React.Fragment>
            <br />
            {`${translate('multi_checkout.summary.contact_number')} ${value(
              storeAttr,
              'contact_phone',
            )}`}
          </React.Fragment>
        )}
      </TextGuide>
    );
  return (
    <Fragment>
      <CheckoutSummaryBlock>
        <Padding sm="20px 20px 13px 20px" xs="10px 20px">
          <TextTitle bold>
            {translate('multi_checkout.summary.title')}
          </TextTitle>
          <Price>
            <Label bold>{translate('multi_checkout.summary.total')}</Label>
            <Label>{`${formatPrice(summary.total)} ฿`}</Label>
          </Price>
          <Price>
            <Label bold>{translate('multi_checkout.summary.discount')}</Label>
            <Label>{`${formatPrice(summary.coupon)} ฿`}</Label>
          </Price>
          <Price>
            <Label bold>
              {translate('multi_checkout.summary.shipping_fee')}
            </Label>
            <Label>{`${formatPrice(summary.shipping_fee)} ฿`}</Label>
          </Price>
          <GrandTotal>
            <TextTitle bold>
              {translate('multi_checkout.summary.order_total')}
            </TextTitle>
            <TextTitle bold>{`${formatPrice(
              summary.order_total,
            )} ฿`}</TextTitle>
          </GrandTotal>
        </Padding>
      </CheckoutSummaryBlock>
      <HideMobile>
        {itemsCart > 0 || isShowSummary ? (
          <CheckoutSummaryBlock shipping>
            <Padding xs="20px 20px 14px 20px">
              <Shipping NewLine={shippingMethod === 'pickup'}>
                <Label bold OneLine>
                  {shippingMethod === 'delivery'
                    ? translate('multi_checkout.summary.delivery_to')
                    : translate('multi_checkout.summary.pickup_at')}
                </Label>
                <Padding
                  xs={shippingMethod === 'delivery' ? '0 0 0 17px' : '0'}
                >
                  <Label bold>
                    {shippingMethod === 'delivery'
                      ? get(shipAddress, 'address_name', '')
                      : get(shipAddress, 'name', '')}
                  </Label>
                </Padding>
              </Shipping>
              <Shipping>
                <Label small>{showAddr}</Label>
              </Shipping>
              <Margin xs="22px 0 0 0 " />
              <Shipping>
                <Label ap="p" width="80px" bold>
                  {translate('multi_checkout.summary.receiver_order')}
                </Label>

                {!isEmpty(get(summary, 'shipping_date')) && (
                  <Label>
                    {`${get(summary, 'delivery_method')}` &&
                      `${translate(
                        `multi_checkout.method.${get(
                          summary,
                          'delivery_method',
                        )}`,
                      )}`}
                  </Label>
                )}
              </Shipping>
              <Shipping>
                <Label width="80px" bold>
                  {`${translate('multi_checkout.summary.date_time')} `}‌
                </Label>
                {!isEmpty(get(summary, 'shipping_date')) && (
                  <Label>
                    {`${format(
                      get(summary, 'shipping_date'),
                      'DD MMM',
                      get(lang, 'code'),
                    )} ${get(summary, 'shipping_slot_time', '')}`}
                  </Label>
                )}
              </Shipping>
              <Shipping>
                <Label width="80px" bold>
                  {shippingMethod === 'delivery'
                    ? translate('multi_checkout.summary.receiver')
                    : translate('multi_checkout.summary.collector')}
                </Label>
                {!isEmpty(get(summary, 'shipping_date')) && (
                  <Label>
                    {shippingMethod === 'delivery'
                      ? get(shipAddress, 'firstname', '')
                      : get(summary, 'receiver_name', '')}
                    {shippingMethod === 'delivery'
                      ? get(shipAddress, 'telephone') &&
                        `(${get(shipAddress, 'telephone')})`
                      : get(summary, 'receiver_phone') &&
                        `(${get(summary, 'receiver_phone')})`}
                  </Label>
                )}
              </Shipping>
            </Padding>
            {isMember && (
              <Fragment>
                <Line />
                <Padding xs="15px 20px 24px 20px;">
                  <Shipping>
                    <Label bold>
                      {/* {isT1C || summary.t1c_card !== ''
                        ? translate('multi_checkout.summary.the1')
                        : translate('multi_checkout.summary.the1')} */}
                      {translate('multi_checkout.summary.the1')}
                    </Label>
                    <Padding xs="0 0 0 17px;">
                      <Label>
                        {isT1C || summary.t1c_card !== ''
                          ? summary.t1c_card
                          : summary.t1c_phone}
                      </Label>
                    </Padding>
                  </Shipping>
                  <Shipping>
                    <Label bold>
                      {translate('multi_checkout.summary.estimated_point')}
                    </Label>
                    <Padding xs="0 0 0 17px;">
                      <Label>
                        {translate('multi_checkout.summary.t1c_point', {
                          point: get(summary, 't1c_earn', 0),
                        })}
                      </Label>
                    </Padding>
                  </Shipping>
                </Padding>
              </Fragment>
            )}
          </CheckoutSummaryBlock>
        ) : (
          ''
        )}
      </HideMobile>
    </Fragment>
  );
};

CheckoutSummary.propTypes = {
  summary: pt.object.isRequired,
  shipAddress: pt.object,
  lang: pt.string,
  countRowItems: pt.number,
  isShowSummary: pt.bool,
};

CheckoutSummary.defaultProps = {
  lang: 'en_US',
  shipAddress: {},
  countRowItems: 0,
  isShowSummary: false,
};

export default withLocales(CheckoutSummary);
