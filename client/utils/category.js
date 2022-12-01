import { filter } from 'lodash';

export const getActiveCategoryList = categories => {
  return filter(categories, cate => {
    if (cate.level === 2)
      return cate.is_active && cate.include_in_menu === true;
    return cate.is_active && cate.include_in_menu === true;
  });
};
