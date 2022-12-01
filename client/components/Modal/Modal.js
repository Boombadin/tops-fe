import React from 'react';
import posed from 'react-pose';
import styled from 'styled-components';
import { tween } from 'popmotion';
import { func, number, string, element, oneOfType, bool, node } from 'prop-types';
import { Button } from '../Button';
import { Card } from '../Card';
import BlackClose from '../Icons/BlackClose';

const Fade = posed.div({
  fadeIn: {
    opacity: 1,
    transition: tween,
  },
  fadeOut: {
    opacity: 0,
    transition: tween,
  },
});

export const BlackPage = styled(Fade)`
  display: ${props => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(51, 51, 51, 0.8);
  padding: 25px;
  z-index: 9999;
`;

export const ModalMain = styled.section`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (min-width: 991px) {
    width: 80%;
  }
`;

const Modal = ({ onClose, width, children, title, visible, footer }) => (
  <BlackPage pose={visible ? 'fadeIn' : 'fadeOut'} visible={visible}>
    <ModalMain>
      <Card
        isBorder={false}
        title={title}
        width={width}
        color="#333"
        actions={() => <Button title="X" size="small" isActions onClick={onClose} />}
        footer={footer}
      >
        {!title && (
          <div style={{ textAlign: 'right' }}>
            <Button color="white" size="small" isActions onClick={onClose}>
              <BlackClose />
            </Button>
          </div>
        )}
        {children}
      </Card>
    </ModalMain>
  </BlackPage>
);

Modal.propTypes = {
  onClose: func,
  width: number,
  title: string,
  visible: bool,
  children: oneOfType([func, element, node]),
  footer: func,
};

Modal.defaultProps = {
  onClose: () => null,
  width: 0,
  title: '',
  visible: false,
  children: null,
  footer: null,
};

export default Modal;
