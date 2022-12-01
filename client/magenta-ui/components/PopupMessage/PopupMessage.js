import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { isUndefined } from 'lodash';
import { Button } from '../..';
import './PopupMessage.scss';

const translation = {
  th_TH: {
    cancel: 'ยกเลิก',
    ok: 'ตกลง'
  },
  en_US: {
    cancel: 'Cancel',
    ok: 'OK'
  }
};

class PopupMessage extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    lang: PropTypes.oneOf([
      'th_TH',
      'en_US'
    ])
  };

  static defaultProps = {
    lang: 'th_TH',
    className: ''
  };

  translate = field => translation[this.props.lang][field];

  render() {
    const { className, open, children, onCancel, onConfirm } = this.props;
    const { translate } = this;

    return (
      <div className={`mt-popup-message ${className} ${open ? '' : 'mt-popup-message-hide'}`}>
        <div className="mt-popup-message-input" />
        <div className="mt-popup-message-text">
          {children}
        </div>
        <div className="mt-popup-message-controls">
          <Button className="button" onClick={onCancel}>
            {translate('cancel')}
          </Button>
          <Button className="button ok" onClick={onConfirm}>
            {translate('ok')}
          </Button>
        </div>
      </div>
    );
  }
}

export default PopupMessage;
