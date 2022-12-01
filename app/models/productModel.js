import { map, orderBy, get } from 'lodash';

const products = ({
  items,
  filters,
  sorting,
  total_count,
  search_criteria,
}) => {
  const sortOrder = ['promotion_type', 'country_of_product', 'brand_name'];

  const productsSchema = {
    items: items,
    filters: orderBy(
      filters.map(filter => {
        const filterAttr = filter.attribute_code;
        const indexOfCurrentFilter = sortOrder.indexOf(filterAttr);
        const filterPositionTransform =
          indexOfCurrentFilter === -1 ? 999 : indexOfCurrentFilter;

        const isBrandFilter = filter.attribute_code === 'brand_name';
        const filterItem = get(filter, 'items', []);
        const filterItemTransform = isBrandFilter
          ? orderBy(filterItem.slice(0, 50), 'label', 'asc')
          : filterItem;

        const isCategoryFilter = filter.attribute_code === 'category_id';
        const attributeCodeTransform = isCategoryFilter
          ? 'cat'
          : filter.attribute_code;

        return {
          attribute_code: attributeCodeTransform,
          items: map(filterItemTransform, item => {
            return {
              item_count: item.count,
              label: item.label,
              value: item.value,
              custom_attributes: item.custom_attributes,
            };
          }),
          name: filter.name,
          position: filterPositionTransform,
        };
      }),
      'position',
      'asc',
    ),
    sorting: sorting,
    total_count: total_count,
    search_criteria: search_criteria,
  };

  return productsSchema;
};

export default {
  products,
};
