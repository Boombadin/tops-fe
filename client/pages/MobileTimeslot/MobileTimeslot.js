import React, { PureComponent } from 'react';
import { func, array, bool, string } from 'prop-types';
import { find, get as prop, isEmpty, includes, filter, first } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { getTranslate } from 'react-localize-redux';
import './MobileTimeslot.scss';
import TimeslotDaysIntervalSwitch from '../../components/TimeslotDaysIntervalSwitch';
import TimeslotGrid from '../../components/TimeslotGrid';
import ArrowLeft from '../../components/Icons/ArrowLeft';
import ArrowRight from '../../components/Icons/ArrowRight';
import { createIntervals } from '../../components/TimeSlotTab/utils';
import ShipmentFreeNotification from '../../components/ShipmentFreeNotification';
import { Loader, Button, Icon, Image } from '../../magenta-ui';
import { fetchShippingMethods } from '../../reducers/cart';
import {
  addDeliverySlotInfo,
  getStorPickUpSlot,
} from '../../reducers/checkout';

import { findDeliverySlot } from '../../features/nyb/redux/nybSelector';
import { getCustomerSelector, isAppGrab } from '../../selectors';
import UpperHeader from '../../components/UpperHeader';
import { unsetCookie } from '../../utils/cookie';

class MobileTimeslot extends PureComponent {
  static propTypes = {
    deliverySlots: array.isRequired,
    translate: func.isRequired,
    fetchShippingMethods: func.isRequired,
    areShippingMethodsLoading: bool.isRequired,
    areShippingMethodsLoaded: bool.isRequired,
    shippingDays: array.isRequired,
    addDeliverySlotInfo: func.isRequired,
    storeConfig: array,
    cmsBlock: array,
    customer: array,
    deliveryMethod: string,
    shippingMethods: array,
  };

  static defaultProps = {
    cmsBlock: [],
    customer: [],
    storeConfig: [],
    deliveryMethod: '',
    shippingMethods: [],
  };

  state = {
    activeSlotId: '',
    currentIntervalIndex: 0,
    loading: false,
    collector: null,
  };

  componentDidMount() {
    // if (!this.props.areShippingMethodsLoading && !this.props.areShippingMethodsLoaded) {
    //   this.props.fetchShippingMethods()
    // }
    const { deliveryMethod, locatorId } = this.props;
    this.props.getStorPickUpSlot(locatorId, deliveryMethod);
  }

  componentWillReceiveProps(nextProps) {
    const { deliveryMethod, formValues, storeLocator } = this.props;
    if (isEmpty(this.state.collector)) {
      this.setState({
        collector: {
          store_id: prop(first(storeLocator), 'id'),
          receiver_name: formValues.first_name,
          receiver_phone: formValues.contact_number,
        },
      });
    }

    // const { deliveryMethod, shippingMethods } = this.props

    // let shippingMethod = {}
    // if (!isEmpty(deliveryMethod)) {
    //   shippingMethod = prop(find(shippingMethods, { methodCode: deliveryMethod }), 'extensionAttributes.deliverySlot', []);
    // } else {
    //   shippingMethod = prop(find(shippingMethods, { carrierCode: 'standard' }), 'extensionAttributes.deliverySlot', []);
    // }

    // if (!this.state.activeSlotId && !isEmpty(shippingMethod)) {
    //   const firstDate = shippingMethod[0];
    //   if (firstDate) {
    //     const firstSlots = prop(firstDate, 'slots')
    //     const findFirstEnableSlot = find(firstSlots, (slot) => slot.enabled && (slot.available && slot.available > 0) && slot.isAllow)
    //     if (!findFirstEnableSlot) {
    //       return null
    //     }

    //     this.handleChooseSlot(`${firstDate.date}/${findFirstEnableSlot.id}`);
    //   }
    // }
    // return null
  }

  handleIntervalChange = newIntervalIndex =>
    this.setState({
      currentIntervalIndex: newIntervalIndex,
    });

  handleChooseSlot = slotId => {
    if (!this.state.loading) {
      this.setState({ activeSlotId: slotId });
      this.setDeliverySlotInfo(slotId);
    }
  };

  setDeliverySlotInfo = async slotId => {
    const { deliveryMethod } = this.props;
    const { collector } = this.state;
    this.setState({ loading: true });

    try {
      const response = await this.props.addDeliverySlotInfo(
        slotId,
        deliveryMethod,
        collector,
      );
      this.setState({ loading: false });

      if (response.data.error) {
        alert('ไม่สามารถจัดส่งเวลานี้ได้');
      }
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  handleSetDelivery = async () => {
    const { history, deliveryMethod } = this.props;

    unsetCookie('shipping_method');

    history.push('/checkout?delivery_method=' + deliveryMethod);
  };

  render() {
    // const intervals = createIntervals(this.props.shippingDays, 3, false)
    // const { translate, deliverySlots, history } = this.props
    // const titleDate = prop(deliverySlots, '0.label', '')

    const {
      translate,
      deliverySlots,
      history,
      storeConfig,
      cmsBlock,
      customer,
      deliveryMethod,
      shippingMethods,
      isGrabProvider,
      storeLocatorSlot,
      storeLocatorSlotLoading,
    } = this.props;
    let shippingMethod = {};
    let slotTitle = '';

    const shippingDescription = prop(
      find(shippingMethods, { methodCode: deliveryMethod || 'mds' }),
      'extensionAttributes.shipping_description',
      {},
    );
    const slotLabel = find(shippingDescription, { key: 'slot_label' });
    slotTitle = prop(slotLabel, 'value', '');

    if (!isEmpty(deliveryMethod)) {
      shippingMethod = prop(
        find(shippingMethods, { methodCode: deliveryMethod }),
        'extensionAttributes.deliverySlot',
        [],
      );
    } else {
      shippingMethod = prop(
        find(shippingMethods, { carrierCode: 'standard' }),
        'extensionAttributes.deliverySlot',
        [],
      );
    }

    if (!isEmpty(deliveryMethod) && deliveryMethod === 'tops') {
      shippingMethod = !storeLocatorSlotLoading && storeLocatorSlot;
    }

    const intervalsForTab = createIntervals(shippingMethod, 3);
    // const titleDate = prop(deliverySlots, '0.label', '')

    let filterData;
    if (!isGrabProvider) {
      filterData = filter(cmsBlock, val => {
        return (
          includes(
            val.identifier,
            !isEmpty(customer)
              ? 'promo_banner_homepage_customer'
              : 'promo_banner_homepage_guest',
          ) && val.active === true
        );
      });
    }

    return (
      <React.Fragment>
        <UpperHeader
          classWrapperName="promo-top-banner-wrapper"
          className="promo-top-banner"
          baseMediaUrl={storeConfig.base_media_url}
          cmsBlock={cmsBlock}
          isCustomer={!isEmpty(customer)}
          isGrabProvider={isGrabProvider}
        />
        <div className="mobile-ts">
          <div
            className={`mobile-ts__upper-panel ${!isEmpty(filterData) &&
              'upper-header-banner'}`}
          >
            <div
              className="mobile-ts__upper-panel__left"
              onClick={() => this.props.onBackClick()}
            >
              <ArrowLeft className="mobile-ts__upper-panel__left__arrow" />
              <div className="mobile-ts__upper-panel__left__text">
                {deliveryMethod === 'tops'
                  ? translate('timeslot.mobile.back_to_store')
                  : translate('timeslot.mobile.back_to_delivery')}
              </div>
            </div>
            <div className="mobile-ts__upper-panel__center">
              <div className="mobile-ts__upper-panel__text">
                {deliveryMethod === 'tops'
                  ? translate('timeslot.mobile.header_pickup')
                  : translate('timeslot.mobile.head_text')}
              </div>
              <div
                className="mobile-ts__upper-panel__subtext"
                dangerouslySetInnerHTML={{
                  __html: slotTitle.replace('\\n', '<br />'),
                }}
              />
            </div>
            <div className="mobile-ts__upper-panel__right">
              <div
                className="mobile-icon-help"
                onClick={() => history.push('/help')}
              >
                <img
                  src="/assets/icons/help-icon.svg"
                  width="19"
                  className="mobile-ts__upper-panel__right-icon"
                />
                <ShipmentFreeNotification />
              </div>
            </div>
          </div>

          {(this.props.areShippingMethodsLoading && (
            <div className="tst-loader-container">
              <Loader active inline="centered" />
            </div>
          )) || (
            <div
              className={`mobile-ts__container ${!isEmpty(filterData) &&
                'upper-header-mobile'}`}
            >
              {(!isEmpty(shippingMethod) && (
                <div>
                  <TimeslotDaysIntervalSwitch
                    controlled
                    activeIndex={this.state.currentIntervalIndex}
                    intervals={intervalsForTab}
                    onIntervalChange={this.handleIntervalChange}
                  />
                  <TimeslotGrid
                    controlled
                    headerClassName="timeslot-head--mobile"
                    active={this.state.activeSlotId}
                    days={intervalsForTab[this.state.currentIntervalIndex].days}
                    onChooseTime={this.handleChooseSlot}
                  />
                </div>
              )) || (
                <div className="mobile-ts__no-slot">
                  {translate('timeslot.noslot')}
                </div>
              )}
            </div>
          )}

          <div className="mobile-ts__lower-panel" />
          <div className="mobile-ts__button-panel">
            <Button
              className="mobile-ts__back-button"
              icon
              onClick={this.props.onBackClick}
            >
              <Icon className="chevron left" />
              {this.props.translate('right_menu.profile.billing.back')}
            </Button>
            <Button
              loading={this.state.loading}
              disabled={
                this.state.loading ||
                this.props.areShippingMethodsLoading ||
                this.state.activeSlotId === ''
              }
              className="mobile-ts__next-button"
              onClick={() => this.handleSetDelivery()}
            >
              {translate('timeslot.tab.buttons.confirm_date')}
              {/* <ArrowRight className="mobile-ts__next-button-arrow" stroke="white" fill="white" /> */}
              <Image className="icon-next" src="/assets/icons/shape.png" />
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  deliveryMethod: ownProps.deliveryMethod,
  areShippingMethodsLoading: state.cart.shippingMethods.isLoading,
  areShippingMethodsLoaded: !isEmpty(state.cart.shippingMethods.data),
  shippingDays: prop(
    find(state.cart.shippingMethods.data, {
      methodCode: ownProps.deliveryMethod || 'mds',
    }),
    'extensionAttributes.deliverySlot',
    [],
  ),
  translate: getTranslate(state.locale),
  deliverySlots: findDeliverySlot(state),
  shippingMethods: state.cart.shippingMethods.data,
  customer: getCustomerSelector(state),
  cmsBlock: state.cmsBlock.items,
  storeConfig: state.storeConfig.current,
  isGrabProvider: isAppGrab(state),
  storeLocator: state.checkout.storeLocator.items,
  formValues: prop(state, 'form.clickCollectInfo.values', {}),
  storeLocatorSlot: state.checkout.storeLocatorSlot,
  storeLocatorSlotLoading: state.checkout.storeLocatorSlotLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchShippingMethods,
      addDeliverySlotInfo,
      getStorPickUpSlot,
    },
    dispatch,
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MobileTimeslot),
);
