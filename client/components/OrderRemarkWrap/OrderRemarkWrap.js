import React from 'react'
import PropTypes from 'prop-types'
import './OrderRemarkWrap.scss'
import OrderRemarkForm from '../OrderRemarkForm'

const OrderRemarkWrap = ({
  className
}) => {
  const markupClassName = `order-remark-wrap ${className}`;
  return (
    <div className={markupClassName}>
      <OrderRemarkForm /> 
    </div>
  );
}

OrderRemarkWrap.propTypes = {
  className: PropTypes.string.isRequired,
}

OrderRemarkWrap.defaultProps = {
  className: '',
}
export default OrderRemarkWrap