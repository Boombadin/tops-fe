export const transform = category => {
  return {
    ...category,
    id: parseInt(category.entity_id),
    is_active: category.is_active == 1,
    position: parseInt(category.position),
    level: parseInt(category.level),
    parent_id: parseInt(category.parent_id),
    include_in_menu: category.include_in_menu == 1,
    extension_attributes: {
      product_count: category.product_count,
    },
    is_alcohol_restriction: parseInt(category.is_alcohol_restriction),
  };
};

export function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
}
