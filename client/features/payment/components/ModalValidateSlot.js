import { breakpoint, Button, Margin, Modal } from '@central-tech/core-ui';
import React from 'react';
import styled from 'styled-components';

const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  max-width: 690px;
  width: 100%;
  min-height: 300px;
  border-radius: 5px;
  padding: 19px 30px 20px 40px;
  text-align: center;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
  ${breakpoint('xs', 'md')`
    width: 90%;
    min-height: 250px;
  `}
`;

const ModalContentText = styled.div``;

const ModalValidateSlot = ({
  modalValidateSlotOpened,
  modalValidateSlotMessage,
  handleClickBack,
}) => {
  return (
    <Modal visible={modalValidateSlotOpened} onModalClose={handleClickBack}>
      <ModalContent>
        <ModalContentText>
          {modalValidateSlotMessage}
          <Margin xs="20px 0 0">
            <Modal.Close>
              <Button height={30} size={13} radius="4px" color="danger">
                Close
              </Button>
            </Modal.Close>
          </Margin>
        </ModalContentText>
      </ModalContent>
    </Modal>
  );
};

export default ModalValidateSlot;
