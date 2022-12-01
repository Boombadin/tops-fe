import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Field, reduxForm, initialize } from 'redux-form';
import { map, get as prop, isEmpty, reduce, filter, uniqBy } from 'lodash';
import Cookie from 'js-cookie'
import LocationSelector from '../StoreSelector/LocationSelector';
import LocationFinder from '../StoreSelector/LocationFinder';
import { InputForm } from '../../magenta-ui';
import { requiredFields } from '../../constants/shippingAddress';
import { fetchDistrict, fetchSubDistrict, fetchDistrictFail, fetchSubDistrictFail } from '../../reducers/region';

const Input = ({
  input,
  label,
  values,
  maxLength,
  type = 'text',
  className,
  options,
  errors,
  focusedField,
  autoComplete
}) => (
  <InputForm
    className={className}
    label={label}
    type={type}
    options={options}
    required={requiredFields.includes(input.name)}
    error={errors[input.name]}
    focused={focusedField === input.name}
    autoComplete={autoComplete}
    {...input}
    value={values || input.value}
    maxLength={maxLength}
  />
);

const InputNotDetect = ({ input, label, type = 'text', className, options, errors, focusedField, autoComplete }) => (
  <InputForm
    className={className}
    label={label}
    type={type}
    options={options}
    required={requiredFields.includes(input.name)}
    error={errors[input.name]}
    focused={focusedField === input.name}
    autoComplete={autoComplete}
    {...input}
  />
);

const renderCheckbox = ({ className, input, label, type }) => (
  <div className={`ui checkbox ${className}`}>
    <input type="checkbox" {...input} />
    <label>{label}</label>
  </div>
);

const renderTextarea = ({ label, input }) => (
  <div className="textarea-wrap">
    <textarea {...input} placeholder={label} type="text" className="input-textarea" rows="5" maxLength="255" />
    <label className="label-wrap" htmlFor={label}>
      {label}
    </label>
  </div>
);

const renderFieldSelect = ({ className = '', input, label, options, isRequired, errors, error }) => {
  return options !== undefined && (
    <div className={`select-wrap ${className}`}>
      <select
        id={label}
        className={`input-wrap ${input.value === '' ? 'placeholdered' : ''} ${errors[input.name] ? 'input-error' : ''}`}
        {...input}
        error={errors[input.name]}
      >
        <option value="" disabled selected />
        {options.map(option => {
          return <option value={option.value}>{option.text}</option>;
        })}
      </select>

      <label className="label-wrap" htmlFor={label}>
        {label}
        {isRequired ? <span className="star">{isRequired}</span> : ''}
      </label>
    </div>
)};

class AddressForm extends PureComponent {
  state = {
    firstname: '',
    lastname: '',
    telephone: '',
    houseno: '',
    road: '',
    soi: '',
    moo: '',
    addressname: '',
    villagename: '',
    chars_left: 255
  };

  static propTypes = {
    focusedField: PropTypes.string,
    errors: PropTypes.object,
    fetchDistrict: PropTypes.func.isRequired,
    fetchSubDistrict: PropTypes.func.isRequired
  };

  static defaultProps = {
    errors: {}
  };

  componentDidMount() {
    const remark = this.props.formValues.remark;
    if (remark) {
      if (remark.length > 0) {
        this.setState({ chars_left: 255 - remark.length });
      }
    }
  }

  componentWillMount = async () => {
    const { translate, formValues } = this.props;
    const { onDefaultLocate } = this.props;
    const shippingCookie = onDefaultLocate;

    if (onDefaultLocate !== '' && onDefaultLocate !== ',,,' && onDefaultLocate !== undefined) {
      const shippingCookieObject = shippingCookie.split(',');

      this.props.fetchDistrict(shippingCookieObject[0]).then(() => {
        this.props.fetchSubDistrict(shippingCookieObject[0], shippingCookieObject[1]).then(() => {
          this.regionId = shippingCookieObject[0];
          this.districtId = shippingCookieObject[1];
          this.subdistrictId = shippingCookieObject[2];
          const { provinces, districts, subdistricts } = this.props
          const filterProvince = filter(provinces, data => {
            return data.region_id.toString() === shippingCookieObject[0]
          })
          const filterDistrict = filter(districts, data => {
            return data.district_id.toString() === shippingCookieObject[1]
          })
          const filterSubdistrict = filter(subdistricts, data => {
            return data.subdistrict_id.toString() === shippingCookieObject[2]
          })
          this.props.initializeForm({
            ...this.props.formValues,
            region_id: shippingCookieObject[0],
            region: (filterProvince.length > 0) ? filterProvince[0].default_name : '',
            district_id: shippingCookieObject[1],
            district: (filterDistrict.length > 0) ? filterDistrict[0].default_name : '',
            subdistrict_id: shippingCookieObject[2],
            subdistrict: (filterSubdistrict.length > 0) ? filterSubdistrict[0].default_name : '',
          });
        });
      });
    } else {
      if (formValues.region_id) {
        this.regionId = formValues.region_id;
      }

      if (formValues.district_id) {
        this.districtId = formValues.district_id;
      }

      if (formValues.subdistrict_id) {
        this.subdistrictId = formValues.subdistrict_id;
      }
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
    this.props.fetchSubDistrict(this.regionId, districtId).then(() => {
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

  handleLocationActive = status => {};

  handleFoundLocation = ({ regionId, districtId, subdistrictId }) => {
    const { subdistricts, districts, provinces } = this.props

    const filterProvince = filter(provinces, data => {
      return data.region_id.toString() === regionId
    })

    const filterDistrict = filter(districts, data => {
      return data.district_id.toString() === districtId
    })

    const filterSubdistrict = filter(subdistricts, data => {
      return data.subdistrict_id.toString() === subdistrictId
    })
    
    if (!regionId) {
      return;
    }

    this.regionId = regionId;
    this.districtId = districtId;

    this.props.initializeForm({
      ...this.props.formValues,
      region_id: regionId,
      region: (filterProvince.length > 0) ? filterProvince[0].default_name : '',
      district_id: districtId,
      district: (filterDistrict.length > 0) ? filterDistrict[0].default_name : '',
      subdistrict_id: subdistrictId,
      subdistrict: (filterSubdistrict.length > 0) ? filterSubdistrict[0].default_name : '',
    });
  };

  handleWordCount = e => {
    const charCount = e.target.value.length;
    const charLeft = 255 - charCount;
    this.setState({ chars_left: charLeft });
  };

  handleKeyPress = (e, stateName) => {
    const validate = /^[A-Za-zก-๙\-\.\s]+$/g.test(e.target.value) || e.target.value === '';
    if (validate) {
      this.setState({
        [stateName]: e.target.value
      });
    }
  };

  handleSpecialCharacterKeyPress = (e, stateName) => {
    const validate = /^[0-9A-Za-zก-๙\-\/\.\s]+$/g.test(e.target.value) || e.target.value === '';
    if (validate) {
      this.setState({
        [stateName]: e.target.value
      });
    }
  };

  handleNumericKeyPress = (e, stateName) => {
    const validate = e.target.value === '' || /^[0-9\s]+$/g.test(e.target.value);
    if (validate) {
      this.setState({
        [stateName]: e.target.value
      });
    }
  };

  render() {
    const {
      onSubmit,
      pristine,
      reset,
      submitting,
      translate,
      onRef,
      provinces,
      districts,
      subdistricts,
      customer,
      formValues,
      focusedField
    } = this.props;

    const regionOptions = map(provinces, province => ({ value: province.region_id, text: province.name }));
    const districtOptions = map(districts, district => ({ value: district.district_id, text: district.name }));
    const subdistrictOptions = map(subdistricts, (subdistrict, ind) => {
      let text = subdistrict.name;
      const next = subdistricts[ind + 1];
      const previous = subdistricts[ind - 1];

      if (text === prop(previous, 'name') || text === prop(next, 'name')) {
        text += ` - ${subdistrict.zip_code}`;
      }

      return { value: subdistrict.subdistrict_id, text };
    });

    const zipcodeOptions = map(uniqBy(subdistricts, 'zip_code'), subdistrict => ({
      value: subdistrict.zip_code,
      text: subdistrict.zip_code
    }));

    const errors = reduce(
      this.props.errors,
      (memo, error, field) => ({
        ...memo,
        [field]: !formValues[field] && error
      }),
      {}
    );

    const defaultInputProps = {
      component: Input,
      focusedField,
      errors
    };

    const defaultInputNotDetectProps = {
      component: InputNotDetect,
      focusedField,
      errors
    };

    return (
      <form className="form" ref={onRef} onSubmit={onSubmit}>
        <div className="row">
          <Field
            name="firstname"
            {...defaultInputProps}
            label={translate('right_menu.shipping_options.form.first_name')}
            onChange={e => this.handleKeyPress(e, 'firstname')}
            values={this.state.firstname}
            maxLength={100}
          />
          <Field
            name="lastname"
            {...defaultInputProps}
            label={translate('right_menu.shipping_options.form.last_name')}
            onChange={e => this.handleKeyPress(e, 'lastname')}
            values={this.state.lastname}
            maxLength={100}
          />
        </div>
        <Field
          name="telephone"
          {...defaultInputProps}
          label={translate('right_menu.shipping_options.form.contact_number')}
          onChange={e => this.handleNumericKeyPress(e, 'telephone')}
          values={this.state.telephone}
          maxLength={10}
        />

        {
          Cookie.get('provider') !== 'GrabFresh' && <LocationFinder
            isOverflow
            noPadding
            className="search-by-location"
            onLocationActive={this.handleLocationActive}
            onFoundLocation={this.handleFoundLocation}
          />
        }
        
        <div className="row">
          <Field
            className="house_no"
            name="house_no"
            {...defaultInputProps}
            label={translate('right_menu.shipping_options.form.house_no')}
            onChange={e => this.handleSpecialCharacterKeyPress(e, 'houseno')}
            values={this.state.houseno}
            maxLength={100}
          />
          <Field
            className="building_type"
            name="building_type"
            {...defaultInputNotDetectProps}
            label={translate('right_menu.shipping_options.form.building_type')}
            options={this.buildingTypeOptions}
            component={renderFieldSelect}
          />
        </div>
        <Field
          name="soi"
          {...defaultInputProps}
          label={translate('right_menu.shipping_options.form.soi')}
          onChange={e => this.handleSpecialCharacterKeyPress(e, 'soi')}
          values={this.state.soi}
          maxLength={100}
        />
        <div className="row">
          <Field
            className="moo"
            name="moo"
            {...defaultInputProps}
            label={translate('right_menu.shipping_options.form.moo')}
            onChange={e => this.handleNumericKeyPress(e, 'moo')}
            values={this.state.moo}
            maxLength={10}
          />
          <Field
            className="village_name"
            name="village_name"
            {...defaultInputProps}
            label={translate('right_menu.shipping_options.form.village')}
            onChange={e => this.handleSpecialCharacterKeyPress(e, 'villagename')}
            values={this.state.villagename}
            maxLength={200}
          />
        </div>
        <Field
          name="road"
          {...defaultInputProps}
          label={translate('right_menu.shipping_options.form.road')}
          onChange={e => this.handleSpecialCharacterKeyPress(e, 'road')}
          values={this.state.road}
          maxLength={200}
        />
        <Field
          name="region_id"
          type="select"
          {...defaultInputNotDetectProps}
          label={translate('right_menu.shipping_options.form.province')}
          options={regionOptions}
          onChange={this.handleRegionChange}
          component={renderFieldSelect}
          isRequired="*"
        />
        <Field
          name="district_id"
          {...defaultInputNotDetectProps}
          label={translate('right_menu.shipping_options.form.area_district')}
          options={districtOptions}
          onChange={this.handleDistrictChange}
          component={renderFieldSelect}
          isRequired="*"
        />
        <Field
          name="subdistrict_id"
          {...defaultInputNotDetectProps}
          label={translate('right_menu.shipping_options.form.district_subdivision')}
          options={subdistrictOptions}
          onChange={this.handleSubdistrictChange}
          component={renderFieldSelect}
          isRequired="*"
        />
        <Field
          name="postcode"
          {...defaultInputNotDetectProps}
          label={translate('right_menu.shipping_options.form.zip_code')}
          placeholder={translate('right_menu.shipping_options.form.zip_code')}
          options={zipcodeOptions}
          component={renderFieldSelect}
          isRequired="*"
        />
        <Field
          name="address_name"
          {...defaultInputProps}
          label={translate('right_menu.shipping_options.form.address_name')}
          onChange={e => this.handleSpecialCharacterKeyPress(e, 'addressname')}
          values={this.state.addressname}
          maxLength={200}
        />
        <div className="remark">
          <Field
            name="remark"
            {...defaultInputProps}
            label={translate('right_menu.shipping_options.form.notice_point')}
            placeholder={translate('right_menu.shipping_options.form.notice_point')}
            component={renderTextarea}
            onChange={this.handleWordCount}
          />
          <div className="count-char-wrap">
            <div className="line" />
            <span className="count-char">{this.state.chars_left}</span>
          </div>
        </div>
        {!isEmpty(customer.addresses) && (
          <Field
            className="set-as-default"
            name="default_shipping"
            type="checkbox"
            component={renderCheckbox}
            label={translate('right_menu.shipping_options.form.default_shipping')}
          />
        )}
        {/* <button className="submit" type="submit" /> */}
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  customer: state.customer.items,
  formValues: prop(state, 'form.address.values', {}),
  translate: getTranslate(state.locale),
  provinces: state.region.provinces,
  districts: state.region.districts,
  subdistricts: state.region.subdistricts
});

const mapDispatchToProps = dispatch => ({
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId)),
  fetchSubDistrict: (regionId, districtId) => dispatch(fetchSubDistrict(regionId, districtId, true)),
  clearDistricts: () => dispatch(fetchDistrictFail()),
  clearSubdistricts: () => dispatch(fetchSubDistrictFail()),
  initializeForm: values => dispatch(initialize('address', values)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'address'
  })(AddressForm)
);
