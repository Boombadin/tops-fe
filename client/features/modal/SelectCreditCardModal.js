import { breakpoint, Button, Modal } from '@central-tech/core-ui';
import React from 'react';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

import ModalTemplate from './components/ModalTemplate';

const ButtonWrap = styled(props => <div {...props}></div>)`
  display: flex;
  justify-content: flex-end;
  ${breakpoint('xs', 'md')`
    margin-right: 16px;
  `}
`;
export const SelectCreditCardModal = ({
  translate,
  openModal,
  onModalClose,
}) => {
  return (
    <ModalTemplate
      data-testid={generateTestId({
        type: ELEMENT_TYPE.INFO,
        action: ELEMENT_ACTION.VIEW,
        moduleName: 'SelectCreditCardModal',
        uniqueId: 'Container',
      })}
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
      title={translate('payment.credit_card.select_card_modal.title')}
      renderFooter={
        <ButtonWrap>
          <Button
            color="#199000"
            width={118}
            height={40}
            radius="4px"
            onClick={close}
          >
            <Modal.Close>
              <TextGuide type="body" align="center" color={'#fff'}>
                {translate('payment.credit_card.select_card_modal.btn_ok')}
              </TextGuide>
            </Modal.Close>
          </Button>
        </ButtonWrap>
      }
    ></ModalTemplate>
  );
};

export default withLocales(SelectCreditCardModal);
