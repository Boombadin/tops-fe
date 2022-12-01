import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import pt from 'prop-types'
import { getTranslate } from 'react-localize-redux';
import { CustomButton, Modal, ModalContent, ModalActions } from '../../magenta-ui'
import { langSelector } from '../../selectors'
import './CartWillBeMovedModal.scss'

/* eslint-disable no-confusing-arrow */
const ModalText = ({ storeName, lang }) => lang === 'th_TH'
  ? (
    <div className="cwbr-modal__text">
      <div>
        การใช้ที่อยู่จัดส่งเป็น <span className="cwbr-modal__address-name">‘{storeName}’</span>
      </div>
      <div>
        อาจทำให้สินค้าบางรายการมีการเปลี่ยนแปลง
      </div>
    </div>
  )
  : (
    <div className="cwbr-modal__text">
      <div>
        Changing delivery to <span className="cwbr-modal__address-name">‘{storeName}’</span>
      </div>
      <div>
        may cause changes to your order.
      </div>
    </div>
  )

class CartWillBeMovedModal extends PureComponent {
  static propTypes = {
    storeName: pt.string.isRequired,
    open: pt.bool.isRequired,
    onClose: pt.func.isRequired,
    onConfirm: pt.func.isRequired,
    lang: pt.string.isRequired,
    translate: pt.func.isRequired
  }

  render() {
    const { lang, onClose, onConfirm, open, storeName, translate } = this.props

    console.log({ open });
    
    return (
      <Modal
        open={open}
        closeOnDocumentClick
        closeOnDimmerClick
        onClose={onClose}
      >
        <ModalContent className="cwbr-modal__content">
          <div className="cwbr-modal__title">
            {translate('right_menu.shipping_options.change_address_modal.note')}
          </div>
          <ModalText storeName={storeName} lang={lang} />
        </ModalContent>
        <ModalActions>
          <div className="cwbr-modal__buttons-container">
            <CustomButton
              secondary
              type="left"
              className="cwbr-modal__button--secondary"
              onClick={onClose}
            >
              {translate('right_menu.shipping_options.change_address_modal.cancel')}
            </CustomButton>
            <CustomButton
              primary
              type="right"
              className="cwbr-modal__button--primary"
              onClick={onConfirm}
            >
              {translate('right_menu.shipping_options.change_address_modal.confirm')}
            </CustomButton>
          </div>

        </ModalActions>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  lang: langSelector(state)
})

export default connect(mapStateToProps)(CartWillBeMovedModal)
