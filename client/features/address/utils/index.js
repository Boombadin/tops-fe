import { get, isEmpty } from 'lodash';

const translate = {
  th_TH: {
    moo: 'หมู่',
    soi: 'ซอย',
    road: 'ถนน',
  },
  en_US: {
    moo: 'moo ',
    soi: 'soi ',
    road: ' road',
  },
};

export const addressStringBuilder = (
  address = {},
  showAddressName = false,
  lang = 'th_TH',
) => {
  if (!isEmpty(address)) {
    let road = '';
    if (get(address, 'road')) {
      if (lang === 'th_TH') {
        road = `${translate.th_TH.road}${get(address, 'road', '')}`;
      } else {
        road = `${get(address, 'road', '')} ${translate.en_US.road}`;
      }
    }
    const addressName = showAddressName ? get(address, 'address_name', '') : '';
    const houseNo = get(address, 'house_no', '');
    const moo = get(address, 'moo')
      ? `${get(translate, `${lang}.moo`)} ${get(address, 'moo', '')}`
      : '';
    const villageName = get(address, 'village_name', '');
    const soi = get(address, 'soi')
      ? `${get(translate, `${lang}.soi`)}${get(address, 'soi', '')}`
      : '';
    const subdistrict = get(address, 'subdistrict', '');
    const district = get(address, 'district', '');
    const region = get(address, 'region.region', '');
    const postcode = get(address, 'postcode', '');
    return [
      addressName,
      houseNo,
      moo,
      villageName,
      soi,
      road,
      subdistrict ? `${subdistrict},` : '',
      district ? `${district},` : '',
      region,
      postcode,
    ].join(' ');
  }
  return '';
};
