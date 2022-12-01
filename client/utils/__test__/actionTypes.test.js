import { asyncActionTypes } from '../actionTypes';

describe('Test asyncActionTypes function', () => {
  test('Verify action type with mockupData', () => {
    const result = asyncActionTypes('FETCH_ALL_CATEGORY');

    expect(result).toEqual({
      REQUEST: 'FETCH_ALL_CATEGORY_REQUEST',
      SUCCESS: 'FETCH_ALL_CATEGORY_SUCCESS',
      FAILURE: 'FETCH_ALL_CATEGORY_FAILURE',
    });
  });
});
