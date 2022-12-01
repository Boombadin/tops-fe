import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { getTranslate } from 'react-localize-redux';
import { isMobile } from 'react-device-detect';
import { find, isEmpty, filter, reduce, cloneDeep, omit } from 'lodash';
import { Button, Icon, Segment, Header, Container, Image, Loader } from '../../../magenta-ui';
import { addAddress, editAddress } from '../../../reducers/customer';
import { fetchProvince, fetchDistrict, fetchSubDistrict } from '../../../reducers/region';
import { requiredFields } from '../../../constants/billingAddress';
import { createCustomAttributes } from '../../../utils/api';
import { getBillingAddressesSelector } from '../../../selectors';
import BillingForm from './BillingForm';
import './AddressForm.scss';

class AddEditBillingAddress extends PureComponent {
  static propTypes = {
    provinces: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    addAddress: PropTypes.func.isRequired,
    editAddress: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
    onVerifyAddressClick: PropTypes.func.isRequired,
    edit: PropTypes.bool,
    initializeForm: PropTypes.func.isRequired,
    fetchProvince: PropTypes.func.isRequired,
    billingAddresses: PropTypes.array.isRequired,
    address: PropTypes.object,
  };

  static defaultProps = {
    edit: false,
    requestsPending: false,
  };

  state = {
    errors: {},
  };

  componentWillMount() {
    this.props.fetchProvince();

    let values = {};

    if (!this.props.edit) {
      values.isPersonal = true;

      return this.props.initializeForm(values);
    }

    const { address } = this.props;

    if (address.region_id) {
      this.props.fetchDistrict(address.region_id);

      if (address.district_id) {
        this.props.fetchSubDistrict(address.region_id, address.district_id);
      }
    }

    values = cloneDeep(address);
    values.isPersonal = !(
      address.firstname === 'N/A' &&
      address.lastname === 'N/A' &&
      address.campany !== ''
    );
    values.isCompany =
      address.firstname === 'N/A' && address.lastname === 'N/A' && address.campany !== '';

    if (values.isCompany) {
      values.firstname = '';
      values.lastname = '';
    }

    return this.props.initializeForm(values);
  }

  handleVerifyAddress = async () => {
    const { provinces, form, billingAddresses } = this.props;
    let { values = {} } = form;
    let ownerType;

    this.setState({ requestsPending: true });

    if (values.isCompany) {
      ownerType = 'company';
    } else {
      ownerType = 'personal';
    }

    const emptyRequiredFields = filter(requiredFields[ownerType], field => !values[field]);

    if (!isEmpty(emptyRequiredFields)) {
      this.setState({ requestsPending: false });
      return this.setState(
        {
          focusedField: emptyRequiredFields[0],
          errors: reduce(
            emptyRequiredFields,
            (memo, field) => ({ ...memo, [field]: true }),
            {},
          ),
        },
        () => {
          this.setState({ focusedField: null });
        },
      );
    }

    if (values.region_id) {
      values.region_id = String(values.region_id);
      const region = find(provinces, province => province.region_id === values.region_id);

      values.countryId = region.country_id;
    }

    values = reduce(
      values,
      (memo, val, key) => ({
        ...memo,
        [key]: typeof val === 'number' ? String(val) : val,
      }),
      {},
    );

    values.customer_address_type = 'billing';

    if (isEmpty(billingAddresses)) {
      values.default_billing = true;
    }

    if (values.isPersonal) {
      values = omit(values, 'company');
    } else if (values.isCompany) {
      values.firstname = 'N/A';
      values.lastname = 'N/A';
    }

    if (this.props.edit) {
      await this.props.editAddress(values);
    } else {
      await this.props.addAddress(values);
    }
    this.setState({ requestsPending: false });
    this.props.onBackClick();
  };

  onRef = ref => (this.form = ref);

  renderHeader() {
    const { edit, translate } = this.props;

    return (
      <Segment className="header-wrapper">
        <Container fluid>
          <Header as="h4" className="text" handleToHome={() => this.props.history.push('/')}>
            {edit
              ? translate('right_menu.profile.billing.header_edit')
              : translate('right_menu.profile.billing.header_add_new')}
          </Header>
          <div className="info">
            {this.props.translate('right_menu.profile.billing.fill_new')}
          </div>
        </Container>
      </Segment>
    );
  }

  renderBody() {
    return (
      <div key="body" className="body">
        <BillingForm
          onRef={this.onRef}
          focusedField={this.state.focusedField}
          errors={this.state.errors}
        />
      </div>
    );
  }

  renderBottom() {
    return (
      <div key="bottom" className="bottom">
        <Button className="back" icon onClick={this.props.onBackClick}>
          <Icon className="chevron left" />
          {this.props.translate('right_menu.profile.billing.back')}
        </Button>
        <Button className="verify" onClick={this.handleVerifyAddress}>
          <span className="text">
            {this.props.translate('right_menu.profile.billing.verify_invoice')}
          </span>
          <Image className="icon-back" src="/assets/icons/shape.png" />
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className="billing-address-form">
        {!isMobile && this.renderHeader()}
        {this.renderBody()}
        {this.renderBottom()}
        {this.state.requestsPending && <div className="billing-options-tab-mask" />}
        <Loader
          className="billing-options-tab-loader"
          active={this.state.requestsPending}
          size="large"
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  billingAddresses: getBillingAddressesSelector(state),
  form: state.form.billing_address,
  translate: getTranslate(state.locale),
  provinces: state.region.provinces,
});

const mapDispatchToProps = dispatch => ({
  fetchProvince: () => dispatch(fetchProvince(false)),
  addAddress: address => dispatch(addAddress(address, 'billing')),
  editAddress: address => dispatch(editAddress(address, 'billing')),
  initializeForm: values => dispatch(initialize('billing_address', values)),
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId, false)),
  fetchSubDistrict: (regionId, disctrictId) =>
    dispatch(fetchSubDistrict(regionId, disctrictId, false)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddEditBillingAddress);
