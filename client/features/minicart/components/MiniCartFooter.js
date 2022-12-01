import React from 'react';
import { Text, Padding, Row, Button } from '@central-tech/core-ui';
import { formatPrice } from '../../../utils/price';

const MiniCartFooter = ({ isCartEmpty, dateLimit, totals, translate, toCheckout }) => (
  <Padding style={{ borderTop: '1px solid #dddddd', marginTop: -1 }}>
    {!isCartEmpty > 0 && (
      <Row
        justify="flex-end"
        align="center"
        style={{ height: '50px', backgroundColor: '#fbfbfb' }}
      >
        <Text id="txt-summaryPriceItemTitle" size={15} bold lineHeight="28px">
          {translate('mini_cart.total_price')}
        </Text>
        <Text
          id="txt-summaryPriceItemCart"
          size={15}
          bold
          lineHeight="28px"
          color="#ec1d24"
          margin="0 21px 0 59px"
        >
          {`${
            totals.base_grand_total
              ? formatPrice(totals.base_grand_total - totals.shipping_incl_tax)
              : 0
          }฿`}
        </Text>
      </Row>
    )}
    {dateLimit && (
      <Row
        justify="center"
        align="center"
        style={{ height: '25px', backgroundColor: '#fff3e4' }}
      >
        <Text id="txt-summaryPriceItemCart" size={11} lineHeight="18px" color="#ff8e00">
          {`${translate('mini_cart.deliver_during')} ${dateLimit} ${translate(
            'mini_cart.date_only',
          )}`}
        </Text>
      </Row>
    )}
    <Button
      id={`lnk-viewCart`}
      size={14}
      block
      bold
      color={!isCartEmpty > 0 ? '#ec1d24' : '#ebebeb'}
      hoverColor={!isCartEmpty > 0 ? '#db2828' : '#ebebeb'}
      textColor={!isCartEmpty > 0 ? '#ffffff' : '#666666'}
      onClick={toCheckout}
      disabled={isCartEmpty}
      style={{ borderRadius: '0 0 4px 4px', height: '38px', lineHeight: 0 }}
    >
      {translate('mini_cart.view_cart')}
    </Button>
  </Padding>
);

export default MiniCartFooter;
