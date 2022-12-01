import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, initialize, change } from 'redux-form';
import { getTranslate } from 'react-localize-redux';
import { map, uniqBy, get as prop } from 'lodash';
import {
  fetchDistrict,
  fetchSubDistrict,
  fetchProvince,
  fetchDistrictFail,
  fetchSubDistrictFail
} from '../../reducers/region';
import './RegisForm.scss';
import { Form, Button, Modal, Image, Header, Grid } from '../../magenta-ui';
import { LocationFinder } from '../StoreSelector';

const initialValues = {
  house_no: '',
  moo: '',
  soi: '',
  road: '',
  province_id: '',
  district_id: '',
  sub_district_id: '',
  building_type: '',
  postcode: '',
  remark: ''
};

const validate = values => {
  const errors = {};
  if (!values.house_no) {
    errors.house_no = 'errors.regis.house_no';
  }
  if (!values.province_id) {
    errors.province_id = 'errors.regis.province';
  }
  if (!values.district_id) {
    errors.district_id = 'errors.regis.district';
  }
  if (!values.sub_district_id) {
    errors.sub_district_id = 'errors.regis.sub_district';
  }
  if (!values.postcode) {
    errors.postcode = 'errors.regis.postcode';
  }
  return errors;
};

const renderField = ({
  msgError,
  className,
  input,
  label,
  type,
  isRequired,
  maxLength,
  placeholder,
  meta: { touched, error, warning }
}) => {
  return (
    <div className={className}>
      <label className="label-wrap" htmlFor={label}>
        {label}
        {isRequired ? <span className="lb-error">{isRequired}</span> : ''}
      </label>
      <div className="input-section">
        <input
          className={`input-wrap ${touched && error ? 'input-error' : ''}`}
          id={label}
          {...input}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
        />
        {touched &&
          ((error && <span className="error">{msgError(error)}</span>) || (warning && <span>{warning}</span>))}
      </div>
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
  selectOption,
  meta: { touched, error, warning }
}) => (
  <div className={className}>
    <label className="label-wrap" htmlFor={label}>
      {label}
      {isRequired ? <span className="lb-error">{isRequired}</span> : ''}
    </label>
    <div className="input-section">
      <select
        id={label}
        className={`input-wrap ${input.value === '' ? 'placeholdered' : ''} ${touched && error ? 'input-error' : ''}`}
        {...input}
      >
        <option value="" disabled selected>
          {selectOption}
        </option>
        {options.map(option => {
          return <option value={option.value}>{option.text}</option>;
        })}
      </select>
      {touched && ((error && <span className="error">{msgError(error)}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

const renderFieldTextArea = ({ label, input, className, placeholder }) => (
  <div className={className}>
    <label className="label-wrap">{label}</label>
    <textarea {...input} type="text" className="input-textarea" rows="5" placeholder={placeholder} maxLength={255} />
  </div>
);

class RegisStep2 extends Component {
  state = {
    modalOpen: false
  };

  componentDidMount() {
    this.props.fetchProvince();
    this.props.fetchDistrict();
    this.props.fetchSubDistrict();
  }

  componentWillMount() {
    const { translate } = this.props;

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
    if (!regionId) {
      return;
    }

    this.regionId = regionId;

    this.props.initializeForm({
      ...this.props.formValues,
      district_id: undefined,
      sub_district_id: undefined,
      postcode: undefined
    });

    this.props.clearDistricts();
    this.props.fetchDistrict(regionId);
  };

  handleDistrictChange = (event, districtId) => {
    if (!this.regionId || !districtId) {
      return;
    }

    this.districtId = districtId;

    this.props.initializeForm({
      ...this.props.formValues,
      sub_district_id: undefined,
      postcode: undefined
    });

    this.props.clearSubdistricts();
    this.props.fetchSubDistrict(this.regionId, districtId).then(() => {
      if (this.props.subdistricts.length === 1) {
        this.props.initializeForm({
          ...this.props.formValues,
          sub_district_id: this.props.subdistricts[0].subdistrict_id,
          postcode: this.props.subdistricts[0].zip_code
        });
      }
    });
  };

  handleSubdistrictChange = (event, subdistrictId) => {
    this.props.initializeForm({
      ...this.props.formValues,
      postcode: undefined
    });
  };

  onFoundLocation = location => {
    const hasData = Boolean(location.regionId || location.districtId || location.subdistrictId);
    if (hasData) {
      this.regionId = location.regionId;
      this.districtId = location.districtId;

      this.props.changeFieldValue('province_id', location.regionId);
      this.props.changeFieldValue('district_id', location.districtId);
      this.props.changeFieldValue('sub_district_id', location.subdistrictId);
    } else {
      this.setState({
        modalOpen: true
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalOpen: false
    });
  };

  render() {
    const { provinces, districts, subdistricts, translate, handleSubmit, loading } = this.props;
    const regionOptions = map(provinces, province => ({ value: province.region_id, text: province.name }));
    const districtOptions = map(districts, district => ({ value: district.district_id, text: district.name }));

    const subdistrictOptions = map(uniqBy(subdistricts, 'subdistrict_id'), subdistrict => ({
      value: subdistrict.subdistrict_id,
      text: subdistrict.name
    }));

    const zipcodeOptions = map(uniqBy(subdistricts, 'zip_code'), subdistrict => ({
      value: subdistrict.zip_code,
      text: subdistrict.zip_code
    }));

    return (
      <div id="regis-step2">
        <Modal size="small" id="store-modal" open={this.state.modalOpen} onClose={this.closeModal}>
          <div onClick={this.closeModal} className="close-icon">
            <Image src="/assets/icons/icon-close.jpg" />
          </div>
          <Modal.Content className="modal-content">
            <Modal.Description>
              <Header textAlign="center" className="title" handleToHome={() => this.props.history.push('/')}>
                {translate('modal-location.title')}
              </Header>
              <Grid centered>
                <Grid.Column textAlign="center" className="box-panel">
                  <Header handleToHome={() => this.props.history.push('/')}>
                    <p className="desc">{translate('modal-location.detail')}</p>
                  </Header>
                  <p className="remark">{translate('modal-location.change-location')}</p>
                </Grid.Column>
              </Grid>
              <div className="border-raius" />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions className="modal-action">
            <Grid centered>
              <Grid.Column textAlign="center">
                <Button className="modal-btn" onClick={this.closeModal}>
                  {translate('modal-location.button')}
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
        <p className="title">{translate('regis_form.title_step2')}</p>
        <Form onSubmit={handleSubmit}>
          <LocationFinder width="12" className="location-finder" onFoundLocation={this.onFoundLocation} />
          <Field
            className="field"
            name="province_id"
            label={translate('regis_form.form.province')}
            component={renderFieldSelect}
            options={regionOptions}
            msgError={this.props.translate}
            isRequired="*"
            selectOption={translate('regis_form.form.placeholder.province')}
            onChange={this.handleRegionChange}
          />
          <Field
            className="field"
            name="district_id"
            label={translate('regis_form.form.district')}
            component={renderFieldSelect}
            options={districtOptions}
            msgError={this.props.translate}
            isRequired="*"
            selectOption={translate('regis_form.form.placeholder.district')}
            onChange={this.handleDistrictChange}
          />
          <Field
            className="field"
            name="sub_district_id"
            label={translate('regis_form.form.sub_district')}
            component={renderFieldSelect}
            options={subdistrictOptions}
            msgError={this.props.translate}
            isRequired="*"
            selectOption={translate('regis_form.form.placeholder.sub_district')}
            onChange={this.handleSubdistrictChange}
          />
          <Field
            className="field"
            name="postcode"
            label={translate('regis_form.form.postcode')}
            component={renderFieldSelect}
            options={zipcodeOptions}
            msgError={this.props.translate}
            isRequired="*"
            selectOption={translate('regis_form.form.placeholder.postcode')}
          />
          <Form.Group widths="equal" key="house-detail">
            <Field
              className="field"
              name="house_no"
              label={translate('regis_form.form.house_no')}
              component={renderField}
              type="text"
              placeholder={translate('regis_form.form.placeholder.house_no')}
              msgError={this.props.translate}
              isRequired="*"
              maxLength="10"
            />
            <Field
              className="field"
              name="building_type"
              label={translate('regis_form.form.building_type')}
              component={renderFieldSelect}
              options={this.buildingTypeOptions}
              selectOption={translate('regis_form.form.placeholder.building_type')}
            />
          </Form.Group>
          <Field
            className="field"
            name="village"
            label={translate('regis_form.form.village')}
            component={renderField}
            type="text"
            placeholder={translate('regis_form.form.placeholder.village')}
            maxLength="100"
          />
          <Form.Group widths="equal" key="house-road">
            <Field
              className="field"
              name="soi"
              label={translate('regis_form.form.soi')}
              component={renderField}
              type="text"
              placeholder={translate('regis_form.form.placeholder.soi')}
              maxLength="100"
            />
            <Field
              className="field"
              name="moo"
              label={translate('regis_form.form.moo')}
              component={renderField}
              type="text"
              placeholder={translate('regis_form.form.placeholder.moo')}
              maxLength="50"
            />
          </Form.Group>
          <Field
            className="field"
            name="road"
            label={translate('regis_form.form.road')}
            component={renderField}
            type="text"
            placeholder={translate('regis_form.form.placeholder.road')}
            maxLength="100"
          />
          <Field
            className="field"
            name="remark"
            label={translate('regis_form.form.remark')}
            component={renderFieldTextArea}
            type="text"
            placeholder={translate('regis_form.form.placeholder.remark')}
          />
          <p className="notice">&nbsp;</p>
          <Button disabled={loading} loading={loading} className="next-step" type="submit">
            {translate('regis_form.next-step')}
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.regisForm.values', {}),
  provinces: state.region.provinces,
  districts: state.region.districts,
  subdistricts: state.region.subdistricts,
  loading: state.registration.loading
});

const mapDispatchToProps = dispatch => ({
  fetchProvince: () => dispatch(fetchProvince()),
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId)),
  fetchSubDistrict: (regionId, districtId) => dispatch(fetchSubDistrict(regionId, districtId)),
  clearDistricts: () => dispatch(fetchDistrictFail()),
  clearSubdistricts: () => dispatch(fetchSubDistrictFail()),
  initializeForm: values => dispatch(initialize('regisForm', values)),
  changeFieldValue: (field, value) => {
    dispatch(change('regisForm', field, value));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'regisForm',
    validate,
    initialValues,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
  })(RegisStep2)
);
