import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Margin, breakpoint, HideDesktop, HideMobile } from '@central-tech/core-ui';
import styled, { css } from 'styled-components';
import pt from 'prop-types';
import AddressContainer from './AddressContainer';
import { ButtonRadio } from '../../../../components/ButtonRadio';
import { get, find, isEmpty } from 'lodash';
import TimeSlotTab from '../../../../components/TimeSlotTab';
import TimeslotDaysIntervalSwitch from '../../../../components/TimeslotDaysIntervalSwitch';
import TimeslotGrid from '../../../../components/TimeslotGrid';
import { createIntervals } from '../../../../components/TimeSlotTab/utils';
import DeliveryTabs from './DeliveryTabs';
import TimeSlotMobile from '../../../../components/TimeSlotMobile';
import { getShippingMethod } from '../../utils';
import { format } from '../../../../utils/time';
import AddressForm from '../../../address/AddressForm';
import AddressListItem from '../../../address/components/AddressListItem';
import AddressList from '../../../address/AddressList';
import AddAddressButton from '../../../address/components/AddAddressButton';
import HomeDelivery from './HomeDelivery';
import withLocales from '../../../../hoc/withLocales';
import { getWishlistItemsWithProducts } from '../../../../reducers/wishlist/selectors';

const MAP_ICON = '/assets/icons/map-icon.svg';
const DOC_ICON = '/assets/icons/document-icon.svg';
const CALENDAR_ICON = '/assets/icons/calendar-icon.svg';
const GRAB_ICON = '/assets/images/Grab_logo.svg';

const Section = styled.div`
  width: 100%;
  height: auto;
  border-bottom: dashed 1px #e8e8e8;
  padding: 20px;
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

const SectionTitleText = styled.span`
  padding: 10px 0 0px 10px;
  color: #2a2a2a;
  font-size: 15px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0.6px;
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

class TaxContainer extends PureComponent {

    state = {
        isRequestTax: false
    };

    handleRequestTax = (isRequestTax) => {
        this.setState({
            isRequestTax: isRequestTax
        });
        this.props.onChange(isRequestTax);
    };

    render() {
        const { billingAddress, deliveryMethod, translate } = this.props;
        return (
            <React.Fragment>
                <Section>
                    <SectionTitle>
                        <SectionTitleIcon src={DOC_ICON} />
                        <SectionTitleText>{translate('checkout_delivery.tax.title')}* </SectionTitleText>
                        <AddAddressButton floatRight={true} text="Create tax invoice address" />
                    </SectionTitle>
                    <SectionContent inline>
                        <ButtonRadio
                            name="requestTax"
                            label={`${translate('checkout_delivery.tax.request')}`}
                            onChange={() => this.handleRequestTax(true)}
                        />
                        <ButtonRadio
                            name="requestTax"
                            label={`${translate('checkout_delivery.tax.no_request')}`}
                            onChange={() => this.handleRequestTax(false)}
                        />
                    </SectionContent>

                    {this.state.isRequestTax && (
                        <SectionContent>
                            <Margin md="10px 0 0 0" />
                            {/* <AddressContainer
                                addressType={`billing`}
                                deliveryMethod={deliveryMethod}
                                line1={get(billingAddress, 'billing.village')}
                                line2={`ที่อยู่: ${get(billingAddress, 'group_address')}`}
                                line3={`เบอร์โทรศัพท์: ${get(billingAddress, 'billing.contact_number')}`}
                                translate={translate}
                            /> */}
                        </SectionContent>
                    )}
                    </Section>
                </React.Fragment>
        );
    };
};

export default withLocales(TaxContainer);