import { checkLimitQty, validURL } from '../order';

describe('@client/utils/order', () => {
  test('Verify limit qty 199 when reorder sum qty > 199', () => {
    const mockData = [
      {
        qty: 199,
        type_id: 'simple',
      },
      {
        qty: 1,
        qty_per_pack: 6,
        type_id: 'bundle',
      },
    ];

    const result = checkLimitQty(mockData);

    expect(result).toEqual(true);
  });

  test('Verify limit qty 199 when reorder sum qty empty', () => {
    const mockData = [
      {
        type_id: 'simple',
      },
      {
        qty: 1,
        qty_per_pack: 6,
        type_id: 'bundle',
      },
    ];

    const result = checkLimitQty(mockData);

    expect(result).toEqual(false);
  });

  test('Verify url protocol https or http', () => {
    expect(validURL('https://www.google.co.th')).toEqual(true);
    expect(validURL('http://www.google.co.th')).toEqual(true);
    expect(validURL('www.google.co.th')).toEqual(false);
  });
});
