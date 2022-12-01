import React, { PureComponent } from 'react';
import pt from 'prop-types';
import { isEmpty, noop, find, get as prop, first, map } from 'lodash';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import { Modal, Loader, Button } from '../../magenta-ui';
import ArrowLeft from '../Icons/ArrowLeft';
import Close from '../Icons/Close';
import DoubleArrowRight from '../Icons/DoubleArrowRight';
import TimeSlotGrid from '../TimeslotGrid';
import TimeslotDaysIntervalSwitch, {
  TimeslotModalIntervalSwitch,
} from '../TimeslotDaysIntervalSwitch';
import { createIntervals } from './utils';
import { unsetCookie } from '../../utils/cookie';
import CalendarIcon from '../Icons/Calendar';
import './TimeSlotTab.scss';
import {
  addDeliverySlotInfo,
  getStorPickUpSlot,
} from '../../reducers/checkout';
import {
  setModalOpened,
  setModalClosed,
  setSidebar,
} from '../../reducers/layout';
import {
  findEveryProductIsNyb,
  findDeliverySlot,
} from '../../features/nyb/redux/nybSelector';

// Constants
const isFirefox = typeof InstallTrigger !== 'undefined';
class TimeSlotTab extends PureComponent {
  static propTypes = {
    translate: pt.func.isRequired,
    areShippingMethodsLoading: pt.bool.isRequired,
    shippingDays: pt.array,
    setModalOpened: pt.func.isRequired,
    setModalClosed: pt.func.isRequired,
    onBackClick: pt.func,
    isNyb: pt.bool,
    deliverySlots: pt.array.isRequired,
    shippingMethods: pt.array,
    deliveryMethod: pt.string,
  };

  static defaultProps = {
    shippingDays: [],
    onBackClick: noop,
    isNyb: false,
    shippingMethods: [],
    deliveryMethod: '',
  };

  /* Auto select slot first
  componentDidMount() {
    if (!this.state.currentSlotId && !isEmpty(shippingMethod)) {
      const firstDate = shippingMethod[0]
      if (firstDate) {
        const firstSlots = prop(firstDate, 'slots')
        const findFirstEnableSlot = find(firstSlots, (slot) => slot.enabled && (slot.available && slot.available > 0) && slot.isAllow)
        if (!findFirstEnableSlot) {
          return null
        }

        this.handleChooseSlot(`${firstDate.date}/${findFirstEnableSlot.id}`);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.currentSlotId && !isEmpty(nextProps.shippingDays)) {
      const firstDate = nextProps.shippingDays[0]
      if (firstDate) {
        const firstSlots = prop(firstDate, 'slots')
        const findFirstEnableSlot = find(firstSlots, (slot) => slot.enabled && (slot.available && slot.available > 0) && slot.isAllow)
        if (!findFirstEnableSlot) {
          return null
        }

        this.handleChooseSlot(`${firstDate.date}/${findFirstEnableSlot.id}`);
      }
    }
  }
  */

  state = {
    loading: false,
    modalOpened: false,
    currentIntervalIndexModal: 0,
    currentIntervalIndex: 0,
    currentSlotId: '',
    collector: null,
  };

  componentDidMount() {
    const { deliveryMethod, locatorId } = this.props;
    this.props.getStorPickUpSlot(locatorId, deliveryMethod);
  }

  componentWillReceiveProps() {
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
  }

  handleClosePopup = key => {
    this.setState({ [key]: false });
    this.props.setModalClosed();
  };

  handleModalOpen = () => {
    this.setState({ modalOpened: true });
    this.props.setModalOpened();
  };

  handleIntervalChange = idx => this.setState({ currentIntervalIndex: idx });

  handleIntervalChangeModal = idx =>
    this.setState({ currentIntervalIndexModal: idx });

  handleChooseSlot = slotId => {
    if (!this.state.loading) {
      this.setState({ currentSlotId: slotId });
      this.setDeliverySlotInfo(slotId);
    }
  };

  setDeliverySlotInfo = async slotId => {
    const { deliveryMethod, formValues, storeLocator } = this.props;
    const { collector } = this.state;
    // console.log("formValues", formValues)
    this.setState({ loading: true });
    // const collector = {
    //   store_id: first(storeLocator).id,
    //   receiver_name: formValues.first_name,
    //   receiver_phone: formValues.contact_number
    // }
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

  handleConfirmDate = async () => {
    const { history, deliveryMethod } = this.props;

    unsetCookie('shipping_method');

    history.push(`/checkout?delivery_method=${deliveryMethod}`);
  };

  renderWarningModal() {
    const isOpened = true;

    return (
      <React.Fragment>
        <div className="timeslottab-root">
          <Modal
            id="timeslottab-modal"
            open={isOpened}
            closeOnDocumentClick
            closeOnDimmerClick
            onClose={this.handleClosePopup}
          >
            <div className="timeslottab-modal">
              <div className="timeslottab-modal__body">
                <div className="timeslottab-modal__body-gradient" />
                <div className="timeslottab-modal__title" />
                <div>ขออภัย</div>
              </div>
              <div className="timeslottab-modal__footer"></div>
              <Close
                className="timeslottab-modal__close"
                width="15"
                height="15"
                onClick={this.handleClosePopup}
              />
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }

  renderButtons(isModal = false) {
    const { translate } = this.props;

    return (
      <React.Fragment>
        <Button
          className="timeslottab__left-button"
          onClick={() =>
            isModal
              ? this.handleClosePopup('modalOpened')
              : this.props.onBackClick()
          }
        >
          <ArrowLeft
            className="timeslottab__left-button__arrow"
            stroke="white"
            fill="white"
            width="15"
            height="15"
          />
          <span className="timeslottab__left-button__text">
            {translate('timeslot.tab.buttons.back')}
          </span>
        </Button>
        <Button
          className="timeslottab__right-button"
          disabled={!this.state.currentSlotId}
          onClick={this.handleConfirmDate}
          disabled={
            this.state.loading ||
            this.props.areShippingMethodsLoading ||
            this.state.currentSlotId === ''
          }
          loading={this.state.loading}
        >
          <span className="timeslottab__right-button__text">
            {translate('timeslot.tab.buttons.confirm_date')}
          </span>
          <DoubleArrowRight
            className="timeslottab__right-button__arrow"
            stroke="white"
            fill="white"
            width="15"
            height="15"
          />
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const {
      deliverySlots,
      shippingMethods,
      deliveryMethod,
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

    const intervalsForModal = createIntervals(shippingMethod, 7);
    const intervalsForTab = createIntervals(shippingMethod, 3);
    return (
      <div className="timeslottab-root">
        <Modal
          id="timeslottab-modal"
          open={this.state.modalOpened}
          closeOnDocumentClick
          closeOnDimmerClick
          onClose={() => this.handleClosePopup('modalOpened')}
        >
          <div className="timeslottab-modal">
            <div className="timeslottab-modal__body">
              <div className="timeslottab-modal__body-gradient" />
              <div
                className="timeslottab-modal__title"
                dangerouslySetInnerHTML={{
                  __html: slotTitle.replace('\\n', '<br />'),
                }}
              />

              {(this.props.areShippingMethodsLoading && (
                <div className="tst-loader-container">
                  <Loader active inline="centered" />
                </div>
              )) || (
                <div>
                  {(!isEmpty(shippingMethod) && (
                    <div>
                      <TimeslotDaysIntervalSwitch
                        controlled
                        activeIndex={this.state.currentIntervalIndexModal}
                        intervals={intervalsForModal}
                        onIntervalChange={this.handleIntervalChangeModal}
                      />
                      <TimeSlotGrid
                        controlled
                        active={this.state.currentSlotId}
                        headerClassName="timeslottab-modal__grid-header"
                        days={
                          intervalsForModal[
                            this.state.currentIntervalIndexModal
                          ].days
                        }
                        onChooseTime={this.handleChooseSlot}
                      />
                    </div>
                  )) || (
                    <div className="timeslottab__no-slot">
                      {this.props.translate('timeslot.noslot')}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="timeslottab-modal__footer">
              {this.renderButtons(true)}
            </div>
            <Close
              className="timeslottab-modal__close"
              width="15"
              height="15"
              onClick={() => this.handleClosePopup('modalOpened')}
            />
          </div>
        </Modal>
        <div className="timeslottab-root__gradient" />

        <div className="timeslottab-header">
          <div className="timeslottab-header__gradient" />
          <div className="timeslottab-header__text">
            {deliveryMethod === 'tops'
              ? this.props.translate('timeslot.tab.header_pickup')
              : this.props.translate('timeslot.tab.header_text')}
          </div>
          <div className="timeslottab-header__subtext">
            {deliveryMethod === 'tops'
              ? this.props.translate('timeslot.tab.sub_header_pickup')
              : this.props.translate('timeslot.tab.header_subtext')}
          </div>
        </div>

        <div className="timeslottab-upper-panel">
          <div className="timeslottab-upper-panel__upper-gradient" />
          <div className="timeslottab-upper-panel__lower-gradient" />
          <div className="timeslottab-upper-panel__icon">
            <CalendarIcon width="37" />
          </div>
          {/* @TODO */}
          <div
            className="timeslottab-upper-panel__text"
            dangerouslySetInnerHTML={{
              __html: slotTitle.replace('\\n', '<br />'),
            }}
          />
          {deliveryMethod !== 'express' ? (
            <div
              className="timeslottab-upper-panel__subtext"
              onClick={this.handleModalOpen}
            >
              {this.props.translate('timeslot.tab.upper_panel_subtext')}
            </div>
          ) : (
            <div className="method-powered-by">
              <span className="powered-by-text-grab">
                {this.props.translate('right_menu.shipping_options.powered_by')}
              </span>
              <img
                className="powered-by-icon-grab"
                src="/assets/images/Grab_logo.svg"
                alt=""
              />
            </div>
          )}
        </div>

        {(this.props.areShippingMethodsLoading && (
          <div
            className={
              isFirefox
                ? 'tst-loader-container__firefox'
                : 'tst-loader-container'
            }
          >
            <Loader active inline="centered" />
          </div>
        )) || (
          <div>
            {(!isEmpty(shippingMethod) && (
              <div>
                <TimeslotDaysIntervalSwitch
                  controlled
                  activeIndex={this.state.currentIntervalIndex}
                  intervals={intervalsForTab}
                  onIntervalChange={this.handleIntervalChange}
                />
                <TimeSlotGrid
                  controlled
                  active={this.state.currentSlotId}
                  days={intervalsForTab[this.state.currentIntervalIndex].days}
                  onChooseTime={this.handleChooseSlot}
                />
              </div>
            )) || (
              <div className="timeslottab__no-slot">
                {this.props.translate('timeslot.noslot')}
              </div>
            )}
          </div>
        )}

        {/* <div className="timeslottab-lower-panel">
          {this.props.translate('timeslot.tab.lower_panel')}
          <div className="timeslottab-lower-panel__gradient" />
        </div> */}

        <div className="timeslottab-buttons-panel">{this.renderButtons()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  areShippingMethodsLoading: state.cart.shippingMethods.isLoading,
  shippingDays: prop(
    find(state.cart.shippingMethods.data, { carrierCode: 'standard' }),
    'extensionAttributes.deliverySlot',
    [],
  ),
  translate: getTranslate(state.locale),
  isNyb: findEveryProductIsNyb(state),
  deliverySlots: findDeliverySlot(state),
  deliveryMethod: ownProps.deliveryMethod,
  shippingMethods: state.cart.shippingMethods.data,
  storeLocator: state.checkout.storeLocator.items,
  formValues: prop(state, 'form.clickCollectInfo.values', {}),
  storeLocatorSlot: state.checkout.storeLocatorSlot,
  storeLocatorSlotLoading: state.checkout.storeLocatorSlotLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addDeliverySlotInfo,
      setModalOpened,
      setModalClosed,
      setSidebar,
      getStorPickUpSlot,
    },
    dispatch,
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeSlotTab),
);
