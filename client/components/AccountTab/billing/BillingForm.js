import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import { Field, reduxForm, initialize } from 'redux-form'
import { map, get as prop, isEmpty, reduce, filter, uniqBy } from 'lodash'
import { InputForm } from '../../../magenta-ui';
import { requiredFields } from '../../../constants/billingAddress'
import { fetchDistrict, fetchSubDistrict, fetchDistrictFail, fetchSubDistrictFail } from '../../../reducers/region'
import { getBillingAddressesSelector } from '../../../selectors'

const Input = ({ input, label, type = 'text', className, options, errors, focusedField, ownerType }) => (
  <InputForm
    className={className}
    label={label}
    type={type}
    options={options}
    required={requiredFields[ownerType].includes(input.name)}
    error={errors[input.name]}
    focused={focusedField === input.name}
    {...input}
  />
);

const renderCheckbox = ({ className = '', input, label, type }) => (
  <div className={`ui checkbox ${className}`}>
    <input type="checkbox" {...input} />
    <label>{label}</label>
  </div>
)

const renderFieldSelect = ({ 
  className, 
  input, 
  label, 
  options, 
  isRequired, 
  errors,
  error }) => (
    <div className="select-wrap">
      <select
        id={label}
        className={`input-wrap ${input.value === '' ? 'placeholdered' : ''} ${errors[input.name] ? 'input-error' : ''}`}
        {...input}
        error={errors[input.name]}
      >
        <option value="" disabled selected />
        {
        options.map(option => {
          return (
            <option value={option.value}>{option.text}</option>
          )
        })
      }
      </select>
    
      <label
        className="label-wrap"
        htmlFor={label}>{label}
        {(isRequired) ? <span className="star">{isRequired}</span> : '' }
      </label>
    </div>
)

class BillingForm extends PureComponent {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    focusedField: PropTypes.string,
    errors: PropTypes.object,
    fetchDistrict: PropTypes.func.isRequired,
    fetchSubDistrict: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired
  };

  static defaultProps = {
    focusedField: '',
    errors: {}
  };

  componentWillMount() {
    const { translate, formValues } = this.props;

    if (formValues.region_id) {
      this.regionId = formValues.region_id;
    }

    if (formValues.district_id) {
      this.districtId = formValues.district_id;
    }

    if (formValues.subdistrict_id) {
      this.subdistrictId = formValues.subdistrict_id;
    }

    this.buildingTypeOptions = [
      {
        value: 'detached_house',
        text: translate('right_menu.shipping_options.form.building_types.detached_house')
      },
      {
        value: 'townhouse',
        text: translate('right_menu.shipping_options.form.building_types.townhouse')
      },
      {
        value: 'condominium',
        text: translate('right_menu.shipping_options.form.building_types.condominium')
      },
      {
        value: 'office_builing',
        text: translate('right_menu.shipping_options.form.building_types.office_builing')
      }
    ];
  }

  handleRegionChange = (event, regionId) => {
    const { provinces } = this.props
    const filterProvince = filter(provinces, data => {
      return data.region_id.toString() === regionId
    })

    if (!regionId) {
      return;
    }

    this.regionId = regionId;

    this.props.initializeForm({
      ...this.props.formValues,
      region: (filterProvince.length > 0) ? filterProvince[0].default_name : '',
      district_id: undefined,
      subdistrict_id: undefined,
      postcode: undefined
    });

    this.props.clearDistricts();
    this.props.fetchDistrict(regionId);
  };

  handleDistrictChange = (event, districtId) => {
    const { districts } = this.props
    const filterDistrict = filter(districts, data => {
      return data.district_id.toString() === districtId
    })

    if (!this.regionId || !districtId) {
      return;
    }

    this.districtId = districtId;

    this.props.initializeForm({
      ...this.props.formValues,
      district: (filterDistrict.length > 0) ? filterDistrict[0].default_name : '',
      subdistrict_id: undefined,
      postcode: undefined
    });

    this.props.clearSubdistricts();
    this.props.fetchSubDistrict(this.regionId, districtId)
      .then(() => {
        if (this.props.subdistricts.length === 1) {
          const { subdistricts } = this.props
          const filterSubdistrict = filter(subdistricts, data => {
            return data.subdistrict_id.toString() === this.props.subdistricts[0].subdistrict_id
          })

          this.props.initializeForm({
            ...this.props.formValues,
            subdistrict_id: this.props.subdistricts[0].subdistrict_id,
            subdistrict: (filterSubdistrict.length > 0) ? filterSubdistrict[0].default_name : '',
            postcode: this.props.subdistricts[0].zip_code
          });
        }
      });
  };

  handleSubdistrictChange = (event, subdistrictId) => {
    const { subdistricts } = this.props
    const filterSubdistrict = filter(subdistricts, data => {
      return data.subdistrict_id.toString() === subdistrictId
    })

    this.props.initializeForm({
      ...this.props.formValues,
      subdistrict: (filterSubdistrict.length > 0) ? filterSubdistrict[0].default_name : '',
      postcode: undefined
    });
  };

  handlePersonalChange = event => {
    const { checked } = event.target;

    this.props.initializeForm({
      ...this.props.formValues,
      isPersonal: checked,
      isCompany: !checked
    });
  };

  handleCompanyChange = event => {
    const { checked } = event.target;

    this.props.initializeForm({
      ...this.props.formValues,
      isPersonal: !checked,
      isCompany: checked
    });
  };

  render() {
    const { billingAddresses, provinces, districts, subdistricts, translate, formValues, focusedField } = this.props;

    const regionOptions = map(provinces, province => ({ value: province.region_id, text: province.name }));
    const districtOptions = map(districts, district => ({ value: district.district_id, text: district.name }));
    const subdistrictOptions = map(subdistricts, subdistrict => {
      const times = filter(subdistricts, s => s.name === subdistrict.name).length;
      let text = subdistrict.name;
      if (times > 1) {
        text += ` - ${subdistrict.zip_code}`;
      }
      return { value: subdistrict.subdistrict_id, text };
    });
    const zipcodeOptions = map(
      uniqBy(subdistricts, 'zip_code'),
      subdistrict => ({ value: subdistrict.zip_code, text: subdistrict.zip_code })
    );

    const errors = reduce(this.props.errors, (memo, error, field) => ({
      ...memo,
      [field]: !formValues[field] && error
    }), {});

    const defaultInputProps = {
      component: Input,
      focusedField,
      ownerType: formValues.isPersonal ? 'personal' : 'company',
      errors
    };

    return (
      <form className="form">
        <div className="row">
          <Field name="isPersonal" type="checkbox" component={renderCheckbox} label={translate('right_menu.profile.billing.form.personal')} onChange={this.handlePersonalChange} />
          <Field name="isCompany" type="checkbox" component={renderCheckbox} label={translate('right_menu.profile.billing.form.company')} onChange={this.handleCompanyChange} />
        </div>
        {formValues.isCompany
          ? <Field name="company" {...defaultInputProps} label={translate('right_menu.profile.billing.form.company_name')} />
          : (
            <div className="row">
              <Field name="firstname" {...defaultInputProps} label={translate('right_menu.profile.billing.form.first_name')} />
              <Field name="lastname" {...defaultInputProps} label={translate('right_menu.profile.billing.form.last_name')} />
            </div>
          )
        }
        {formValues.isCompany
          ? <Field name="vat_id" {...defaultInputProps} label={translate('right_menu.profile.billing.form.tax_id')} />
          : <Field name="vat_id" {...defaultInputProps} label={translate('right_menu.profile.billing.form.id_card')} />
        }
        <div className="row">
          <Field className="address_no" name="house_no" {...defaultInputProps} label={translate('right_menu.profile.billing.form.address_no')} />
          <Field className="moo" name="moo" {...defaultInputProps} label={translate('right_menu.profile.billing.form.moo')} />
        </div>
        <Field className="village_name" name="village_name" {...defaultInputProps} label={translate('right_menu.profile.billing.form.building_name_village')} />
        <Field name="soi" {...defaultInputProps} label={translate('right_menu.profile.billing.form.soi')} />
        <Field name="road" {...defaultInputProps} label={translate('right_menu.profile.billing.form.road')} />
        <Field name="region_id" {...defaultInputProps} label={translate('right_menu.profile.billing.form.province')} options={regionOptions} onChange={this.handleRegionChange} component={renderFieldSelect} isRequired="*"/>
        <Field name="district_id" {...defaultInputProps} label={translate('right_menu.profile.billing.form.area_district')} options={districtOptions} onChange={this.handleDistrictChange} component={renderFieldSelect} isRequired="*"/>
        <Field name="subdistrict_id" {...defaultInputProps} label={translate('right_menu.profile.billing.form.district_subdivision')} options={subdistrictOptions} onChange={this.handleSubdistrictChange} component={renderFieldSelect} isRequired="*"/>
        <Field name="postcode" {...defaultInputProps} label={translate('right_menu.profile.billing.form.zip_code')} options={zipcodeOptions} component={renderFieldSelect} isRequired="*"/>
        {!isEmpty(billingAddresses) && <Field name="default_billing" type="checkbox" component={renderCheckbox} label={translate('right_menu.profile.billing.form.default_billing')} />}
        {/* <button className="submit" type="submit" /> */}
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  billingAddresses: getBillingAddressesSelector(state),
  formValues: prop(state, 'form.billing_address.values', {}),
  translate: getTranslate(state.locale),
  provinces: state.region.provinces,
  districts: state.region.districts,
  subdistricts: state.region.subdistricts
})

const mapDispatchToProps = dispatch => ({
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId, false)),
  fetchSubDistrict: (regionId, districtId) => dispatch(fetchSubDistrict(regionId, districtId, false)),
  clearDistricts: () => dispatch(fetchDistrictFail()),
  clearSubdistricts: () => dispatch(fetchSubDistrictFail()),
  initializeForm: values => dispatch(initialize('billing_address', values))
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'billing_address'
})(BillingForm))
