import { breakpoint } from '@central-tech/core-ui';
import { find, get, isEmpty } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { ButtonRadio } from '@client/components/ButtonRadio';
import { createIntervals } from '@client/components/TimeSlotTab/utils';
import { TextGuide } from '@client/components/Typography';
import TimeSlotContainer from '@client/features/checkout/components/DeliveryForm/TimeSlotContainer';
import { getShippingMethod } from '@client/features/checkout/utils';
import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';
import { format } from '@client/utils/time';
const CALENDAR_ICON = '/assets/icons/calendar-icon.svg';
const GRAB_ICON = '/assets/images/Grab_logo.svg';

const Section = styled.div`
  width: 100%;
  height: auto;
  border-bottom: dashed 1px #e8e8e8;
  padding: 10px 20px;
  ${breakpoint('xs', 'md')`
    border-bottom: solid 1px #e9e9e9;
  `}
`;

const SectionTitle = styled.div`
  height: 60px;
  width: 900px;
  display: -ms-flexbox;
  display: table-cell;
  -webkit-align-items: center;
  vertical-align: middle;
  -ms-flex-align: center;
`;

const SectionTitleIcon = styled.img`
  height: 25px;
  margin: 0 0 -6px;
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

const ShippingMethod = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  border-radius: 4px;
  border: solid 1px #e8e8e8;
  background-color: #fafafa;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;

  ${breakpoint('md')`
    width: 380px;
    margin-right: 20px;

    @media (max-width: 1169px) {
      height: auto;
    }
  `}

  ${props =>
    props.active &&
    `
      background-color: rgba(128, 189, 0, 0.1);
      border: solid 1px #80bd00;
    `}
`;

const ShippingMethodDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ShippingMethodDescriptionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #2a2a2a;
  display: flex;
  align-items: center;
  height: 28px;

  ${breakpoint('md')`
    @media (max-width: 979px) {
      display: block;
      height: auto;
    }
  `}
`;

const MethodTitle = styled.span``;

const MethodPowered = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
`;

const ShippingMethodDescriptionTitleLabel = styled(TextGuide)`
  color: #666666;
  padding: 0 10px;

  ${breakpoint('md')`
    @media (max-width: 979px) {
      font-weight: bold;
      padding: 0;
    }
  `}
`;

const ShippingMethodDescriptionText = styled(TextGuide)`
  color: #666666;
`;

const GrabIcon = styled.img`
  height: 22px;
  margin-bottom: 5px;
`;

const NoSlotAvalible = styled.span`
  font-size: 18px;
  color: red;
`;

class ShippingMethodContainer extends PureComponent {
  state = {
    shippingMethod: null,
    currentSlotId: '',
  };

  componentDidUpdate(prevProps) {
    if (
      !isEmpty(this.props.shippingMethods) &&
      prevProps.shippingMethods !== this.props.shippingMethods
    ) {
      this.checkDefaultShippingMethod();
    }
  }

  componentDidMount() {
    this.checkDefaultShippingMethod();
    const slotId = `${get(
      this.props,
      'cart.extension_attributes.shipping_date',
    )}/${get(this.props, 'cart.extension_attributes.shipping_slot_id')}`;
    this.setState({ currentSlotId: slotId });
  }

  checkDefaultShippingMethod = () => {
    if (this.props.deliveryMethod === 'home_delivery') {
      const methodCode = get(
        find(this.props.shippingMethods, x => x.carrierCode === 'standard'),
        'methodCode',
        'mds',
      );
      const standard = getShippingMethod(
        this.props.shippingMethods,
        methodCode,
      );
      const express = getShippingMethod(this.props.shippingMethods, 'express');
      this.setState({
        shippingMethod: express?.nextRound
          ? express?.method?.methodCode
          : standard?.method?.methodCode,
      });
    }
  };

  handleShippingMethod = method => {
    this.setState({
      shippingMethod: method,
    });
    this.props.onShippingChange(method);
  };

  render() {
    const { shippingMethod, currentSlotId } = this.state;
    const {
      shippingAddress,
      shippingMethods,
      storeLocator,
      storeLocatorSlot,
      onChooseSlot,
      translate,
      lang,
      deliveryMethod,
      collector,
      cart,
      clearShipping,
    } = this.props;

    let shippingMethodSelected;
    if (!isEmpty(shippingMethod)) {
      shippingMethodSelected = get(
        find(shippingMethods, { methodCode: shippingMethod }),
        'extensionAttributes.deliverySlot',
        [],
      );
    } else {
      shippingMethodSelected = get(
        find(shippingMethods, { carrierCode: 'standard' }),
        'extensionAttributes.deliverySlot',
        [],
      );
    }
    // Back Up to Next Version
    // let intervals = [];
    // const defaultDays = 7;
    // if (deliveryMethod === 'click_and_collect') {
    //   intervals = createIntervals(
    //     storeLocatorSlot,
    //     storeLocatorSlot?.length > defaultDays
    //       ? storeLocatorSlot?.length
    //       : defaultDays,
    //   );
    // } else {
    //   intervals = createIntervals(
    //     shippingMethodSelected,
    //     shippingMethodSelected?.length > defaultDays ||
    //       shippingMethod === 'express'
    //       ? shippingMethodSelected?.length
    //       : defaultDays,
    //   );
    // }

    let intervals = [];
    const defaultDays = 7;
    if (deliveryMethod === 'click_and_collect') {
      // !isEmpty(storeLocatorSlot) && intervals.push({ days: storeLocatorSlot });
      intervals = createIntervals(
        storeLocatorSlot,
        storeLocatorSlot?.length > defaultDays
          ? defaultDays
          : storeLocatorSlot?.length,
      );
    } else {
      intervals = createIntervals(
        shippingMethodSelected,
        shippingMethodSelected?.length > defaultDays
          ? defaultDays
          : shippingMethodSelected?.length,
      );
    }
    let mobileIntervals = [];
    if (deliveryMethod === 'click_and_collect') {
      !isEmpty(storeLocatorSlot) &&
        mobileIntervals.push({ days: storeLocatorSlot });
    } else {
      mobileIntervals = createIntervals(
        shippingMethodSelected,
        shippingMethodSelected?.length,
      );
    }
    const methodCode = get(
      find(shippingMethods, x => x.carrierCode === 'standard'),
      'methodCode',
      'mds',
    );
    const standard = getShippingMethod(shippingMethods, methodCode);
    const express = getShippingMethod(shippingMethods, 'express');
    return (
      <React.Fragment>
        <Section>
          <SectionTitle
            data-testid={generateTestId({
              type: ELEMENT_TYPE.INFO,
              action: ELEMENT_ACTION.VIEW,
              moduleName: 'ShippingMethodContainer',
              uniqueId: 'ShippingTitle',
            })}
          >
            <TextGuide type="topic" bold>
              <SectionTitleIcon
                src={CALENDAR_ICON}
                style={{ marginRight: 10 }}
              />
              {deliveryMethod === 'home_delivery'
                ? translate(
                    'checkout_delivery.shipping_method.home_delivery.title',
                  )
                : translate(
                    'checkout_delivery.shipping_method.click_and_collect.title',
                  )}
            </TextGuide>
          </SectionTitle>
          {deliveryMethod &&
            deliveryMethod === 'home_delivery' &&
            !clearShipping && (
              <SectionContent column>
                {/* Express */}
                {!isEmpty(get(express, 'nextRound')) && (
                  <ShippingMethod
                    data-testid={generateTestId({
                      type: ELEMENT_TYPE.BUTTON,
                      action: ELEMENT_ACTION.CHANGE,
                      moduleName: 'ShippingMethodContainer',
                      uniqueId: 'SelectShippingExpress',
                    })}
                    onClick={() =>
                      this.handleShippingMethod(
                        get(express, 'method.methodCode', 'express'),
                      )
                    }
                    active={
                      shippingMethod ===
                      get(express, 'method.methodCode', 'express')
                        ? 'active'
                        : ''
                    }
                  >
                    <ButtonRadio
                      name="shippingMethod"
                      checked={
                        shippingMethod ===
                        get(express, 'method.methodCode', 'express')
                          ? 'checked'
                          : ''
                      }
                      readOnly
                    />

                    <ShippingMethodDescription>
                      <ShippingMethodDescriptionTitle>
                        <MethodTitle>
                          {translate(
                            'checkout_delivery.shipping_method.shipping_title_method.express',
                          )}
                        </MethodTitle>
                        <MethodPowered>
                          <ShippingMethodDescriptionTitleLabel type="caption-2">
                            {translate(
                              'right_menu.shipping_options.powered_by',
                            )}
                          </ShippingMethodDescriptionTitleLabel>
                          <GrabIcon src={GRAB_ICON} />
                        </MethodPowered>
                      </ShippingMethodDescriptionTitle>

                      <TextGuide color="#666666" type="caption-2">
                        {express?.slotLabel ||
                          translate(
                            'checkout_delivery.shipping_method.express.head_subtext',
                          )}
                        <br />
                        {translate(
                          'right_menu.shipping_options.next_round',
                        )}{' '}
                        {translate(
                          'right_menu.shipping_options.next_round_datetime',
                          {
                            date:
                              moment(moment(), 'YYYY-MM-DD', lang) ===
                              get(express, 'nextRound.date')
                                ? translate('timeslot.grid.today')
                                : format(
                                    get(express, 'nextRound.date'),
                                    lang === 'en_US' ? 'ddd' : 'dddd',
                                    lang,
                                  ),
                            time: `${get(
                              express,
                              'nextRound.slot.timeFrom',
                            )} - ${get(express, 'nextRound.slot.timeTo')}`,
                          },
                        )}
                        <br />
                        {translate('right_menu.shipping_options.round_cost', {
                          deliveryFee: get(express, 'nextRound.slot.cost', '-'),
                        })}
                      </TextGuide>
                    </ShippingMethodDescription>
                  </ShippingMethod>
                )}

                {/* Standard */}
                {!isEmpty(get(standard, 'nextRound')) && (
                  <ShippingMethod
                    data-testid={generateTestId({
                      type: ELEMENT_TYPE.BUTTON,
                      action: ELEMENT_ACTION.CHANGE,
                      moduleName: 'ShippingMethodContainer',
                      uniqueId: 'SelectShippingStandard',
                    })}
                    onClick={() =>
                      this.handleShippingMethod(
                        get(standard, 'method.methodCode', 'mds'),
                      )
                    }
                    active={
                      shippingMethod ===
                      get(standard, 'method.methodCode', 'mds')
                        ? 'active'
                        : ''
                    }
                  >
                    <ButtonRadio
                      name="shippingMethod"
                      checked={
                        shippingMethod ===
                        get(standard, 'method.methodCode', 'mds')
                          ? 'checked'
                          : ''
                      }
                      readOnly
                    />
                    <ShippingMethodDescription>
                      <ShippingMethodDescriptionTitle>
                        {translate(
                          'checkout_delivery.shipping_method.shipping_title_method.delivery',
                        )}
                      </ShippingMethodDescriptionTitle>
                      <ShippingMethodDescriptionText type="caption-2">
                        {standard?.slotLabel ||
                          translate(
                            'checkout_delivery.shipping_method.standard.head_subtext',
                            {
                              day: get(
                                standard,
                                'method.extensionAttributes.deliverySlot',
                                [],
                              ).length,
                            },
                          )}
                        <br />
                        {translate(
                          'right_menu.shipping_options.next_round',
                        )}{' '}
                        {translate(
                          'right_menu.shipping_options.next_round_datetime',
                          {
                            date:
                              moment(moment(), 'YYYY-MM-DD', lang) ===
                              get(standard, 'nextRound.date')
                                ? translate('timeslot.grid.today')
                                : format(
                                    get(standard, 'nextRound.date'),
                                    lang === 'en_US' ? 'ddd' : 'dddd',
                                    lang,
                                  ),
                            time: `${get(
                              standard,
                              'nextRound.slot.timeFrom',
                            )} - ${get(standard, 'nextRound.slot.timeTo')}`,
                          },
                        )}
                        <br />
                        {translate('right_menu.shipping_options.round_cost', {
                          deliveryFee: get(
                            standard,
                            'nextRound.slot.cost',
                            '-',
                          ),
                        })}
                      </ShippingMethodDescriptionText>
                    </ShippingMethodDescription>
                  </ShippingMethod>
                )}
              </SectionContent>
            )}

          {/* Delivery Time Slot */}
          <SectionContent>
            {(!isEmpty(intervals) || !isEmpty(mobileIntervals)) &&
            !clearShipping ? (
              <TimeSlotContainer
                shippingMethod={
                  deliveryMethod === 'click_and_collect'
                    ? 'tops'
                    : shippingMethod
                }
                shippingMethods={shippingMethods}
                storeLocator={storeLocator}
                collector={collector}
                slotId={currentSlotId}
                intervals={intervals}
                mobileIntervals={mobileIntervals}
                onChooseSlot={onChooseSlot}
                deliveryMethod={deliveryMethod}
                cart={cart}
              />
            ) : !isEmpty(shippingAddress) && isEmpty(intervals) ? (
              <NoSlotAvalible>
                <TextGuide type="body" color="red">
                  {translate(
                    'checkout_delivery.shipping_method.not_found_slot',
                  )}
                </TextGuide>
              </NoSlotAvalible>
            ) : (
              <NoSlotAvalible>
                <TextGuide type="body" color="red">
                  {deliveryMethod === 'click_and_collect'
                    ? translate(
                        'checkout_delivery.shipping_method.no_select_pickup',
                      )
                    : translate(
                        'checkout_delivery.shipping_method.no_select_shipping',
                      )}
                </TextGuide>
              </NoSlotAvalible>
            )}
          </SectionContent>
        </Section>
      </React.Fragment>
    );
  }
}
const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  lang: get(
    find(state.locale.languages, lang => lang.active === true),
    'code',
    'th_TH',
  ),
  clearShipping: state.customer.clearShipping,
});

export default withLocales(connect(mapStateToProps)(ShippingMethodContainer));
