const explode = (entity, options) => {
  const defaultOptions = {
    explodeOption: false,
  };

  const mainOptions = Object.assign({}, defaultOptions, options);

  if (!entity) {
    throw new Error('Parameter missing');
  }

  if (typeof entity !== 'object') {
    throw new Error('Entity is not an object');
  }

  const customAttributes = entity.custom_attributes || [];
  // if (!customAttributes) {
  //   throw new Error('Cannot explode because custom_attributes does not exist in entity');
  // }

  const explodedSegment = {};
  customAttributes.map(attr => {
    const key = attr.attribute_code;
    const { value } = attr;
    return (explodedSegment[key] = value);
  });

  const mutableEntity = { ...entity };
  delete mutableEntity.custom_attributes;

  // Explode Options
  if (mainOptions.explodeOption) {
    const customAttributesOptions = entity.custom_attributes_option || [];

    customAttributesOptions.map(attr => {
      const key = attr.attribute_code;
      const { value } = attr;
      if (key !== 'weight_item_ind') {
        return (explodedSegment[key] = value);
      }
    });

    delete mutableEntity.custom_attributes_option;
  }

  return {
    ...mutableEntity,
    ...explodedSegment,
  };
};

export default {
  explode,
};
