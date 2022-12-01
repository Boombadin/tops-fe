import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import {
  Modal,
  Padding,
  Row,
  Col,
  Button,
  breakpoint,
  HideMobile,
  Margin,
} from '@central-tech/core-ui';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import withCustomer from '../../hoc/withCustomer';
import withAddress from '../../hoc/withAddress';
import ModalTemplate from './components/ModalTemplate';
import PersonalProfileForm from '../account/PersonalProfileForm';
import {
  getOneCardMembershipIdFromCustomer,
  getThe1MobileFromCustomer,
  getPhoneNumberFromCustomer,
} from '../../selectors';
import withLocales from '../../hoc/withLocales';

const OverflowSection = styled.div`
  overflow: auto;
  max-height: 50vh;
  min-height: 40vh;

  ${breakpoint('xs', 'md')`
    max-height: none;
    height: 100%;
    padding-bottom: 80px;
    min-height: 0px;
  `}
`;
const ButtonWithBorder = styled(Button)`
  :hover {
    border: 1px solid #808080;
    border-radius: 4px;
  }
`;

const initialState = {
  activeShippingType: 'home_delivery',
  addNewAddress: false,
  editAddress: null,
  selectedAddress: {},
  selectedStore: {},
};
const ButtonRadius = styled(Button)`
  border-radius: 4px;
  ${breakpoint('xs', 'md')`
    border-radius: 0;
  `}
`
@withAddress
@withCustomer
class PersonalProfileModal extends PureComponent {
  deliveryFormSubmit = null;

  state = { ...initialState };

  componentWillReceiveProps(nextProps) {
    if (nextProps.editMode && this.state.editAddress !== nextProps.address) {
      this.setState({
        editAddress: nextProps.address,
      });
    }
    if (nextProps.addNewMode) {
      this.setState({
        addNewAddress: true,
      });
    }
  }

  handleEditProfileSubmit = async value => {
    this.props.onChange(value);
  };

  handleAddOrEditAddress = () => {
    this.deliveryFormSubmit();
  };

  handleCloseModal = () => {
    this.setState({
      ...initialState,
    });
    this.props.onModalClose();
  };

  render() {
    const { open, customer, translate } = this.props;
    const initialValue = {
      idx: Date.now(),
      t1c: !isEmpty(getOneCardMembershipIdFromCustomer(customer))
        ? 't1c_card'
        : 't1c_phone',
      t1c_card: getOneCardMembershipIdFromCustomer(customer) || '',
      t1c_phone: getThe1MobileFromCustomer(customer) || '',
      mobile_phone: getPhoneNumberFromCustomer(customer) || '',
    };

    return (
      <ModalTemplate
        open={open}
        onModalClose={this.handleCloseModal}
        title={translate('profile_info.edit_personal_form.title')}
        close={this.handleCloseModal}
        backButtonIcon
        topSpace
        renderFooter={
          <Row justify="space-between">
            <Col xs={0} md={6}>
              <HideMobile>
                <ButtonWithBorder color="none" width={120} height={40}>
                  <Modal.Close>
                    <TextGuide type="body" align="center">
                      {translate('button.cancel')}
                    </TextGuide>
                  </Modal.Close>
                </ButtonWithBorder>
              </HideMobile>
            </Col>
            <Col align="right" xs={12} md="170px">
              <ButtonRadius
                color="success"
                block
                height={40}
                radius="4px"
                onClick={this.handleAddOrEditAddress}
              >
                <TextGuide type="body" align="center" color="#fff">
                  {translate('button.save')}
                </TextGuide>
              </ButtonRadius>
            </Col>
          </Row>
        }
      >
        <OverflowSection>
          <Padding xs="15px 19px 23px">
            <PersonalProfileForm
              onSubmit={this.handleEditProfileSubmit}
              initialValue={{
                ...customer,
                ...initialValue,
              }}
              submitFunc={submit => (this.deliveryFormSubmit = submit)}
            />
          </Padding>
        </OverflowSection>
      </ModalTemplate>
    );
  }
}

export default withLocales(PersonalProfileModal);
