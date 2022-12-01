import React, { Component } from 'react';
import { get as prop, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import Cookies from 'js-cookie';
import { Modal, Grid, Message, Button, Icon } from '../../magenta-ui';
import SiteLogo from '../Utils/SiteLogo';
import LanguageSwitch from '../LanguageSwitch';
import LocationSelector from './LocationSelector';
import LocationFinder from './LocationFinder';

import { saveShippingLocation } from '../../reducers/shippingAddress';
import { closeModalStoreSelector } from '../../reducers/cart';

import './StoreSelectorModal.scss';

class StoreSelectorModal extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    province: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    subdistrict: PropTypes.string.isRequired,
    zipcode: PropTypes.string.isRequired,
    pageWidth: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    closeModalStoreSelector: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
  };

  state = {
    visible: false,
    locationActive: false,
    locationStatus: false,
    locationSubmit: false,
    showFindNotModal: false,
  };

  componentDidMount() {
    const { province, district, subdistrict, zipcode } = this.props;
    const hasShippingAddress = province && district && subdistrict && zipcode;
    const userDidClosePopup = Cookies.get('popup_close');

    if (!hasShippingAddress && !userDidClosePopup) {
      this.openPopup();
    }
  }

  closePopup = () => {
    Cookies.set('popup_close', 1, { expires: 1 });
    this.setState({ visible: false });
  };

  openPopup = () => {
    this.setState({ visible: true });
  };

  onLocationActive = status => {
    this.setState({ locationActive: true, locationStatus: status });
  };

  renderSubmitButton() {
    const { translate, storeLoading, selectedSubDistrict } = this.props;
    const { locationSubmit } = this.state;

    return (
      <div id="location-selector-submit">
        {storeLoading || locationSubmit ? (
          <Button
            className="location-selector-submit"
            size="large"
            fluid
            // disabled={this.checkStoreError() || !selectedSubDistrict || storeLoading || locationSubmit}
            loading={storeLoading || locationSubmit}
          >
            <span style={{ height: 40, display: 'block' }} />
          </Button>
        ) : (
          <div
            className="location-selector-submit"
            onClick={this.handleSubmitLocation}
            // disabled={this.checkStoreError() || !selectedSubDistrict || storeLoading || locationSubmit}
          >
            {translate('location_selector.confirm_button')}
            <Icon className="chevron right arrow-right" />
          </div>
        )}
      </div>
    );
  }

  checkStoreError = () => {
    const { storeStatus, selectedSubDistrict, storeLoading } = this.props;
    return Boolean(!storeStatus && selectedSubDistrict && !storeLoading);
  };

  handleSubmitLocation = () => {
    const {
      selectedProvince,
      selectedDistrict,
      selectedSubDistrict,
      selectedZipcode,
    } = this.props;
    this.setState({ locationSubmit: true });

    if (this.checkStoreError()) {
      this.setState({
        showFindNotModal: true,
      });
    } else {
      this.props
        .saveShippingLocation(
          selectedProvince,
          selectedDistrict,
          selectedSubDistrict,
          selectedZipcode,
        )
        .then(value => {
          if (value.status === 'success') {
            const action = !isEmpty(Cookies.get('product_add_to_cart'))
              ? prop(
                  JSON.parse(Cookies.get('product_add_to_cart')),
                  'action',
                  '',
                )
              : false;
            const product = !isEmpty(Cookies.get('product_add_to_cart'))
              ? prop(
                  JSON.parse(Cookies.get('product_add_to_cart')),
                  'product',
                  {},
                )
              : false;

            if (action === 'set_product') {
              Cookies.set(
                'product_add_to_cart',
                JSON.stringify({ action: 'add_product', product }),
              );
            }

            window.location.reload();
          } else {
            alert('can not select this store.');
          }
        });
    }

    this.setState({ locationSubmit: false });
  };

  handleChangeDeliveryArea = () => {
    this.setState({
      showFindNotModal: false,
    });
  };

  handleOpenFindDelivery = () => {
    const { lang } = this.props;

    if (prop(lang, 'code', 'th_TH') === 'th_TH') {
      window.open('https://topsmarket.tops.co.th/th/สาขาของเรา/');
    } else {
      window.open('https://topsmarket.tops.co.th/store-locations/');
    }

    this.setState({
      showFindNotModal: false,
    });

    this.props.closeModalStoreSelector();
  };

  renderModalFindNotStore = () => {
    const { translate } = this.props;
    const { showFindNotModal } = this.state;
    return (
      <div id="find-not-store">
        <Modal id="find-not-store-modal" open={showFindNotModal}>
          <Modal.Content>
            <div className="content-find-not-store-modal">
              <span className="find-not-store-modal-title">
                {translate('location_finder.error_find_not_store.title')}
              </span>
              <span className="find-not-store-modal-detail">
                {translate('location_finder.error_find_not_store.message')}
              </span>
              <button
                className="btn-open-find-delivery"
                onClick={() => this.handleOpenFindDelivery()}
              >
                {translate(
                  'location_finder.error_find_not_store.find_tops_market',
                )}
              </button>
              <button
                className="btn-change-delivery-area"
                onClick={() => this.handleChangeDeliveryArea()}
              >
                {translate('location_finder.error_find_not_store.change_area')}
              </button>
            </div>
          </Modal.Content>
        </Modal>
      </div>
    );
  };

  renderModalPopUpSelector = () => {
    const { translate, open } = this.props;
    const { visible, locationActive, locationStatus } = this.state;

    return (
      <div id="store-selector">
        <Modal
          id="store-selector-modal"
          // open={visible}
          open={open}
          // closeIcon
          // closeOnDocumentClick
          // closeOnDimmerClick
          // onClose={this.closePopup}
          onOpen={this.openedPopup}
        >
          <Modal.Content>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column
                  className={`store-selector-left ${
                    locationActive ? 'location-active' : ''
                  }`}
                  computer="10"
                  tablet="16"
                >
                  <div className="store-selector-gps-box">
                    <div className="box-desc">
                      <h3 className="title">
                        {translate('location_finder.finder_title')}
                      </h3>
                      <div className="desc">
                        <h4>
                          <strong>
                            {translate('location_finder.finder_sub_title')}
                          </strong>
                        </h4>
                        <p>{translate('location_finder.finder_desc')}</p>
                      </div>
                      <LocationFinder
                        labelPosition="left"
                        onLocationActive={this.onLocationActive}
                      />
                    </div>
                    <div className="box-bg">
                      {locationActive && locationStatus === false && (
                        <h3 className="box-message red">
                          {translate('location_finder.location_message_err')}
                        </h3>
                      )}
                      {locationActive && locationStatus === true && (
                        <h3 className="box-message">
                          {translate(
                            'location_finder.location_message_success',
                          )}
                        </h3>
                      )}
                      <span className="box-bg--img" />
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column
                  className="store-selector-right"
                  computer="6"
                  tablet="16"
                >
                  <h3 className="mobile-title">
                    {translate('location_finder.finder_mobile_title')}
                  </h3>
                  <LocationFinder
                    labelPosition="left"
                    onLocationActive={this.onLocationActive}
                  />
                  <SiteLogo />
                  <h4 className="desc">
                    {translate('location_selector.select_location_msg')}
                  </h4>
                  <LocationSelector enable={visible} />
                  <LanguageSwitch
                    className="language-switch mobile-language"
                    key="6"
                    style={{ order: 2 }}
                  />
                  {this.renderSubmitButton()}
                  {/* <div className="login-register">
                    <a className="login text-danger" href={`/${lang.url}/login`}>
                      {translate('sp_sidebar.login')}
                    </a>
                    <label className="slash"> / </label>
                    <a className="register text-gray" href={`/${lang.url}/registration`}>
                      {translate('sp_sidebar.register')}
                    </a>
                  </div> */}
                  <LanguageSwitch />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </div>
    );
  };

  render() {
    const { showFindNotModal } = this.state;

    return showFindNotModal
      ? this.renderModalFindNotStore()
      : this.renderModalPopUpSelector();
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  lang: getActiveLanguage(state.locale),
  province: state.shippingAddress.province,
  district: state.shippingAddress.district,
  subdistrict: state.shippingAddress.subdistrict,
  zipcode: state.shippingAddress.zipcode,
  pageWidth: state.layout.pageWidth,
  selectedProvince: state.region.selectedProvince,
  selectedDistrict: state.region.selectedDistrict,
  selectedSubDistrict: state.region.selectedSubDistrict,
  selectedZipcode: state.region.selectedZipcode,
  storeLoading: state.storeConfig.loading,
  storeStatus: state.storeConfig.storeStatus,
  products: state.product.items,
});

const mapDispatchToProps = dispatch => ({
  saveShippingLocation: (regionId, districtId, subdistrictId, zipcode) =>
    dispatch(
      saveShippingLocation(regionId, districtId, subdistrictId, zipcode),
    ),
  closeModalStoreSelector: () => dispatch(closeModalStoreSelector()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoreSelectorModal);
