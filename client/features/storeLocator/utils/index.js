import { get, find, isEmpty } from 'lodash';

export const storeAddressBuilder = (store, showAddress = false, translate) => {
  if (translate) {
    const message = get(
      find(get(store, 'custom_attributes'), attr => attr.attribute_code === 'description'),
      'value',
    );
    const telephone = get(
      find(get(store, 'custom_attributes'), attr => attr.attribute_code === 'contact_phone'),
      'value',
    );

    const storeAddress = get(store, 'extension_attributes.address', '');
    const address = `${get(storeAddress, 'street', '')} ${get(
      storeAddress,
      'district',
      '',
    )} ${get(storeAddress, 'region', '')} ${get(storeAddress, 'postcode', '')}`;

    let str = '';

    if (message) str += `${message}<br />`;
    if (telephone) str += `${translate('checkout_delivery.tel')} ${telephone}<br />`;
    if (showAddress && !isEmpty(address)) str += `${translate('checkout_delivery.address')} ${address}`;

    return str;
  }
};
