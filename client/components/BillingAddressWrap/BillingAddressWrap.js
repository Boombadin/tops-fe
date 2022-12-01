import React from 'react'
import PropTypes from 'prop-types'
import { List, Image, Divider } from '../../magenta-ui'
import './BillingAddressWrap.scss'
import BillingAddress from '../BillingAddress'
import ProductReplacement from '../ProductReplacement'
import OrderRemarkForm from '../OrderRemarkForm'

const BillingAddressWrap = ({
  className,
 }) => {
  const markupClassName = `billing-address-wrap ${className}`;
  return (
    <div className={markupClassName}>
      <BillingAddress />
      <Divider section />
      <div className="order-remark-desktop">
        <ProductReplacement/> 
      </div>
      <Divider section />
      <div className="order-remark-desktop">
        <OrderRemarkForm /> 
      </div>
    </div>
  );
}

BillingAddressWrap.propTypes = {
  className: PropTypes.string.isRequired,
}

BillingAddressWrap.defaultProps = {
  className: '',
}

export default BillingAddressWrap
