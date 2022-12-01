import React from 'react'
import PropTypes from 'prop-types'

const MediaIcon = ({
  className, position, mediaLink, mediaIcon, mediaTitle
}) => {
  if (position === 'left') {
    className = 'left'
  }
  return (
    <p className="media-link">
      <a href={mediaLink}>
        <img className={`media-icon ${className}`} src={mediaIcon} alt="" />
        {mediaTitle}
      </a>
    </p>
  )
}
MediaIcon.propTypes = {
  className: PropTypes.string.isRequired,
  mediaIcon: PropTypes.string.isRequired,
  mediaLink: PropTypes.string.isRequired,
  mediaTitle: PropTypes.string.isRequired,
}
MediaIcon.defaultProps = {
  className: '',
  mediaIcon: '',
  mediaLink: '',
  mediaTitle: '',
}
export default MediaIcon
