import React from 'react';
import { uniqBy, filter, find, get, map } from 'lodash';
import { object, func } from 'prop-types';
import { Formik, Form } from 'formik';
import { FormInput, FormSelect } from '../../components/Form';
import { Row, Col, Padding, Space } from '@central-tech/core-ui';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import * as Yup from 'yup';
import {
  Provinces,
  Districts,
  SubDistricts,
  LocationFinder,
  RegionByPostCode,
} from '../../components/LocationsProvider';
import withLocales from '../../hoc/withLocales';

const CustomLineSpace = styled.div`
  height: 1px;
  border-bottom: 1px dashed #e8e8e8;
  margin: 10px -10px 10px;
`;

const validateSchema = translate => {
  return Yup.object().shape({
    telephone: Yup.string()
      .matches(/^[0-9]*$/, translate('address_form.required_field_format'))
      .min(9, translate('address_form.required_field_format'))
      .max(15, translate('address_form.required_field_format'))
      .required(translate('address_form.required_field')),
    firstname: Yup.string()
      .trim('This field must not be whitespace')
      .max(100, 'Limit 100 character')
      .required(translate('address_form.required_field')),
    lastname: Yup.string()
      .trim('This field must not be whitespace')
      .max(100, 'Limit 100 character')
      .required(translate('address_form.required_field')),
    house_no: Yup.string().required(translate('address_form.required_field')),
    region_id: Yup.string().required(translate('address_form.required_field')),
    district_id: Yup.string().required(
      translate('address_form.required_field'),
    ),
    subdistrict_id: Yup.string().required(
      translate('address_form.required_field'),
    ),
    postcode: Yup.string().required(translate('address_form.required_field')),
  });
};

const buildingType = [
  {
    name: 'บ้านเดี่ยว',
    value: 'detached_house',
  },
  {
    name: 'ทาวน์เฮาส์',
    value: 'townhouse',
  },
  {
    name: 'คอนโดมิเนียม',
    value: 'condominium',
  },
  {
    name: 'อาคารสำนักงาน',
    value: 'office_building',
  },
];

const defaultValues = {
  firstname: '',
  lastname: '',
  telephone: '',
  building_type: '',
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
  customer_address_type: 'shipping',
  street: ['N/A'],
  city: 'N/A',
};

const AddressForm = ({ initialValue, onSubmit, submitFunc, translate }) => (
  <Formik
    initialValues={{ ...defaultValues, ...initialValue }}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    }}
    validationSchema={validateSchema(translate)}
  >
    {({ submitForm, values, setFieldValue }) => {
      submitFunc && submitFunc(submitForm);
      return (
        <Form noValidate autoComplete="off">
          <TextGuide type="callout" bold>
            {translate('address_form.receiver_info')}
          </TextGuide>
          <Space xs="10px" />
          <Row>
            <Col xs={12} sm={4}>
              <Padding xs="0" sm="0 10px 0 0">
                <FormInput
                  type="text"
                  name="firstname"
                  label={translate('address_form.first_name')}
                  placeholder={translate('address_form.first_name')}
                  required
                />
              </Padding>
            </Col>
            <Col xs={12} sm={4}>
              <Padding xs="0" sm="0 10px 0 0">
                <FormInput
                  type="text"
                  name="lastname"
                  label={translate('address_form.last_name')}
                  placeholder={translate('address_form.last_name')}
                  required
                  option
                />
              </Padding>
            </Col>
            <Col xs={12} sm={4}>
              <Padding xs="0" sm="0 10px 0 0">
                <FormInput
                  type="text"
                  name="telephone"
                  label={translate('address_form.mobile_no')}
                  placeholder="000-000-0000"
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
          <CustomLineSpace />
          <TextGuide type="callout" bold>
            {translate('address_form.address_info')}
          </TextGuide>
          <Space xs="10px" />
          <Row>
            <Col xs={12} md="200px">
              <LocationFinder
                textBtn={translate('address_form.search_current_location')}
              >
                {({ data: { locations = [] }, loading }) => {
                  let locationPostcode = '';
                  if (loading) {
                    locationPostcode = '';
                  } else {
                    const firstLocation = get(
                      locations,
                      '0.address_components',
                      {},
                    );
                    locationPostcode = get(
                      find(
                        firstLocation,
                        location => get(location, 'types.0') === 'postal_code',
                      ),
                      'short_name',
                    );
                  }

                  return (
                    <RegionByPostCode
                      postcode={locationPostcode}
                      onCompleted={data => {
                        if (data) {
                          setFieldValue('region_id', '');
                          setFieldValue('district_id', '');
                          setFieldValue('subdistrict_id', '');
                          setFieldValue('postcode', '');
                          setFieldValue('region_id', String(data.region_id));
                          setFieldValue(
                            'district_id',
                            String(get(data, 'district.0.district_id')),
                          );
                          setFieldValue(
                            'subdistrict_id',
                            String(
                              get(
                                data,
                                'district.0.subdistrict.0.subdistrict_id',
                              ),
                            ),
                          );
                          setFieldValue(
                            'district',
                            get(data, 'district.0.name'),
                          );
                          setFieldValue('region', data.name);
                          setFieldValue(
                            'subdistrict',
                            get(data, 'district.0.subdistrict.0.name'),
                          );
                          setFieldValue('postcode', locationPostcode);
                        }
                      }}
                    />
                  );
                }}
              </LocationFinder>
            </Col>
          </Row>
          <Space xs="10px" />
          <Row>
            <Col xs={12} sm={4}>
              <Padding xs="0" sm="0 10px 0 0">
                <FormSelect
                  name="building_type"
                  label={translate('address_form.building_type')}
                  placeholder={translate(
                    'address_form.building_type_placeholder',
                  )}
                >
                  {buildingType &&
                    buildingType.map(type => (
                      <option key={type.value} value={type.value}>
                        {/* {type.name} */}
                        {translate(
                          `address_form.building_type_list.${type.value}`,
                        )}
                      </option>
                    ))}
                </FormSelect>
              </Padding>
            </Col>
            <Col xs={6} sm={3.5}>
              <Padding xs="0 10px 0 0">
                <FormInput
                  type="text"
                  name="house_no"
                  label={translate('address_form.house_no')}
                  placeholder={translate('address_form.house_no_placeholder')}
                  required
                />
              </Padding>
            </Col>
            <Col xs={6} sm={3.5}>
              <FormInput
                type="text"
                name="moo"
                label={translate('address_form.moo')}
                placeholder={translate('address_form.moo')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={4}>
              <Padding sm="0 10px 0 0">
                <FormInput
                  type="text"
                  name="village_name"
                  label={translate('address_form.building_name')}
                  placeholder={translate(
                    'address_form.building_name_placeholder',
                  )}
                />
              </Padding>
            </Col>
            <Col xs={12} sm={4}>
              <Padding sm="0 10px 0 0">
                <FormInput
                  type="text"
                  name="soi"
                  label={translate('address_form.soi')}
                  placeholder={translate('address_form.soi')}
                />
              </Padding>
            </Col>
            <Col xs={12} sm={4}>
              <FormInput
                type="text"
                name="road"
                label={translate('address_form.street')}
                placeholder={translate('address_form.street')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={5}>
              <Padding sm="0 10px 0 0">
                <Provinces onlyDeliveryAvailiable>
                  {({ data: { provinces = [] }, loading }) => {
                    return (
                      <FormSelect
                        required
                        name="region_id"
                        label={translate('address_form.province')}
                        placeholder={translate(
                          'address_form.province_placeholder',
                        )}
                        disabled={loading}
                        onChange={e => {
                          const selectedProvinceName = get(
                            find(
                              provinces,
                              province => province.region_id === e.target.value,
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
                <Districts regionId={values.region_id} onlyDeliveryAvailiable>
                  {({ data: { districts = [] }, loading }) => {
                    return (
                      <FormSelect
                        required
                        name="district_id"
                        label={translate('address_form.district')}
                        placeholder={translate(
                          'address_form.district_placeholder',
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
            onlyDeliveryAvailiable
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
                        label={translate('address_form.sub_district')}
                        placeholder={translate(
                          'address_form.sub_district_placeholder',
                        )}
                        disabled={loading}
                        onChange={e => {
                          const selectedSubDistrictName = get(
                            find(
                              subDistricts,
                              subDistrict =>
                                subDistrict.subdistrict_id === e.target.value,
                            ),
                            'name',
                          );
                          setFieldValue('subdistrict_id', e.target.value);
                          setFieldValue('subdistrict', selectedSubDistrictName);
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
                        label={translate('address_form.postal_code')}
                        placeholder={translate(
                          'address_form.postal_code_placeholder',
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
          <TextGuide type="callout" bold>
            {translate('address_form.more_detail')}
          </TextGuide>
          <Space xs="10px" />
          <Row>
            <Col xs={12} md={5}>
              <Padding xs="0 10px 0 0">
                <FormInput
                  type="text"
                  name="address_name"
                  label={translate('address_form.address_name')}
                  placeholder={translate(
                    'address_form.address_name_placeholder',
                  )}
                />
              </Padding>
            </Col>
            <Col xs={12} md={7}>
              <Padding xs="0 10px 0 0">
                <FormInput
                  type="text"
                  name="remark"
                  label={translate('address_form.notic')}
                  placeholder={translate('address_form.notic_placeholder')}
                />
              </Padding>
            </Col>
          </Row>
        </Form>
      );
    }}
  </Formik>
);

AddressForm.propTypes = {
  initialValue: object,
  onSubmit: func,
  submitFunc: func,
};

AddressForm.defaultProps = {
  initialValue: {},
  onSubmit: () => null,
  submitFunc: () => null,
};

export default withLocales(AddressForm);
