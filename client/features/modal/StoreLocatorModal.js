import React, { PureComponent } from 'react';
import {
  Modal,
  Row,
  Col,
  Button,
  breakpoint,
  HideMobile,
  HideDesktop,
  Icon,
} from '@central-tech/core-ui';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import StoreLocatorList from '../storeLocator/StoreLocatorList';
import withCustomer from '../../hoc/withCustomer';
import withAddress from '../../hoc/withAddress';
import ModalTemplate from './components/ModalTemplate';
import withStoreLocator from '../../hoc/withStoreLocator';
import withLocales from '../../hoc/withLocales';

const MAP_ICON = '/assets/icons/map-icon.svg';

const OverflowSection = styled.div`
  overflow: auto;
  max-height: 50vh;
  min-height: 40vh;
  border: 1px solid #f3f3f3;

  ${breakpoint('xs', 'md')`
    max-height: none;
    height: 100%;
    padding-bottom: 80px;
    min-height: 0px;
  `}
`;

const ButtonWithIcon = styled(TextGuide)`
  display: flex;
  justify-content: center;
`;

const ButtonWithBorder = styled(Button)`
  :hover {
    border: 1px solid #808080;
    border-radius: 4px;
  }
`;

const ButtonRadius = styled(Button)`
  border-radius: 4px;
  ${breakpoint('xs', 'md')`
    border-radius: 0;
  `}
`;

const ModalInputSearch = styled.div`
  background-color: #ffffff;
  padding: 0 0 24px 0;

  ${breakpoint('xs', 'md')`
    padding: 12.5px 20px 12.7px;
  `}
`;

const InputSearchPickUpStore = styled.input`
  width: 100%;
  height: 39px;
  border-radius: 8px;
  border: solid 1px #e1e1e1;
  padding: 3px 10px 3px 34px;
  ::placeholder {
    font-family: Thonburi, sans-serif !important;
    line-height: 20px;
    font-size: 14px;
    color: #bfbfbf;
  }
`;

const SearchPickUpStore = styled.div`
  position: relative;
`;

const IconSearchPickUpStore = styled(Icon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
`;

const InputError = styled(TextGuide)`
  display: flex;
  width: 100%;
  height: 32px;
  margin-top: 14px;
  align-items: center;
  background-color: #f8f8f8;
  border: 1px solid #e5e5e5;
  padding: 0 11px 0;
  color: #949494;
`;

@withAddress
@withCustomer
@withStoreLocator
class StoreLocatorModal extends PureComponent {
  deliveryFormSubmit = null;
  state = { selectedStore: {}, searchStoreName: '' };

  componentWillReceiveProps(nextProps) {
    if (isEmpty(this.state.selectedStore) && nextProps.selectedStore) {
      this.setState({
        selectedStore: nextProps.selectedStore,
      });
    }
  }

  handleAddNewAddressSubmit = async value => {
    await this.props.addAddress(value);
    await this.handleChangeStore(value);
  };

  handleStoreLocatorSelected = store => {
    this.setState({ selectedStore: store });
  };

  handleAddressDelete = address => {
    const addressId = address && address.id;
    if (addressId) {
      this.props.deleteAddress(addressId);
    }
  };

  handleChangeStore = (address, showSameAddressButton) => {
    this.props.onChange(address, showSameAddressButton);
  };

  handleCloseModal = () => {
    this.setState({
      selectedStore: {},
    });

    this.setState({ searchStoreName: '' });

    this.props.resetSearchStore();
    this.props.onModalClose();
  };

  handleSearchStore = event => {
    this.setState({ searchStoreName: event.target.value });
    this.props.searchStoreLocator(event.target.value);
  };

  render() {
    const { open, translate, storeLocator } = this.props;

    return (
      <ModalTemplate
        open={open}
        onModalClose={this.handleCloseModal}
        headerIcon={MAP_ICON}
        title={translate('slore_locator_modal.title')}
        description={translate('slore_locator_modal.description')}
        bodyColor="#ffffff"
        close={this.handleCloseModal}
        // topSpace
        borderContent="none"
        backButtonIcon
        renderFooter={
          <Row justify="space-between">
            <Col xs={0} md={6}>
              <HideMobile>
                <ButtonWithBorder color="none" width={120} height={40}>
                  <Modal.Close>
                    <TextGuide type="body" align="center">
                      {translate('button.close')}
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
                disabled={isEmpty(this.state.selectedStore)}
                onClick={() =>
                  this.handleChangeStore(this.state.selectedStore, true)
                }
              >
                <ButtonWithIcon type="body" align="center" color="#fff">
                  {translate('button.select_pickup_store')}
                  <HideDesktop>
                    <Icon
                      src="/assets/icons/round-arrow-forward-white.svg"
                      style={{ marginLeft: 5 }}
                      height={13}
                    />
                  </HideDesktop>
                </ButtonWithIcon>
              </ButtonRadius>
            </Col>
          </Row>
        }
      >
        <React.Fragment>
          <ModalInputSearch>
            <SearchPickUpStore>
              <IconSearchPickUpStore src="/assets/icons/search-icon-gray.svg" />
              <InputSearchPickUpStore
                type="text"
                name="searchPickUpStore"
                label=""
                placeholder={translate(
                  'search_store_locator.input_search_placeholder',
                )}
                onChange={this.handleSearchStore}
                value={this.state.searchStoreName}
              />
            </SearchPickUpStore>
            {storeLocator?.search?.error && (
              <InputError>{storeLocator?.search?.error}</InputError>
            )}
          </ModalInputSearch>
          <OverflowSection>
            <StoreLocatorList
              selectedStore={this.state.selectedStore}
              onStoreSelected={this.handleStoreLocatorSelected}
              trnaslate={translate}
            />
          </OverflowSection>
        </React.Fragment>
      </ModalTemplate>
    );
  }
}

export default withLocales(StoreLocatorModal);
