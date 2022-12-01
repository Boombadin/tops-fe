import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Modal } from '../..';
import Button from '../CustomButton';
import CloseIcon from '../Icons/Close';
import { ModalActions } from '../ModalActions';
import { ModalContent } from '../ModalContent';
import { formatPrice } from '../../utils/price';
import './ErrorNYBModal.scss';

const translation = {
  th_TH: {
    sorry: 'ขออภัยค่ะ',
    ok: 'ตกลง',
    add_normal_to_nyb_header: '',
    add_nyb_to_normal_header: '',
    add_normal_to_nyb_title: 'กรุณาชำระเงินก่อนเลือกซื้อสินค้านี้',
    add_normal_to_nyb_detail:
      'สินค้านี้ไม่สามารถจัดส่งพร้อมกระเช้าปีใหม่ที่คุณเลือกไว้ก่อนหน้านี้ได้ เนื่องจากกระเช้าปีใหม่นั้นต้องใช้เวลาอย่างน้อย 4 วันในการดำเนินการจัดส่ง',
    add_nyb_to_normal_title: 'กรุณาชำระเงินก่อนเลือกซื้อกระเช้าปีใหม่',
    add_nyb_to_normal_detail:
      'สินค้ากระเช้าปีใหม่ไม่สามารถจัดส่งพร้อมสินค้าที่คุณเลือกไว้ก่อนหน้านี้ได้ เนื่องจากต้องใช้เวลาอย่างน้อย 4 วันในการดำเนินการจัดส่ง'
  },
  en_US: {
    sorry: 'Sorry',
    ok: 'OK',
    add_normal_to_nyb_header: "Sorry, this product can't be added to your cart.",
    add_nyb_to_normal_header: "Sorry, this product can't be added to your cart.",
    add_normal_to_nyb_title: 'Please check out your current cart first!',
    add_normal_to_nyb_detail:
      "This product can't be delivered together with New Year Hamper(s) that is(are) previously added to your cart as New Year Hamper needs minimum 4 days delivery lead time.",
    add_nyb_to_normal_title: 'Please check out this current cart first!',
    add_nyb_to_normal_detail:
      "This New Year hamper can't be delivered together with the product(s) that is(are) previously added to your cart as it needs minimum 4 days delivery lead time."
  }
};

class ErrorNYBModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.object.isRequired,
    lang: PropTypes.oneOf(['th_TH', 'en_US']),
    onCloseButton: PropTypes.func,
    onConfirm: PropTypes.func
  };

  static defaultProps = {
    open: false,
    message: {},
    lang: 'th_TH',
    onCloseButton: () => {}
  };

  translate = field => translation[this.props.lang][field];

  renderMessage() {
    const { lang, message } = this.props;
    const { translate } = this;

    return (
      <div className="mt-error-nyb-modal-content-message">
        <span className="header">{translate(`${message}_header`)}</span>
        <span className="title">{translate(`${message}_title`)}</span>
        <span className="detail">{translate(`${message}_detail`)}</span>
      </div>
    );
  }

  render() {
    const { open, lang, items, onCloseButton, onConfirm } = this.props;

    const { translate } = this;

    return (
      <Modal className="mt-error-nyb-modal" open={open}>
        <div className="mt-error-nyb-modal__container">
          <Modal.Header className="mt-error-nyb-modal-header">
            <span className="icon" onClick={onCloseButton}>
              <CloseIcon />
            </span>
            <div className="message">{this.renderMessage()}</div>
          </Modal.Header>
          <ModalContent className="mt-error-nyb-modal-content" />
          <ModalActions className="mt-error-nyb-modal-actions" withShadow={false}>
            <Button primary size="large" className="button" onClick={onConfirm}>
              {translate('ok')}
            </Button>
          </ModalActions>
        </div>
      </Modal>
    );
  }
}

export default ErrorNYBModal;
