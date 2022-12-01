import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { useCartContext } from '@client/contexts';
import {
  CustomButton,
  Divider,
  Form,
  Modal,
  ModalActions,
  ModalContent,
  Radio,
} from '@client/magenta-ui';

const TitleFirstRow = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;

  color: #f60403;
`;
const TitleSecondRow = styled.div`
  margin-bottom: 8px;

  color: #f60403;
`;
const StyledDivider = styled(Divider)`
  width: 400px;
`;
const CloseModalButton = styled.button`
  background: transparent !important;
  border: none !important;
  position: absolute !important;
  top: 5px !important;
  right: 0 !important;
`;
const CloseModalImg = styled.img`
  width: 13.3px;
  height: 14.5px;
`;
const TextNote = styled.div`
  font-weight: bold;
  margin-top: 30px;
  font-size: 12px;
  color: #f60403;
  margin-bottom: 65px;
  text-align: center;
  padding: 0 10px;
  line-height: 20px;
`;
const AdultRadioGroup = styled(Form.Field)`
  margin-top: 30px;
  margin-bottom: 40px;
`;
const AdultRadio = styled(Radio)`
  font-size: 16px !important;

  &:last-child {
    margin-left: 40px;
  }
`;

function AdultConfirmationModal({ translate }) {
  const [isAdult, setAdult] = useState(null);
  const { adultConfirmationModal, cartAction } = useCartContext();

  function handleAdultConfirmationRadioChange(_event, { value }) {
    setAdult(value === 'yes');
  }

  return (
    <Modal
      size="small"
      open={adultConfirmationModal.isShow}
      onClose={cartAction.closeAdultConfirmationModal}
    >
      <ModalContent>
        <CloseModalButton onClick={cartAction.closeAdultConfirmationModal}>
          <CloseModalImg
            src="/assets/icons/close_modal.svg"
            alt="close modal"
          />
        </CloseModalButton>
        <TitleFirstRow>
          <h3>{translate('age_modal.upper_title')}</h3>
        </TitleFirstRow>
        <TitleSecondRow>
          <h3>{translate('age_modal.lower_title')}</h3>
        </TitleSecondRow>
        <StyledDivider />
        <Form>
          <AdultRadioGroup>
            <AdultRadio
              label={translate('age_modal.yes')}
              name="radioGroup"
              value="yes"
              checked={isAdult === true}
              onChange={handleAdultConfirmationRadioChange}
            />
            <AdultRadio
              label={translate('age_modal.no')}
              name="radioGroup"
              value="no"
              checked={isAdult === false}
              onChange={handleAdultConfirmationRadioChange}
            />
          </AdultRadioGroup>
        </Form>
        <TextNote>{translate('age_modal.note')}</TextNote>
      </ModalContent>
      <ModalActions>
        <CustomButton
          primary
          size="large"
          onClick={() =>
            cartAction.submitAdultConfirmationModal({
              isAdult,
              productToAdd: adultConfirmationModal?.selectedProduct,
            })
          }
        >
          {translate('age_modal.confirm')}
        </CustomButton>
      </ModalActions>
    </Modal>
  );
}

AdultConfirmationModal.propTypes = {
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(AdultConfirmationModal);
