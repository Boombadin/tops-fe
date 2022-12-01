import React from 'react';
import { bool, func } from 'prop-types';
import styled from 'styled-components';
import { H2, Paragraph } from '../../Typography';
import { Row, Col } from '../../Grid';
import { Button } from '../../Button';
import { Modal } from '../../Modal';

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

const NoSelectMethodModal = ({ visible, translate, onClose }) => (
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
          ขออภัย
        </H2>
      ) : (
        <WhiteSpace />
      )}
      <H2 align="center" type="bold" color="red">
        กรุณาเลือกประเภทการจัดส่ง
      </H2>
      <Row responsive={false}>
        <Col />
        <Paragraph padding="10px" align="center">
          กรุณาเลือกประเภทและเวลาในการจัดส่ง
        </Paragraph>
        <Col />
      </Row>
    </Position>
    <div className="hide-mobile">
      <Shadow />
    </div>
  </Modal>
);

NoSelectMethodModal.propTypes = {
  translate: func.isRequired,
  visible: bool,
  onClose: func.isRequired,
};

NoSelectMethodModal.defaultProps = {
  visible: false,
};

export default NoSelectMethodModal;
