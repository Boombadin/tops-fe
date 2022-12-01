import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ClickAndCollectTab.scss';

const ClickAndCollectStore = ({ storeName }) =>  {
    return (
      <div className="click-collect-store-section">
        <div className="click-collect-store-body">
          <p>{storeName}</p>
        </div>
        <div className="click-collect-store-bottom">
          <span>Fastest Today, 20:00-22:00 hrs.</span>
          <span>Free delivery</span>
        </div>
      </div>
    )
  }

export default ClickAndCollectStore