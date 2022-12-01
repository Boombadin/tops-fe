import React from "react"
import PropTypes from "prop-types"
import { NavLink } from 'react-router-dom'
import { noop } from 'lodash'
import "./HeadTitle.scss"
import { Divider, Grid, Link, Icon } from "../.."

const HeadTitle = ({ className, topic, position, button, url, btnName, onNavClick, native, line }) => {
  if (position === "left") {
    className = "mt-title-left"
  }

  return (
    <div className={`mt-title-section ${className}`}>
      <div className={`mt-title-wrap ${line ? 'line' : ''}`}>
        <h2 className="mt-title">{topic}</h2>
      </div>
      {button && (
        url ? (
          native ? (
            <a href={url} className="mt-head-title-link">
              {btnName}
              <Icon name="chevron right" />
            </a>
          ) : (
            <NavLink to={url} className="mt-head-title-link" onClick={onNavClick}>
              {btnName}
              <Icon name="chevron right" />
            </NavLink>
          )
        ) : (
          <div className="mt-head-title-link" onClick={onNavClick}>
            {btnName}
            <Icon name="chevron right" />
          </div>
        )
      )}
    </div>
  )
}
HeadTitle.propTypes = {
  className: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  btnName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  button: PropTypes.bool,
  onNavClick: PropTypes.func
}
HeadTitle.defaultProps = {
  className: "",
  topic: "",
  btnName: "",
  url: "",
  button: true,
  onNavClick: noop,
  line: true
}
export default HeadTitle
