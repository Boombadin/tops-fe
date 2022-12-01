import { addressStringBuilder } from '../index';

describe('Address util', () => {
  describe('when address is emptyObject', () => {
    test('It should be expect ``', () => {
      const address = {};
      const showAddressName = false;
      const lang = 'th_TH';
      const recieved = addressStringBuilder(address, showAddressName, lang);
      const expected = '';
      expect(recieved).toBe(expected);
    });
  });
  describe('when address is address = mockAddress & showAddressName = true', () => {
    test('It should be expect `บ้านสีลม 123 หมู่ 1 บ้านสีลม ซอยสีลม19 ถนนสีลม บางรัก, บางรัก, กรุงเทพ 10500`', () => {
      const mockAddress = {
        address_name: 'บ้านสีลม',
        house_no: '123',
        moo: '1',
        village_name: 'บ้านสีลม',
        soi: 'สีลม19',
        road: 'สีลม',
        subdistrict: 'บางรัก',
        district: 'บางรัก',
        region: { region: 'กรุงเทพ' },
        postcode: '10500',
      };
      const address = mockAddress;
      const showAddressName = true;
      const lang = 'th_TH';
      const recieved = addressStringBuilder(address, showAddressName, lang);
      const expected =
        'บ้านสีลม 123 หมู่ 1 บ้านสีลม ซอยสีลม19 ถนนสีลม บางรัก, บางรัก, กรุงเทพ 10500';
      expect(recieved).toBe(expected);
    });
  });
});
