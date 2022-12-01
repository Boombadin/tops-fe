import {
  breakpoint,
  Button,
  FullScreenLoading,
  Margin,
  Modal,
} from '@central-tech/core-ui';
import { find, first, get, isEmpty, last, split } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import TimeslotGrid from '../../../../components/TimeslotGrid';
import TimeSlotMobile from '../../../../components/TimeSlotMobile';
import withLocales from '../../../../hoc/withLocales';
import {
  addDeliverySlotInfo,
  deleteDeliverySlot,
  validateDeliverySlot,
} from '../../../../reducers/checkout';
import { clearCurrentShippingAddress } from '../../../../reducers/customer';

const Show = styled.div`
  display: none;
  ${props => breakpoint(props.from, props.to)`
    display: block;
  `}
`;

const Section = styled.div`
  width: 100%;
  height: auto;
  padding: 20px 0 0 0;
`;

const SectionContent = styled.div`
  width: 100%;
  height: auto;

  ${props => props.padding && `padding: ${props.padding};`}
  
  ${props =>
    props.inline &&
    `
      display: flex;
    `}
  ${props =>
    props.column &&
    css`
      display: flex;
      flex-direction: column;
      ${breakpoint('md')`
        flex-direction: row;
      `}
    `}
`;

const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  min-height: 180px;
  border-radius: 5px;
  padding: 19px 30px 20px 40px;
  text-align: center;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
  ${breakpoint('xs', 'md')`
    width: 90%;
    min-height: 250px;
  `}
`;

const ModalContentText = styled.div``;

@withLocales
class TimeSlotContainer extends React.Component {
  state = {
    currentIntervalIndex: 0,
    currentSlotId: '',
    loading: false,
    modalErrorOpened: false,
    modalErrorMessage: '',
  };

  handleChooseSlot = slotId => {
    if (!this.state.loading) {
      this.setState({ currentSlotId: slotId });
      this.setDeliverySlotInfo(slotId);
    }
  };

  setDeliverySlotInfo = async slotId => {
    const {
      shippingMethod,
      collector,
      storeLocator,
      deliveryMethod,
      translate,
    } = this.props;
    this.setState({ loading: true });

    try {
      if (
        deliveryMethod === 'click_and_collect' &&
        (isEmpty(get(collector, 'receiver_name', '')) ||
          isEmpty(get(collector, 'receiver_phone')))
      ) {
        alert(translate('timeslot.check_collecter'));
        this.setState({ loading: false, currentSlotId: '' });
        return;
      }

      const response = await this.props.addDeliverySlotInfo(
        slotId,
        shippingMethod,
        collector,
        storeLocator,
      );

      this.setState({ loading: false });

      if (get(response, 'data.code', '') === 409) {
        this.setState({
          currentSlotId: '',
          modalErrorOpened: true,
          modalErrorMessage: get(response, 'data.message', ''),
        });
      } else if (response.data.message) {
        alert('ไม่สามารถจัดส่งเวลานี้ได้');
        this.setState({ currentSlotId: '' });
      }
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { shippingMethod, collector, intervals } = this.props;
    if (
      shippingMethod !== nextProps.shippingMethod ||
      intervals !== nextProps.intervals
    ) {
      return true;
    }
    if (collector !== nextProps.collector) {
      return true;
    }
    if (this.state.loading !== nextState.loading) {
      return true;
    }
    if (this.state.currentSlotId !== nextState.currentSlotId) {
      return true;
    }
    if (this.state.currentIntervalIndex !== nextState.currentIntervalIndex) {
      return true;
    }
    return false;
  }

  isSlotActive = (slotId, intervals, idx = 0) => {
    const { cart } = this.props;
    const currentSlotId = last(split(slotId, '/'));
    const currentSlotDate = first(split(slotId, '/'));
    const currentSlot = find(
      get(
        find(
          get(intervals[idx], 'days', []),
          interval => interval.date === currentSlotDate,
        ),
        'slots',
        [],
      ),
      slot => slot.id == currentSlotId,
    );

    if (
      currentSlot &&
      currentSlot.enabled &&
      currentSlot.isAllow &&
      get(cart, 'extension_attributes.shipping_slot_id', 0) == currentSlot.id
    ) {
      return true;
    }

    return false;
  };

  handleCloseModalError = () => {
    this.props.clearCurrentShippingAddress();

    this.setState({
      modalErrorOpened: false,
      modalErrorMessage: '',
    });
  };
  handleIntervalChange = idx => {
    this.setState({ currentIntervalIndex: idx });
  };

  render() {
    const {
      currentSlotId,
      loading,
      modalErrorOpened,
      modalErrorMessage,
    } = this.state;
    const { mobileIntervals, intervals, translate } = this.props;
    const activeIndex = !isEmpty(intervals[this.state.currentIntervalIndex])
      ? this.state.currentIntervalIndex
      : 0;
    return (
      <React.Fragment>
        <Section>
          <SectionContent>
            <Show from="md">
              {!isEmpty(intervals) && (
                <div>
                  <TimeslotGrid
                    headerClassName="custom-timeslot-head"
                    headerCellClassName="custom-timeslot-header__cell"
                    headerCellFatClassName="custom-timeslot-header__cell-fat"
                    headerCellNormalClassName="custom-timeslot-header__cell-normal"
                    intervalClassName="custom-timeslot-interval"
                    intervalNameClassName="custom-timeslot-interval__name"
                    intervalCellClassName="custom-timeslot-interval-cell"
                    intervalCellActiveClassName="custom-timeslot-interval-cell__active"
                    intervalCellCheckMarkClassName="custom-timeslot-interval-cell__check-mark"
                    controlled
                    active={
                      this.isSlotActive(currentSlotId, intervals, activeIndex)
                        ? currentSlotId
                        : null
                    }
                    days={intervals[activeIndex].days}
                    onChooseTime={this.handleChooseSlot}
                    activeIndex={activeIndex}
                    onIntervalChange={this.handleIntervalChange}
                    intervalsAll={intervals}
                  />
                </div>
              )}
            </Show>

            <Show from="xs" to="md">
              {!isEmpty(mobileIntervals) && (
                <TimeSlotMobile
                  translate={this.props.translate}
                  controlled
                  active={
                    this.isSlotActive(currentSlotId, mobileIntervals, 0)
                      ? currentSlotId
                      : null
                  }
                  days={mobileIntervals[0].days}
                  onChooseTime={this.handleChooseSlot}
                />
              )}
            </Show>
          </SectionContent>
        </Section>

        <Modal
          visible={modalErrorOpened}
          onModalClose={() => this.handleCloseModalError()}
        >
          <ModalContent>
            <ModalContentText>
              {modalErrorMessage}
              <Margin xs="20px 0 0">
                <Modal.Close>
                  <Button height={30} size={13} radius="4px" color="danger">
                    {translate('common.ok')}
                  </Button>
                </Modal.Close>
              </Margin>
            </ModalContentText>
          </ModalContent>
        </Modal>

        {loading && (
          <FullScreenLoading
            icon="/assets/icons/loader-2.gif"
            width="100px"
            height="auto"
          />
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addDeliverySlotInfo: (slotId, shippingMethod, collector, storeLocator) =>
    dispatch(
      addDeliverySlotInfo(slotId, shippingMethod, collector, storeLocator),
    ),
  validateDeliverySlot: (date, slotId, useQuotaAvailable) =>
    dispatch(validateDeliverySlot(date, slotId, useQuotaAvailable)),
  deleteDeliverySlot: cartId => dispatch(deleteDeliverySlot(cartId)),
  clearCurrentShippingAddress: () => dispatch(clearCurrentShippingAddress()),
});

export default withRouter(
  withLocales(connect(null, mapDispatchToProps)(TimeSlotContainer)),
);
