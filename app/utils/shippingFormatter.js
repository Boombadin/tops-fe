import { get as prop } from 'lodash';
import Exploder from '../../client/utils/mcaex';

export const mappingAddressModel = address => {
  const explodeAddress = Exploder.explode(address);
  const formatedAddress = {
    ...address,
    custom_attributes: [
      {
        attribute_code: 'customer_address_type',
        value: prop(explodeAddress, 'customer_address_type', ''),
        name: 'customer_address_type',
      },
      {
        attribute_code: 'house_no',
        value: prop(explodeAddress, 'house_no', ''),
        name: 'house_no',
      },
      {
        attribute_code: 'address_name',
        value: prop(explodeAddress, 'address_name', ''),
        name: 'address_name',
      },
      {
        attribute_code: 'moo',
        value: prop(explodeAddress, 'moo', ''),
        name: 'moo',
      },
      {
        attribute_code: 'village_name',
        value: prop(explodeAddress, 'village_name', ''),
        name: 'village_name',
      },
      {
        attribute_code: 'soi',
        value: prop(explodeAddress, 'soi', ''),
        name: 'soi',
      },
      {
        attribute_code: 'road',
        value: prop(explodeAddress, 'road', ''),
        name: 'road',
      },
      {
        attribute_code: 'building_type',
        value: prop(explodeAddress, 'building_type', ''),
        name: 'building_type',
      },
      {
        attribute_code: 'district',
        value: prop(explodeAddress, 'district', ''),
        name: 'district',
      },
      {
        attribute_code: 'district_id',
        value: prop(explodeAddress, 'district_id', ''),
        name: 'district_id',
      },
      {
        attribute_code: 'subdistrict',
        value: prop(explodeAddress, 'subdistrict', ''),
        name: 'subdistrict',
      },
      {
        attribute_code: 'subdistrict_id',
        value: prop(explodeAddress, 'subdistrict_id', ''),
        name: 'subdistrict_id',
      },
      {
        attribute_code: 'remark',
        value: prop(explodeAddress, 'remark', ''),
        name: 'remark',
      },
    ],
  };

  return formatedAddress;
};

export const mappingNoneAddressModel = address => {
  const explodeAddress = Exploder.explode(address);
  const formatedAddress = {
    custom_attributes: [
      {
        attribute_code: 'district_id',
        value: prop(explodeAddress, 'district_id', ''),
        name: 'district_id',
      },
      {
        attribute_code: 'subdistrict_id',
        value: prop(explodeAddress, 'subdistrict_id', ''),
        name: 'subdistrict_id',
      },
    ],
  };
  return formatedAddress;
};
