import React from 'react';

import withLocales from '@client/hoc/withLocales';

export const OrderAddress = ({ translate, shipping_assignments }) => {
  const shippingAddress = shipping_assignments[0]?.shipping?.address || {};
  const customAttributes =
    shippingAddress?.extension_attributes?.custom_attributes || [];
  const shippingMethod = shipping_assignments[0]?.shipping?.method || '';

  let addressName = '';
  let address = '';

  customAttributes.map(resp => {
    if (
      resp?.attribute_code === 'moo' &&
      resp?.value !== '' &&
      resp?.value !== null
    ) {
      address += `${translate('shipping_address.prefix_moo')} ${resp.value} `;
    }
    if (
      resp?.attribute_code === 'soi' &&
      resp?.value !== '' &&
      resp?.value !== null
    ) {
      address += `${translate('shipping_address.prefix_soi')} ${resp?.value} `;
    }
    if (
      resp?.attribute_code === 'address_name' &&
      resp?.value !== '' &&
      resp?.value !== null
    ) {
      addressName = resp?.value;
    }
    if (
      (resp?.attribute_code === 'house_no' &&
        resp?.value !== '' &&
        resp?.value !== null) ||
      (resp?.attribute_code === 'village_name' &&
        resp?.value !== '' &&
        resp?.value !== null) ||
      (resp?.attribute_code === 'road' &&
        resp?.value !== '' &&
        resp?.value !== null) ||
      (resp?.attribute_code === 'district' &&
        resp?.value !== '' &&
        resp?.value !== null) ||
      (resp?.attribute_code === 'subdistrict' &&
        resp?.value !== '' &&
        resp?.value !== null)
    ) {
      address += `${resp?.value} `;
    }
  });

  address += `${shippingAddress?.region || ''} ${shippingAddress?.postcode ||
    ''}`;

  return (
    <span className="address">
      {shippingMethod === 'pickupatstore_tops' ? addressName : address}
    </span>
  );
};

export default withLocales(OrderAddress);
