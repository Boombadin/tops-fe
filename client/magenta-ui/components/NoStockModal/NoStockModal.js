import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Modal } from '../..';
import Button from '../CustomButton';
import CloseIcon from '../Icons/Close';
import { ModalActions } from '../ModalActions';
import { ModalContent } from '../ModalContent';
import { formatPrice } from '../../utils/price';
import { NoStockModalItem } from './NoStockModalItem';
import './NoStockModal.scss';

const translation = {
  th_TH: {
    sorry: 'ขออภัยค่ะ',
    ok: 'ตกลง',
  },
  en_US: {
    sorry: 'Sorry',
    ok: 'OK',
  },
};

class NoStockModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    lang: PropTypes.oneOf(['th_TH', 'en_US']),
    items: PropTypes.array.isRequired,
    onCloseButton: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    open: false,
    lang: 'th_TH',
    items: [],
    itemErrors: {},
    onCloseButton: () => {},
  };

  translate = field => translation[this.props.lang][field];

  renderMessage() {
    const { items, lang } = this.props;

    switch (lang) {
      case 'th_TH':
        return (
          <span>
            สินค้า <span className="count">{items.length}</span> รายการมีการเปลี่ยนแปลง
          </span>
        );
      default:
        return (
          <span>
            Changes with
            <span className="count">{items.length}</span> items
          </span>
        );
    }
  }

  render() {
    const { open, lang, items, onCloseButton, onConfirm } = this.props;

    const { translate } = this;

    return (
      <Modal className="mt-no-stock-modal" open={open}>
        <div className="mt-no-stock-modal__container">
          <Modal.Header className="mt-no-stock-modal-header">
            <span className="icon" onClick={onCloseButton}>
              <CloseIcon />
            </span>
            <div className="sorry">{translate('sorry')}</div>
            <div className="message">{this.renderMessage()}</div>
          </Modal.Header>
          <ModalContent className="mt-no-stock-modal-content">
            {map(items, item => {
              return (
                <NoStockModalItem
                  // disabled
                  key={item.item_id}
                  image={item.image}
                  name={item.name}
                  price={
                    item.price_incl_tax
                      ? formatPrice(item.price_incl_tax)
                      : formatPrice(item.price)
                  }
                  reason={item.error.text}
                  lang={lang}
                  missingQuant={item.error.missingQuantity}
                />
              );
            })}
          </ModalContent>
          <ModalActions className="mt-no-stock-modal-actions">
            <Button primary size="large" className="button" onClick={onConfirm}>
              {translate('ok')}
            </Button>
          </ModalActions>
        </div>
      </Modal>
    );
  }
}

export default NoStockModal;
