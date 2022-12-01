import React from "react"
import PropTypes from "prop-types"
import './FacebookLikeWidget.scss' 
import ReactFBLike from 'react-fb-like'

const FacebookLikeWidget = ({
  className,
  width,
  href,
  appId
}) => {
  const markupClassName = `facebook-like-widget ${className}`;
  return (
    <div className={markupClassName}>
      <ReactFBLike
        version="v2.12"
        showFaces
        href={href}
        appId={appId}
        layout='standard'
        width={width}
      />
    </div>
  );
}

FacebookLikeWidget.propTypes = {
  className: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}

FacebookLikeWidget.defaultProps = {
  className: '',
  width: 450,
}

export default FacebookLikeWidget
