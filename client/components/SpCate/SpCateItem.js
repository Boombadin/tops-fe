import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Image, Label } from '../../magenta-ui'

const SpCateItem = ({ title, img, link }) => {
  return (
    <Label className="sp-cate-link" textalign="center">
      <NavLink to={link}>
        <span className="img">{img ? <Image className="sp-cate-img" src={img} /> : ''}</span>
        <span className="text">{title}</span>
      </NavLink>
    </Label>
  )
}
SpCateItem.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

SpCateItem.defaultProps = {
  title: '',
  img: '',
  url: ''
}
export default SpCateItem
