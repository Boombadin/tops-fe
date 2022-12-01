import React from 'react'
import pt from 'prop-types'
import './ModalContent.scss'

export const ModalContent = ({ children, className, ...rest }) => (
  <div {...rest} className={`modal-content ${className}`}>
    {children}
  </div>
)

ModalContent.propTypes = {
  className: pt.string,
  children: pt.oneOfType([
    pt.node,
    pt.arrayOf(pt.node),
    pt.string,
    pt.number
  ])
}

ModalContent.defaultProps = {
  className: '',
  children: null
}
