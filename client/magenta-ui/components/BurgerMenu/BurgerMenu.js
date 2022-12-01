import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import './BurgerMenu.scss'
import { Responsive, Sidebar, Segment, Button, Menu, Image } from '../..'

const BurgerMenu = ({ className, onClick }) => {
  return (
    <button onClick={onClick} className={`mt-bm-icon ${className}`}>
      <span />
      <span />
      <span />
    </button>
  )
}

BurgerMenu.propTypes = {
  className: PropTypes.string.isRequired
}

BurgerMenu.defaultProps = {
  className: ''
}
export default BurgerMenu
