import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb } from '../../magenta-ui'
import { Link } from 'react-router-dom'
import './Breadcrumbs.scss'

const Breadcrumbs = ({ label, url, isStatic, hasNext, hasUrl, onClick, seo }) => {
  return (
    <span onClick={onClick}>
      {isStatic ? (
        <Breadcrumb.Section active>
          { seo ? <h1>{label}</h1> : label }
        </Breadcrumb.Section>
      ) : (
        <Breadcrumb.Section>
          <Link to={hasUrl ? url : '#'}>{label}</Link>
        </Breadcrumb.Section>
      )}
      {hasNext && <Breadcrumb.Divider icon="right angle" />}
    </span>
)}

Breadcrumbs.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isStatic: PropTypes.bool,
  hasNext: PropTypes.bool,
  hasUrl: PropTypes.bool,
  seo: PropTypes.bool
}

Breadcrumbs.defaultProps = {
  label: '',
  url: '',
  isStatic: false,
  hasNext: false,
  hasUrl: true,
  seo: false
}

export default Breadcrumbs
