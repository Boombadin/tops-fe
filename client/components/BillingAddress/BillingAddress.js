import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';
import { getTranslate } from 'react-localize-redux';
import { Field, reduxForm, change, initialize } from 'redux-form';
import { map, get as prop, filter, uniqBy } from 'lodash';
import { Checkbox, Radio } from 'semantic-ui-redux-form-fields';
import {
  fetchDistrict,
  fetchSubDistrict,
  fetchProvince,
  fetchDistrictFail,
  fetchSubDistrictFail,
} from '../../reducers/region';
import { getCustomerSelector } from '../../selectors';
import './BillingAddress.scss';
import { Form, Accordion, Icon, Image } from '../../magenta-ui';

const initialValues = {
  bl_need_fulltax: false,
  bl_billing: false,
  bl_name: '',
  bl_lastname: '',
  bl_company: '',
  bl_village_name: '',
  bl_idcard: '',
  bl_address: '',
  bl_street: '',
  bl_sub_district_id: '',
  bl_sub_district: '',
  bl_district_id: '',
  bl_district: '',
  bl_province_id: '',
  bl_province_code: '',
  bl_province: '',
  bl_postcode: '',
  bl_save_billing_address: false,
};

const validate = values => {
  const errors = {};
  if (values.bl_need_fulltax && !values.bl_billing) {
    if (values.bl_type_tax === 'customer') {
      if (!values.bl_name) {
        errors.bl_name = 'errors.billing_form.first_name';
      }
      if (!values.bl_lastname) {
        errors.bl_lastname = 'errors.billing_form.last_name';
      }
    }
    if (values.bl_type_tax === 'company') {
      if (!values.bl_company) {
        errors.bl_company = 'errors.billing_form.company_name';
      }
    }
    if (!values.bl_idcard) {
      errors.bl_idcard = 'errors.billing_form.id_card';
    }
    if (!values.bl_address) {
      errors.bl_address = 'errors.billing_form.address';
    }
    if (!values.bl_sub_district_id) {
      errors.bl_sub_district_id = 'errors.billing_form.sub_district';
    }
    if (!values.bl_district_id) {
      errors.bl_district_id = 'errors.billing_form.district';
    }
    if (!values.bl_province_id) {
      errors.bl_province_id = 'errors.billing_form.province';
    }
    if (!values.bl_postcode) {
      errors.bl_postcode = 'errors.billing_form.postcode';
    }
  }
  return errors;
};

const renderField = ({
  id,
  msgError,
  className,
  input,
  label,
  type,
  isRequired,
  maxLength,
  values,
  meta: { touched, error, warning },
}) => {
  return (
    <div className={className}>
      {id === 'taxName' || id === 'taxLastname' || id === 'idCard' ? (
        <input
          className={`input-wrap ${touched && error ? 'input-error' : ''}`}
          id={label}
          {...input}
          placeholder={label}
          type={type}
          maxLength={maxLength}
          value={values}
        />
      ) : (
        <input
          className={`input-wrap ${touched && error ? 'input-error' : ''}`}
          id={label}
          {...input}
          placeholder={label}
          type={type}
          maxLength={maxLength}
        />
      )}

      <label className="label-wrap" htmlFor={label}>
        {label}
        {isRequired ? <span className="lb-error">{isRequired}</span> : ''}
      </label>
      {touched &&
        ((error && <span className="error">{msgError(error)}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  );
};

const renderFieldSelect = ({
  className,
  input,
  label,
  options,
  msgError,
  isRequired,
  meta: { touched, error, warning },
}) => (
  <div className={className}>
    <select
      id={label}
      className={`input-wrap ${input.value === '' ? 'placeholdered' : ''} ${
        touched && error ? 'input-error' : ''
      }`}
      {...input}
    >
      <option value="" disabled selected />
      {options.map(option => {
        return <option value={option.value}>{option.text}</option>;
      })}
    </select>

    <label className="label-wrap" htmlFor={label}>
      {label}
      {isRequired ? <span className="lb-error">{isRequired}</span> : ''}
    </label>

    {touched &&
      ((error && <span className="error">{msgError(error)}</span>) ||
        (warning && <span>{warning}</span>))}
  </div>
);

class BillingAddress extends Component {
  state = {
    activeIndex: 0,
    isCompany: false,
    isCustomer: true,
    isNeedBilling: false,
    isNewBilling: false,
    isSameBilling: false,
    billingId: '',
    idCard: '',
    taxName: '',
    taxLastname: '',
    isSaveBilling: false,
  };

  static defaultProps = {
    cart: {},
    className: '',
    customer: {},
  };

  static propTypes = {
    translate: PropTypes.func.isRequired,
    cart: PropTypes.object,
    customer: PropTypes.object,
  };

  componentDidMount() {
    this.props.fetchProvince();
    this.props.fetchDistrict();
    this.props.fetchSubDistrict();
    const userToken = Cookie.get('user_token') || '';
  }

  handleKeyPress = (e, stateName) => {
    const validate =
      /^[A-Za-zก-๙\-\.\s]+$/g.test(e.target.value) || e.target.value === '';
    if (validate) {
      this.setState({
        [stateName]: e.target.value,
      });
    }
  };

  handleNumericKeyPress = e => {
    const validate =
      /^[0-9a-zA-Z\s]+$/g.test(e.target.value) || e.target.value === '';
    if (validate) {
      this.setState({
        idCard: e.target.value,
      });
    }
  };

  handleTypeCustomer = () => {
    this.setState({
      isCustomer: true,
      isCompany: false,
    });
    this.props.changeFieldValue('bl_type_tax', 'customer');
  };

  handleTypeCompany = () => {
    this.setState({
      isCustomer: false,
      isCompany: true,
    });
    this.props.changeFieldValue('bl_type_tax', 'company');
  };

  handleClickNeedBilling = () => {
    this.setState({
      isNeedBilling: !this.state.isNeedBilling,
    });
    if (!this.state.isNeedBilling) {
      this.handleDefaultBilling();
    } else {
      this.props.changeFieldValue('bl_billing', false);
      this.props.changeFieldValue('bl_address', '');
      this.props.changeFieldValue('bl_name', '');
      this.props.changeFieldValue('bl_lastname', '');
      this.props.changeFieldValue('bl_idcard', '');
      this.props.changeFieldValue('bl_village_name', '');
      this.props.changeFieldValue('bl_moo', '');
      this.props.changeFieldValue('bl_soi', '');
      this.props.changeFieldValue('bl_street', '');
      this.props.changeFieldValue('bl_province', '');
      this.props.changeFieldValue('bl_province_code', '');
      this.props.changeFieldValue('bl_province_id', '');
      this.props.changeFieldValue('bl_district_id', '');
      this.props.changeFieldValue('bl_district', '');
      this.props.changeFieldValue('bl_sub_district_id', '');
      this.props.changeFieldValue('bl_sub_district', '');
      this.props.changeFieldValue('bl_postcode', '');
      this.props.changeFieldValue('bl_company', '');
      this.props.changeFieldValue('bl_same_address', false);
      this.props.changeFieldValue('bl_save_billing_address', false);
      this.props.changeFieldValue('bl_type_tax', '');
      this.setState({
        isNewBilling: false,
      });
    }
  };

  handleClickNewBilling = () => {
    this.setState({
      isNewBilling: !this.state.isNewBilling,
      isSameBilling: false,
      billingId: '',
      isSaveBilling: false,
    });
    if (!this.state.isNewBilling) {
      this.props.changeFieldValue('bl_billing', false);
      this.props.changeFieldValue('bl_address', '');
      this.props.changeFieldValue('bl_name', '');
      this.props.changeFieldValue('bl_lastname', '');
      this.props.changeFieldValue('bl_company', '');
      this.props.changeFieldValue('bl_idcard', '');
      this.props.changeFieldValue('bl_village_name', '');
      this.props.changeFieldValue('bl_moo', '');
      this.props.changeFieldValue('bl_soi', '');
      this.props.changeFieldValue('bl_street', '');
      this.props.changeFieldValue('bl_province', '');
      this.props.changeFieldValue('bl_province_code', '');
      this.props.changeFieldValue('bl_province_id', '');
      this.props.changeFieldValue('bl_district_id', '');
      this.props.changeFieldValue('bl_district', '');
      this.props.changeFieldValue('bl_sub_district_id', '');
      this.props.changeFieldValue('bl_sub_district', '');
      this.props.changeFieldValue('bl_postcode', '');
      this.props.changeFieldValue('bl_same_address', false);
      this.props.changeFieldValue('bl_save_billing_address', false);
      this.props.changeFieldValue('bl_type_tax', 'customer');
    } else {
      this.handleDefaultBilling();
    }
  };

  handleClickSameAddress = () => {
    const { cart } = this.props;
    let address = {};
    let houseNo = '';
    let subdistrict = '';
    let subdistrictId = '';
    let district = '';
    let districtId = '';
    let road = '';
    let villageName = '';
    let moo = '';
    let soi = '';
    let postcode = '';
    let province = '';
    let provinceCode = '';
    let provinceId = '';

    if (!this.state.isSameBilling) {
      if (cart.extension_attributes.shipping_assignments.length > 0) {
        address =
          cart.extension_attributes.shipping_assignments[0].shipping.address;
      }

      if (address.custom_attributes) {
        provinceId = prop(address, 'region_id', '');
        provinceCode = prop(address, 'region_code', '');
        province = prop(address, 'region', '');
        postcode = prop(address, 'postcode', '');

        address.custom_attributes.map(resp => {
          if (resp.name === 'house_no' && resp.value !== '') {
            houseNo = resp.value;
          }
          if (resp.name === 'village_name' && resp.value !== '') {
            villageName = resp.value;
          }
          if (resp.name === 'moo' && resp.value !== '') {
            moo = resp.value;
          }
          if (resp.name === 'soi' && resp.value !== '') {
            soi = resp.value;
          }
          if (resp.name === 'road' && resp.value !== '') {
            road = resp.value;
          }
          if (resp.name === 'district' && resp.value !== '') {
            district = resp.value;
          }
          if (resp.name === 'district_id' && resp.value !== '') {
            districtId = resp.value;
          }
          if (resp.name === 'subdistrict' && resp.value !== '') {
            subdistrict = resp.value;
          }
          if (resp.name === 'subdistrict_id' && resp.value !== '') {
            subdistrictId = resp.value;
          }
        });
      }
    }

    this.props.fetchDistrict(address.region_id);
    this.props.clearDistricts();
    this.props.fetchSubDistrict(address.region_id, districtId);
    this.props.clearSubdistricts();

    this.props.setParams('bl_address', houseNo);
    this.props.setParams('bl_village_name', villageName);
    this.props.setParams('bl_moo', moo);
    this.props.setParams('bl_soi', soi);
    this.props.setParams('bl_street', road);
    this.props.setParams('bl_district_id', districtId);
    this.props.setParams('bl_district', district);
    this.props.setParams('bl_sub_district_id', subdistrictId);
    this.props.setParams('bl_sub_district', subdistrict);
    this.props.setParams('bl_province_id', provinceId);
    this.props.setParams('bl_province_code', provinceCode);
    this.props.setParams('bl_province', province);
    this.props.setParams('bl_postcode', postcode);

    this.regionId = provinceId;
    this.districtId = districtId;
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  handleRegionChange = (event, regionId) => {
    const { provinces } = this.props;
    const filterProvince = filter(provinces, data => {
      return data.region_id.toString() === regionId;
    });

    if (!regionId) {
      return;
    }

    this.regionId = regionId;

    this.props.initializeForm({
      ...this.props.formValues,
      district_id: undefined,
      subdistrict_id: undefined,
      postcode: undefined,
    });

    if (filterProvince.length > 0) {
      this.props.changeFieldValue(
        'bl_province_id',
        filterProvince[0].region_id,
      );
      this.props.changeFieldValue('bl_province_code', filterProvince[0].code);
      this.props.changeFieldValue(
        'bl_province',
        filterProvince[0].default_name,
      );
    }

    this.props.clearDistricts();
    this.props.fetchDistrict(regionId).then(() => {
      if (this.props.districts.length > 0) {
        this.props.changeFieldValue('bl_district_id', '');
        this.props.changeFieldValue('bl_district', '');
        this.props
          .fetchSubDistrict(regionId, this.props.districts[0].district_id)
          .then(() => {
            if (this.props.subdistricts.length > 0) {
              this.props.changeFieldValue('bl_sub_district_id', '');
              this.props.changeFieldValue('bl_sub_district', '');
              this.props.changeFieldValue('bl_postcode', '');
            }
          });
      }
    });
  };

  handleDistrictChange = (event, districtId) => {
    const { districts } = this.props;
    const filterDistrict = filter(districts, data => {
      return data.district_id.toString() === districtId;
    });

    if (!this.regionId || !districtId) {
      return;
    }

    this.districtId = districtId;
    this.props.initializeForm({
      ...this.props.formValues,
      subdistrict_id: undefined,
      postcode: undefined,
    });

    if (filterDistrict.length > 0) {
      this.props.changeFieldValue(
        'bl_district_id',
        filterDistrict[0].district_id,
      );
      this.props.changeFieldValue(
        'bl_district',
        filterDistrict[0].default_name,
      );
    }

    this.props.clearSubdistricts();
    this.props.fetchSubDistrict(this.regionId, districtId).then(() => {
      if (this.props.subdistricts.length > 0) {
        this.props.changeFieldValue('bl_sub_district_id', '');
        this.props.changeFieldValue('bl_sub_district', '');
        this.props.changeFieldValue('bl_postcode', '');

        this.props.initializeForm({
          ...this.props.formValues,
          subdistrict_id: this.props.subdistricts[0].subdistrict_id,
          postcode: this.props.subdistricts[0].zip_code,
        });
      }
    });
  };

  handleSubdistrictChange = (event, subdistrictId) => {
    const { subdistricts } = this.props;
    const filterSubdistrict = filter(subdistricts, data => {
      return data.subdistrict_id.toString() === subdistrictId;
    });

    this.props.initializeForm({
      ...this.props.formValues,
      postcode: undefined,
    });

    if (filterSubdistrict.length > 0) {
      this.props.changeFieldValue(
        'bl_sub_district_id',
        filterSubdistrict[0].subdistrict_id,
      );
      this.props.changeFieldValue(
        'bl_sub_district',
        filterSubdistrict[0].default_name,
      );
      this.props.changeFieldValue('bl_postcode', '');
    }
  };

  handleDefaultBilling() {
    const { customer } = this.props;
    let billing = {};
    billing = filter(customer.addresses, data => {
      return data.customer_address_type === 'billing';
    });

    if (billing.length > 0) {
      billing.map(item => {
        if (this.state.billingId === '' && item.default_billing) {
          this.props.changeFieldValue('bl_billing', true);
          this.props.changeFieldValue('bl_address', item.house_no || '');
          this.props.changeFieldValue('bl_name', item.firstname || 'N/A');
          this.props.changeFieldValue('bl_lastname', item.lastname || 'N/A');
          this.props.changeFieldValue('bl_idcard', item.vat_id || '');
          this.props.changeFieldValue(
            'bl_village_name',
            item.village_name || '',
          );
          this.props.changeFieldValue('bl_moo', item.moo || '');
          this.props.changeFieldValue('bl_soi', item.soi || '');
          this.props.changeFieldValue('bl_street', item.road || '');
          this.props.changeFieldValue('bl_province', item.region.region || '');
          this.props.changeFieldValue(
            'bl_province_code',
            item.region.region_code || '',
          );
          this.props.changeFieldValue(
            'bl_province_id',
            item.region.region_id || '',
          );
          this.props.changeFieldValue('bl_district_id', item.district_id || '');
          this.props.changeFieldValue('bl_district', item.district || '');
          this.props.changeFieldValue(
            'bl_sub_district_id',
            item.subdistrict_id || '',
          );
          this.props.changeFieldValue(
            'bl_sub_district',
            item.subdistrict || '',
          );
          this.props.changeFieldValue('bl_postcode', item.postcode || '');
          this.props.changeFieldValue('bl_company', item.company || '');
          this.props.changeFieldValue('bl_save_billing_address', false);
        }
      });
    } else {
      this.props.changeFieldValue('bl_type_tax', 'customer');
    }
  }

  renderStoreBilling() {
    const { customer } = this.props;

    let billing = {};
    billing = filter(customer.addresses, data => {
      return data.customer_address_type === 'billing';
    });

    if (billing.length > 0) {
      return billing.map(item => {
        return (
          <Field
            className=""
            name="bl_billing"
            component={Radio}
            type="radio"
            onChange={() => {
              this.props.changeFieldValue('bl_address', item.house_no || '');
              this.props.changeFieldValue('bl_name', item.firstname || 'N/A');
              this.props.changeFieldValue(
                'bl_lastname',
                item.lastname || 'N/A',
              );
              this.props.changeFieldValue('bl_idcard', item.vat_id || '');
              this.props.changeFieldValue(
                'bl_village_name',
                item.village_name || '',
              );
              this.props.changeFieldValue('bl_moo', item.moo || '');
              this.props.changeFieldValue('bl_soi', item.soi || '');
              this.props.changeFieldValue('bl_street', item.road || '');
              this.props.changeFieldValue(
                'bl_province',
                item.region.region || '',
              );
              this.props.changeFieldValue(
                'bl_province_code',
                item.region.region_code || '',
              );
              this.props.changeFieldValue(
                'bl_province_id',
                item.region.region_id || '',
              );
              this.props.changeFieldValue(
                'bl_district_id',
                item.district_id || '',
              );
              this.props.changeFieldValue('bl_district', item.district || '');
              this.props.changeFieldValue(
                'bl_sub_district_id',
                item.subdistrict_id || '',
              );
              this.props.changeFieldValue(
                'bl_sub_district',
                item.subdistrict || '',
              );
              this.props.changeFieldValue('bl_postcode', item.postcode || '');
              this.props.changeFieldValue('bl_company', item.company || '');
              this.props.changeFieldValue('bl_save_billing_address', false);

              this.setState({
                billingId: item.id,
                isNewBilling: false,
                isSaveBilling: false,
              });
            }}
            checked={
              (item.id === this.state.billingId ||
                (this.state.billingId === '' && item.default_billing)) &&
              !this.state.isNewBilling
            }
            label={
              item.firstname === 'N/A' &&
              item.lastname === 'N/A' &&
              item.campany !== ''
                ? item.company
                : `${item.firstname} ${item.lastname}`
            }
          />
        );
      });
    }
  }

  renderFormFields() {
    const { provinces, districts, subdistricts, focusedField } = this.props;

    const isCustomer = this.state.isCustomer ? '' : 'hidden';
    const isCompany = this.state.isCompany ? '' : 'hidden';

    const regionOptions = map(provinces, province => ({
      value: province.region_id,
      text: province.name,
    }));
    const districtOptions = map(districts, district => ({
      value: district.district_id,
      text: district.name,
    }));

    const subdistrictOptions = map(
      uniqBy(subdistricts, 'subdistrict_id'),
      subdistrict => ({
        value: subdistrict.subdistrict_id,
        text: subdistrict.name,
      }),
    );

    const zipcodeOptions = map(
      uniqBy(subdistricts, 'zip_code'),
      subdistrict => ({
        value: subdistrict.zip_code,
        text: subdistrict.zip_code,
      }),
    );

    return (
      <div key="form-group-fulltax">
        <div className={`${isCustomer}`}>
          <Form.Group
            widths="equal"
            key="form-group-personal"
            className="form-group-personal"
          >
            <Field
              id="taxName"
              className="field"
              name="bl_name"
              component={renderField}
              placeholder={this.props.translate('billing_address.first_name')}
              label={this.props.translate('billing_address.first_name')}
              values={this.state.taxName}
              onChange={e => this.handleKeyPress(e, 'taxName')}
              msgError={this.props.translate}
              isRequired="*"
            />
            <Field
              id="taxLastname"
              className="field"
              name="bl_lastname"
              component={renderField}
              placeholder={this.props.translate('billing_address.last_name')}
              label={this.props.translate('billing_address.last_name')}
              onChange={e => this.handleKeyPress(e, 'taxLastname')}
              values={this.state.taxLastname}
              msgError={this.props.translate}
              isRequired="*"
            />
          </Form.Group>
        </div>
        <Form.Group
          widths="equal"
          key="form-group-company"
          className="form-group-personal"
        >
          <Field
            className={`field ${isCompany}`}
            name="bl_company"
            component={renderField}
            placeholder={this.props.translate('billing_address.company')}
            label={this.props.translate('billing_address.company')}
            msgError={this.props.translate}
            isRequired="*"
          />
          <Field
            id="idCard"
            className="field"
            name="bl_idcard"
            component={renderField}
            placeholder={this.props.translate('billing_address.id_card')}
            label={this.props.translate('billing_address.id_card')}
            onChange={this.handleNumericKeyPress}
            maxLength={13}
            values={this.state.idCard}
            msgError={this.props.translate}
            isRequired="*"
          />
        </Form.Group>
        <Form.Group
          widths="equal"
          key="form-group-same-shipping-1"
          className="form-group-same-shipping"
        >
          <Form.Field key="useShippingAddress">
            <Field
              name="bl_same_address"
              component={Checkbox}
              label={this.props.translate('billing_address.same_shipping')}
              onClick={this.handleClickSameAddress}
              onChange={() =>
                this.setState({ isSameBilling: !this.state.isSameBilling })
              }
              checked={this.state.isSameBilling}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group
          widths="equal"
          key="form-group-address"
          className="form-group-address"
        >
          <Field
            className="field"
            name="bl_address"
            component={renderField}
            placeholder={this.props.translate('billing_address.address')}
            label={this.props.translate('billing_address.address')}
            msgError={this.props.translate}
            isRequired="*"
          />
          <Field
            className="field"
            name="bl_moo"
            component={renderField}
            placeholder={this.props.translate('billing_address.moo')}
            label={this.props.translate('billing_address.moo')}
          />
          <Field
            className="field"
            name="bl_village_name"
            component={renderField}
            placeholder={this.props.translate('billing_address.village_name')}
            label={this.props.translate('billing_address.village_name')}
          />
        </Form.Group>
        <Form.Group
          widths="equal"
          key="form-group-street"
          className="form-group-street"
        >
          <Field
            className="field"
            name="bl_soi"
            component={renderField}
            placeholder={this.props.translate('billing_address.soi')}
            label={this.props.translate('billing_address.soi')}
          />
          <Field
            className="field"
            name="bl_street"
            component={renderField}
            placeholder={this.props.translate('billing_address.street')}
            label={this.props.translate('billing_address.street')}
          />
        </Form.Group>
        <Form.Group
          widths="equal"
          key="form-group-district"
          className="form-group-district"
        >
          <Field
            className="field"
            name="bl_province_id"
            component={renderFieldSelect}
            placeholder={this.props.translate('billing_address.province')}
            label={this.props.translate('billing_address.province')}
            msgError={this.props.translate}
            isRequired="*"
            options={regionOptions}
            onChange={this.handleRegionChange}
          />

          <Field
            className="field"
            name="bl_district_id"
            component={renderFieldSelect}
            placeholder={this.props.translate('billing_address.district')}
            label={this.props.translate('billing_address.district')}
            msgError={this.props.translate}
            isRequired="*"
            options={districtOptions}
            onChange={this.handleDistrictChange}
          />
        </Form.Group>
        <Form.Group
          widths="equal"
          key="form-group-province"
          className="form-group-province"
        >
          <Field
            className="field"
            name="bl_sub_district_id"
            component={renderFieldSelect}
            placeholder={this.props.translate('billing_address.sub_district')}
            label={this.props.translate('billing_address.sub_district')}
            msgError={this.props.translate}
            isRequired="*"
            options={subdistrictOptions}
            onChange={this.handleSubdistrictChange}
          />
          <Field
            className="field"
            name="bl_postcode"
            component={renderFieldSelect}
            placeholder={this.props.translate('billing_address.postcode')}
            label={this.props.translate('billing_address.postcode')}
            options={zipcodeOptions}
            msgError={this.props.translate}
            isRequired="*"
          />
        </Form.Group>
        <Form.Group
          widths="equal"
          key="form-group-same-shipping-2"
          className="form-group-same-shipping"
        >
          <Form.Field key="useShippingAddress">
            <Field
              name="bl_save_billing_address"
              component={Checkbox}
              label={this.props.translate('billing_address.remember')}
              checked={this.state.isSaveBilling}
              onClick={() => {
                this.setState({
                  isSaveBilling: !this.state.isSaveBilling,
                });
              }}
            />
          </Form.Field>
        </Form.Group>
      </div>
    );
  }

  renderContent() {
    const {
      handleSubmit,
      pristine,
      reset,
      submitting,
      customer,
      focusedField,
    } = this.props;
    const isNeedBilling = this.state.isNeedBilling ? '' : 'hidden';
    const isNewBilling = this.state.isNewBilling ? '' : 'hidden';

    let showBillingForm = '';
    let billing = {};
    billing = filter(customer.addresses, data => {
      return data.customer_address_type === 'billing';
    });

    if (this.state.isNeedBilling) {
      if (billing.length > 0 && !this.state.isNewBilling) {
        showBillingForm = 'hidden';
      }
    } else {
      showBillingForm = 'hidden';
    }

    return (
      <Accordion className="checkout-page-accordion">
        <Accordion.Title
          className="checkout-page-accordion-title checkout-page-title"
          active={this.state.activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon className="checkout-page-title__icon chevron down" />
          <Accordion.Title className="checkout-page-title">
            {this.props.translate('billing_address.title')}
          </Accordion.Title>
        </Accordion.Title>
        <Accordion.Content
          className="checkout-page-content"
          active={this.state.activeIndex === 1}
        >
          <Form>
            <Field
              name="bl_need_fulltax"
              component={Checkbox}
              label={this.props.translate('billing_address.need_fulltax')}
              onClick={this.handleClickNeedBilling}
            />
            <div className={`storeBilling ${isNeedBilling}`}>
              <Form.Group className="billing-address-radio-btn" grouped>
                {this.renderStoreBilling()}
              </Form.Group>
            </div>
            {billing.length > 0 ? (
              <Form.Group className="billing-address-radio-btn" grouped>
                <button
                  onClick={this.handleClickNewBilling}
                  className={`add-bill-btn ${
                    this.state.isNewBilling && this.state.isNeedBilling
                      ? 'active'
                      : ''
                  }`}
                >
                  <Image
                    src="/assets/icons/icon-plus-circle.svg"
                    size="mini"
                    avatar
                  />
                  <span>
                    {this.props.translate('billing_address.add_fulltax')}
                  </span>
                </button>
              </Form.Group>
            ) : (
              ''
            )}
            <div className={`form-billing ${showBillingForm}`}>
              <Form.Group className="billing-address-radio-btn" grouped>
                <label>
                  <Field
                    className="bl-type"
                    name="bl_type"
                    component={Radio}
                    type="radio"
                    currentValue="customer"
                    checked={this.state.isCustomer === true}
                    onChange={this.handleTypeCustomer}
                    label={this.props.translate('billing_address.customer')}
                  />
                </label>
                <label>
                  <Field
                    className="bl-type"
                    name="bl_type"
                    component={Radio}
                    type="radio"
                    currentValue="company"
                    checked={this.state.isCompany === true}
                    onChange={this.handleTypeCompany}
                    label={this.props.translate('billing_address.company')}
                  />
                </label>
              </Form.Group>
              {this.renderFormFields()}
            </div>
          </Form>
        </Accordion.Content>
      </Accordion>
    );
  }

  render() {
    const { className } = this.props;
    const markupClassName = `billing-address ${className}`;

    return <div className={markupClassName}>{this.renderContent()}</div>;
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  formValues: prop(state, 'form.fullTaxInvoice.values', {}),
  translate: getTranslate(state.locale),
  cart: state.cart.cart,
  provinces: state.region.provinces,
  districts: state.region.districts,
  subdistricts: state.region.subdistricts,
});

const mapDispatchToProps = dispatch => ({
  setParams: (field, value) => dispatch(change('fullTaxInvoice', field, value)),
  fetchProvince: () => dispatch(fetchProvince(false)),
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId, false)),
  fetchSubDistrict: (regionId, districtId) =>
    dispatch(fetchSubDistrict(regionId, districtId, false)),
  clearDistricts: () => dispatch(fetchDistrictFail()),
  clearSubdistricts: () => dispatch(fetchSubDistrictFail()),
  initializeForm: values => dispatch(initialize('fullTaxInvoice', values)),
  changeFieldValue: (field, value) => {
    dispatch(change('fullTaxInvoice', field, value));
  },
});

BillingAddress = connect(mapStateToProps, mapDispatchToProps)(BillingAddress);

export default reduxForm({
  form: 'fullTaxInvoice',
  validate,
  initialValues,
  onSubmit: () => {},
})(BillingAddress);
