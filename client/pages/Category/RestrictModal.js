/**
 * @prettier
 */

import React from 'react'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'

import { Loader, Modal, ModalContent } from '../../magenta-ui'

import './RestrictModal.scss'

const mapStateToProps = state => ({})

export const RestrictModal = connect(mapStateToProps)(({ open, onClosePopup, content }) => (
  <Modal
    className="alco-restrict-content"
    size="small"
    open={open}
    onClose={onClosePopup}
  >
    <ModalContent>
      <button className="close-icon" onClick={onClosePopup}>
        <img src="/assets/icons/close_modal.svg" alt="modal close" />
      </button>
      <div className="alco-restrict-modal">
        <div className="alco-restrict-modal__banner">
          {ReactHtmlParser(content)}
          {/* <img src="/assets/images/central-group.jpg" alt="Alcohol Banner" /> */}
        </div>
      </div>
    </ModalContent>
  </Modal>
))
