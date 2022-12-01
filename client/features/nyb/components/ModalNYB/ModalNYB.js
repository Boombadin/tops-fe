import React from 'react';
import { oneOf, bool, func } from 'prop-types';
import styled from 'styled-components';
import { H2, Paragraph } from '../../../../components/Typography';
import { Row, Col } from '../../../../components/Grid';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Button';

const Shadow = styled.div`
  height: 30px;
  flex: 1;
  margin: -15px;
  margin-top: 30px;
  background-image: linear-gradient(to bottom, rgba(226, 226, 226, 0), #b1b1b1);
`;
const Position = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const FooterModal = styled.div`
  padding: 5px;
  @media (min-width: 991px) {
    background-color: white;
    padding: 30px;
  }
`;
const WhiteSpace = styled.div`
  @media (min-width: 991px) {
    padding: 20px;
  }
`;

const ModalNYB = ({ type, visible, translate, onClose }) => (
  <Modal
    visible={visible}
    width={760}
    onClose={onClose}
    footer={() => (
      <FooterModal>
        <Button
          title={translate('common.ok')}
          color="green"
          onClick={onClose}
          width={180}
          height={40}
        />
      </FooterModal>
    )}
  >
    <Position>
      {translate('nyb.modal.nyb.header_1') !== '.' ? (
        <H2 align="center" type="bold">
          {translate(`nyb.modal.${type}.header_1`)}
        </H2>
      ) : (
        <WhiteSpace />
      )}
      <H2 align="center" type="bold" color="red">
        {translate(`nyb.modal.${type}.header_2`)}
      </H2>
      <Row responsive={false}>
        <Col />
        <Paragraph padding="10px" align="center">
          {translate(`nyb.modal.${type}.description`)}
        </Paragraph>
        <Col />
      </Row>
    </Position>
    <div className="hide-mobile">
      <Shadow />
    </div>
  </Modal>
);

ModalNYB.propTypes = {
  translate: func.isRequired,
  type: oneOf(['normal', 'nyb']).isRequired,
  visible: bool,
  onClose: func.isRequired,
};

ModalNYB.defaultProps = {
  visible: false,
};

export default ModalNYB;
