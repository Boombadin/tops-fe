import React from 'react';
import PropTypes from 'prop-types'
import { Dimmer, Loader } from '../../magenta-ui'
import './FullPageLoader.scss'

const FullPageLoader = ({ show, message }) => {
  
  if (!show) {
    return null
  }
  
  return (
    <div className="full-page-loader">
      <Dimmer active inverted>
        <Loader size="large">{message}</Loader>
      </Dimmer>
    </div>
  )
}

FullPageLoader.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string,
};

FullPageLoader.defaultProps = {
  show: false,
  message: ''
};

export default FullPageLoader;