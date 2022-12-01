import { breakpoint, Button, Modal } from '@central-tech/core-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import { useCreditCardContext } from '@client/contexts/CreditCardContext';
import withLocales from '@client/hoc/withLocales';

import ModalTemplate from './components/ModalTemplate';

const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  ${breakpoint('xs', 'md')`
    margin-right: 16px;
  `}
`;
const DiscardNewCreditCardFormModal = ({
  translate,
  openModal,
  onModalClose,
}) => {
  const history = useHistory();
  const {
    configDiscardFormModal,
    setIsShowCardList,
    setOpenCreditCardFormInSavedList,
  } = useCreditCardContext();

  const handleConfirmClick = () => {
    if (configDiscardFormModal?.navigatePath) {
      history.replace(configDiscardFormModal?.navigatePath);
    } else {
      setIsShowCardList(true);
      setOpenCreditCardFormInSavedList(false);
    }
  };
  return (
    <ModalTemplate
      open={openModal}
      onModalClose={onModalClose}
      close={onModalClose}
      isCloseIcon={false}
      closeOnClick={false}
      backgroundContent={'#ffffff'}
      borderContent={'none'}
      maxWidth={'497px'}
      mobileMaxWidth={'335px'}
      mobileHeight={'158px'}
      minHeight={'163px'}
      mobileRadius={'5px'}
      footerPositionBottom={'20px'}
      title={
        <TextGuide bold type="topic" align="left">
          {translate('payment.credit_card.confirmed_modal.title')}
        </TextGuide>
      }
      renderFooter={
        <ButtonWrap>
          <Button color="none" width={120} height={40} onClick={close}>
            <Modal.Close>
              <TextGuide type="body" align="left">
                {translate('payment.credit_card.confirmed_modal.btn_cancel')}
              </TextGuide>
            </Modal.Close>
          </Button>
          <Button
            color="#199000"
            width={118}
            height={40}
            radius="4px"
            onClick={handleConfirmClick}
          >
            <Modal.Close>
              <TextGuide type="body" align="center" color={'#fff'}>
                {translate('payment.credit_card.confirmed_modal.btn_ok')}
              </TextGuide>
            </Modal.Close>
          </Button>
        </ButtonWrap>
      }
    ></ModalTemplate>
  );
};

export default withLocales(DiscardNewCreditCardFormModal);
