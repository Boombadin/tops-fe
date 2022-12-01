import React, { PureComponent } from 'react';
import { uniqBy, filter, find, get, map, isEmpty, size } from 'lodash';
import { object, func } from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  FormInput,
  FormSelect,
  FormRadio,
  FormCheckBox,
} from '../../components/Form';
import { Row, Col, Padding, Space } from '@central-tech/core-ui';
import styled from 'styled-components';
import {
  Provinces,
  Districts,
  SubDistricts,
} from '../../components/LocationsProvider';
import withLocales from '../../hoc/withLocales';

const CustomLineSpace = styled.div`
  height: 1px;
  border-bottom: 1px dashed #e8e8e8;
  margin: 10px -10px 10px;
`;

const defaultValues = {
  company: '',
  firstname: '',
  lastname: '',
  telephone: '',
  vat_id: '',
  house_no: '',
  moo: '',
  village_name: '',
  soi: '',
  road: '',
  region_id: '',
  region: '',
  district_id: '',
  district: '',
  subdistrict_id: '',
  subdistrict: '',
  postcode: '',
  address_name: '',
  remark: '',
  countryId: 'TH',
  customer_address_type: 'billing',
  street: ['N/A'],
  city: 'N/A',
  default_billing: false,
  billing_type: 'personal',
};

class BillingAddressForm extends PureComponent {
  state = {
    billingType: 'personal', // personal|company
    default_billing: false,
  };

  validationSchema = translate => {
    return Yup.object().shape({
      billing_type: Yup.string(),
      company: Yup.string().when('billing_type', {
        is: 'company',
        then: Yup.string()
          .trim('This field must not be whitespace')
          .max(100, 'Limit 100 character')
          .required(translate('address_form.required_field')),
      }),
      firstname: Yup.string().when('billing_type', {
        is: 'personal',
        then: Yup.string()
          .trim(translate('address_form.required_field'))
          .max(100, '')
          .required(translate('address_form.required_field')),
      }),
      lastname: Yup.string().when('billing_type', {
        is: 'personal',
        then: Yup.string()
          .trim(translate('address_form.required_field'))
          .max(100, '')
          .required(translate('address_form.required_field')),
      }),
      vat_id: Yup.string().when('billing_type', {
        is: 'personal',
        then: Yup.string()
          .matches(/^[0-9]*$/, 'Please enter numbers only')
          .required(translate('address_form.required_field'))
          .test(
            'len',
            translate('address_form.required_field_idcard_format'),
            val => size(val) === 13,
          ),
        otherwise: Yup.string()
          .matches(/^[0-9]*$/, 'Please enter numbers only')
          .required(translate('address_form.required_field'))
          .test(
            'len',
            translate('address_form.required_field_tax_format'),
            val => size(val) === 13,
          ),
      }),
      telephone: Yup.string()
        .matches(/^[0-9]*$/, translate('address_form.required_field_format'))
        .min(9, translate('address_form.required_field_format'))
        .max(15, translate('address_form.required_field_format'))
        .required(translate('address_form.required_field')),

      house_no: Yup.string().required(translate('address_form.required_field')),
      region_id: Yup.string().required(
        translate('address_form.required_field'),
      ),
      district_id: Yup.string().required(
        translate('address_form.required_field'),
      ),
      subdistrict_id: Yup.string().required(
        translate('address_form.required_field'),
      ),
      postcode: Yup.string().required(translate('address_form.required_field')),
    });
  };
  componentDidMount() {
    const { initialValue } = this.props;
    this.setState({
      billingType:
        !isEmpty(get(initialValue, 'company')) &&
        get(initialValue, 'company').toUpperCase() !== 'N/A'
          ? 'company'
          : 'personal',
      default_billing: get(initialValue, 'default_billing', false),
    });
  }

  render() {
    const { initialValue, onSubmit, submitFunc, translate } = this.props;
    return (
      <Formik
        initialValues={{ ...defaultValues, ...initialValue }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.billing_type === 'company') {
            values.firstname = 'N/A';
            values.lastname = 'N/A';
          } else if (values.billing_type === 'personal') {
            values.company = 'N/A';
          }
          onSubmit(values);
          setSubmitting(false);
        }}
        validationSchema={this.validationSchema(translate)}
      >
        {({ submitForm, values, setFieldValue }) => {
          submitFunc && submitFunc(submitForm);
          return (
            <Form noValidate autoComplete="off">
              <Row>
                <Col lg="100px" sm={6}>
                  <FormRadio
                    name="billing_type"
                    label={translate('billing_form.company')}
                    checked={this.state.billingType === 'company'}
                    onChange={() => {
                      this.setState({ billingType: 'company' });
                      setFieldValue('billing_type', 'company');
                      setFieldValue(
                        'company',
                        get(initialValue, 'company', 'N/A') === 'N/A'
                          ? ''
                          : get(initialValue, 'company', ''),
                      );
                      setFieldValue(
                        'firstname',
                        get(initialValue, 'firstname', '') === 'N/A'
                          ? ''
                          : get(initialValue, 'firstname', ''),
                      );
                      setFieldValue(
                        'lastname',
                        get(initialValue, 'lastname', '') === 'N/A'
                          ? ''
                          : get(initialValue, 'lastname', ''),
                      );
                    }}
                  />
                </Col>
                <Col lg="120px" sm={6}>
                  <FormRadio
                    name="billing_type"
                    label={translate('billing_form.customer')}
                    checked={this.state.billingType === 'personal'}
                    onChange={() => {
                      this.setState({ billingType: 'personal' });
                      setFieldValue('billing_type', 'personal');
                      setFieldValue(
                        'firstname',
                        get(initialValue, 'firstname', 'N/A') === 'N/A'
                          ? ''
                          : get(initialValue, 'firstname', ''),
                      );
                      setFieldValue(
                        'lastname',
                        get(initialValue, 'lastname', 'N/A') === 'N/A'
                          ? ''
                          : get(initialValue, 'lastname', ''),
                      );
                      setFieldValue(
                        'company',
                        get(initialValue, 'company', '') === 'N/A'
                          ? ''
                          : get(initialValue, 'company', ''),
                      );
                    }}
                  />
                </Col>
              </Row>

              <Space xs="10px" />
              {this.state.billingType === 'personal' && (
                <Row>
                  <Col xs={12} sm={6}>
                    <Padding xs="0" sm="0 10px 0 0">
                      <FormInput
                        type="text"
                        name="firstname"
                        label={translate('billing_form.first_name')}
                        placeholder={translate('billing_form.first_name')}
                        required
                      />
                    </Padding>
                  </Col>
                  <Col xs={12} sm={6}>
                    <FormInput
                      type="text"
                      name="lastname"
                      label={translate('billing_form.last_name')}
                      placeholder={translate('billing_form.last_name')}
                      required
                    />
                  </Col>
                </Row>
              )}

              {this.state.billingType === 'company' && (
                <Row>
                  <Col xs={12} sm={6}>
                    <Padding xs="0" sm="0 10px 0 0">
                      <FormInput
                        type="text"
                        name="company"
                        label={translate('billing_form.company_name')}
                        placeholder={translate(
                          'billing_form.company_name_placeholder',
                        )}
                        required
                      />
                    </Padding>
                  </Col>
                  {/* <Col xs={12} sm={6}>
                    <Padding xs="0" sm="0 10px 0 0">
                      <FormInput
                        type="text"
                        name="vat_id"
                        label="เลขผู้เสียภาษี"
                        placeholder="00-0000-0000"
                        required
                      />
                    </Padding>
                  </Col> */}
                </Row>
              )}

              <Row>
                <Col xs={12} sm={6}>
                  <Padding xs="0" sm="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="telephone"
                      label={translate('billing_form.tel')}
                      placeholder="000-000-000"
                      required
                      onChange={e => {
                        setFieldValue(
                          e.target.name,
                          e.target.value.replace(/[^0-9]/g, ''),
                        );
                      }}
                    />
                  </Padding>
                </Col>
                <Col xs={12} sm={6}>
                  <Padding xs="0" sm="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="vat_id"
                      label={
                        this.state.billingType === 'company'
                          ? translate('billing_form.tax_id')
                          : translate('billing_form.id_card')
                      }
                      placeholder="0-0000-00000-00-0"
                      required
                      onChange={e => {
                        setFieldValue(
                          e.target.name,
                          e.target.value.replace(/[^0-9]/g, ''),
                        );
                      }}
                    />
                  </Padding>
                </Col>
              </Row>
              <Space xs="10px" />
              <Row>
                <Col xs={6} sm={4}>
                  <Padding xs="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="house_no"
                      label={translate('billing_form.house_no')}
                      placeholder={translate(
                        'billing_form.house_no_placeholder',
                      )}
                      required
                    />
                  </Padding>
                </Col>
                <Col xs={6} sm={3.5}>
                  <Padding xs="0" sm="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="moo"
                      label={translate('billing_form.moo')}
                      placeholder={translate('billing_form.moo')}
                    />
                  </Padding>
                </Col>
                <Col xs={12} sm={4.5}>
                  <FormInput
                    type="text"
                    name="village_name"
                    label={translate('billing_form.building_name')}
                    placeholder={translate(
                      'billing_form.building_name_placeholder',
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={5}>
                  <Padding sm="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="soi"
                      label={translate('billing_form.soi')}
                      placeholder={translate('billing_form.soi')}
                    />
                  </Padding>
                </Col>
                <Col xs={12} sm={5.5}>
                  <FormInput
                    type="text"
                    name="road"
                    label={translate('billing_form.street')}
                    placeholder={translate('billing_form.street')}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={5}>
                  <Padding sm="0 10px 0 0">
                    <Provinces>
                      {({ data: { provinces = [] }, loading }) => {
                        return (
                          <FormSelect
                            required
                            name="region_id"
                            label={translate('billing_form.province')}
                            placeholder={translate(
                              'billing_form.province_placeholder',
                            )}
                            disabled={loading}
                            onChange={e => {
                              const selectedProvinceName = get(
                                find(
                                  provinces,
                                  province =>
                                    province.region_id === e.target.value,
                                ),
                                'name',
                              );
                              setFieldValue('region_id', e.target.value);
                              setFieldValue('region', selectedProvinceName);
                              setFieldValue('district_id', '');
                              setFieldValue('subdistrict_id', '');
                              setFieldValue('postcode', '');
                            }}
                          >
                            {provinces &&
                              provinces.map(province => (
                                <option
                                  key={province.region_id}
                                  value={province.region_id}
                                >
                                  {province.name}
                                </option>
                              ))}
                          </FormSelect>
                        );
                      }}
                    </Provinces>
                  </Padding>
                </Col>
                <Col xs={12} sm={5}>
                  <Padding sm="0 10px 0 0">
                    <Districts regionId={values.region_id}>
                      {({ data: { districts = [] }, loading }) => {
                        return (
                          <FormSelect
                            required
                            name="district_id"
                            label={translate('billing_form.district')}
                            placeholder={translate(
                              'billing_form.district_placeholder',
                            )}
                            disabled={loading}
                            onChange={e => {
                              const selectedDistrictName = get(
                                find(
                                  districts,
                                  district =>
                                    district.district_id === e.target.value,
                                ),
                                'name',
                              );
                              setFieldValue('district_id', e.target.value);
                              setFieldValue('district', selectedDistrictName);
                              setFieldValue('subdistrict_id', '');
                              setFieldValue('postcode', '');
                            }}
                          >
                            {districts &&
                              districts.map(district => (
                                <option
                                  key={district.district_id}
                                  value={district.district_id}
                                >
                                  {district.name}
                                </option>
                              ))}
                          </FormSelect>
                        );
                      }}
                    </Districts>
                  </Padding>
                </Col>
              </Row>
              <SubDistricts
                regionId={values.region_id}
                districtId={values.district_id}
                subDistrictId={values.subdistrict_id}
              >
                {({ data: { subDistricts = [] }, loading }) => {
                  const uniqSubDistricts = uniqBy(
                    subDistricts,
                    subDistrict => subDistrict.subdistrict_id,
                  );
                  return (
                    <Row>
                      <Col xs={12} sm={5}>
                        <Padding sm="0 10px 0 0">
                          <FormSelect
                            required
                            name="subdistrict_id"
                            label={translate('billing_form.sub_district')}
                            placeholder={translate(
                              'billing_form.sub_district_placeholder',
                            )}
                            disabled={loading}
                            onChange={e => {
                              const selectedSubDistrictName = get(
                                find(
                                  subDistricts,
                                  subDistrict =>
                                    subDistrict.subdistrict_id ===
                                    e.target.value,
                                ),
                                'name',
                              );
                              setFieldValue('subdistrict_id', e.target.value);
                              setFieldValue(
                                'subdistrict',
                                selectedSubDistrictName,
                              );
                              // setFieldValue('postcode', '');
                            }}
                          >
                            {uniqSubDistricts &&
                              uniqSubDistricts.map(subDistrict => (
                                <option
                                  key={subDistrict.subdistrict_id}
                                  value={subDistrict.subdistrict_id}
                                >
                                  {subDistrict.name}
                                </option>
                              ))}
                          </FormSelect>
                        </Padding>
                      </Col>
                      <Col xs={12} sm={5}>
                        <Padding sm="0 10px 0 0">
                          <FormSelect
                            required
                            name="postcode"
                            label={translate('billing_form.postal_code')}
                            placeholder={translate(
                              'billing_form.postal_code_placeholder',
                            )}
                          >
                            {map(
                              filter(
                                subDistricts,
                                subDistrict =>
                                  subDistrict.subdistrict_id ===
                                  values.subdistrict_id,
                              ),
                              subdistrict => (
                                <option
                                  key={subdistrict.zip_code}
                                  value={subdistrict.zip_code}
                                >
                                  {subdistrict.zip_code}
                                </option>
                              ),
                            )}
                          </FormSelect>
                        </Padding>
                      </Col>
                    </Row>
                  );
                }}
              </SubDistricts>

              <CustomLineSpace />

              <Space xs="10px" />
              <Row>
                <Col xs={12} md={5}>
                  <FormCheckBox
                    name="default_billing"
                    value={this.state.default_billing}
                    label={translate('billing_form.set_billing_default')}
                    checked={this.state.default_billing === true}
                    onChange={() => {
                      this.setState({
                        default_billing: !this.state.default_billing,
                      });
                      setFieldValue(
                        'default_billing',
                        !this.state.default_billing,
                      );
                    }}
                  />
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

BillingAddressForm.propTypes = {
  initialValue: object,
  onSubmit: func,
  submitFunc: func,
};

BillingAddressForm.defaultProps = {
  initialValue: {},
  onSubmit: () => null,
  submitFunc: () => null,
};

export default withLocales(BillingAddressForm);
