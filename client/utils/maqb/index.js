import { values, includes, map, size } from 'lodash';

export const sortDirections = {
  ASCENDING: 'ASC',
  DESCENDING: 'DESC',
};

export const fieldConditions = {
  LESS_THAN: 'lt',
  LESS_THAN_EQUAL: 'lteq',
  GREATER_THAN: 'gt',
  GREATER_THAN_EQUAL: 'gteq',
  MORE_EQUAL: 'moreq',
  EQUAL: 'eq',
  NOT_EQUAL: 'neq',
  LIKE: 'like',
  FINSET: 'finset',
  FROM: 'from', // constrain: should be used with to
  TO: 'to', // constrain: should be used with from
  IN: 'in',
  NOT_IN: 'nin',
  NULL: 'null',
  NOT_NULL: 'notnull',
};

class MAQB {
  constructor() {
    this.fields = [];
    this.fieldsGroup = [];
    this.fieldsIndex = 0;
    this.page_size = 8;
    this.page_number = 1;
    this.sort_orders = [];
  }
  field(name, value, condition = fieldConditions.EQUAL) {
    if (!name || !value) {
      throw new Error('Parameter missing');
    }
    const fieldConditionValues = values(fieldConditions);
    if (!includes(fieldConditionValues, condition)) {
      // This condition is invalid
      throw new Error(
        `${condition} condition is not supported. Use one of ${fieldConditionValues.join(
          ',',
        )}`,
      );
    }

    const field = {
      name,
      value,
      condition,
    };

    this.fields = [...this.fields, field];
    this.fieldsIndex = size(this.fields);

    return this;
  }
  fieldGroup(groupQuery) {
    if (!groupQuery) {
      throw new Error('groupQuery missing');
    }

    const query = [];
    for (let i = 0; i < size(groupQuery); ++i) {
      const filter = groupQuery[i];
      const name = filter.split(',')[0];
      const value = decodeURIComponent(filter.split(',')[1]);
      const condition = filter.split(',')[2];

      const fields = {
        name,
        value,
        condition,
      };

      query.push(fields);
    }

    this.fieldsGroup.push({ query });
    return this;
  }
  sort(field, direction = sortDirections.ASCENDING) {
    if (!field) {
      throw new Error('Field name missing');
    }
    const sortDirectionValues = values(sortDirections);
    if (!includes(sortDirectionValues, direction)) {
      // This direction is invalid
      throw new Error(
        `${direction} is not a valid direction. Valid directions are ${sortDirectionValues.join(
          ',',
        )}`,
      );
    }
    const sortObject = {
      field,
      direction,
    };

    this.sort_orders = [...this.sort_orders, sortObject];

    return this;
  }
  pageSize(size) {
    if (size === undefined || size === null) {
      throw new Error('Params missing');
    }
    if (isNaN(size)) {
      throw new Error('Page size should be a number');
    }
    if (size < 1) {
      throw new Error('Page size is too small. Should be > 0');
    }
    if (!isFinite(size)) {
      throw new Error(
        `I'm going to say what your mom said last night. Too big to handle`,
      );
    }

    const pageSize = typeof size === 'string' ? parseInt(size) : size;

    this.page_size = Math.trunc(pageSize);

    return this;
  }
  size(size) {
    return this.pageSize(size);
  }
  pageNumber(number) {
    if (number === undefined || number === null) {
      throw new Error('Params missing');
    }
    if (isNaN(number)) {
      throw new Error('Page number should be a number');
    }
    if (number < 1) {
      throw new Error('Page number cannot go below 1');
    }
    if (!isFinite(number)) {
      throw new Error(`Please don't. Please. I beg you. Don't`);
    }

    // const pageSize = typeof number === 'string' ? parseInt(number) : number;

    this.page_number = Math.trunc(number);

    return this;
  }
  page(number) {
    return this.pageNumber(number);
  }
  build() {
    const fieldSearchCriterias = this.fields.map((field, index) => {
      return `searchCriteria[filter_groups][${index}][filters][0][field]=${field.name}&searchCriteria[filter_groups][${index}][filters][0][value]=${field.value}&searchCriteria[filter_groups][${index}][filters][0][condition_type]=${field.condition}`;
    });

    if (size(this.fieldsGroup) > 0) {
      map(this.fieldsGroup, val => {
        const index = this.fieldsIndex++;
        map(val.query, (data, key) => {
          fieldSearchCriterias.push(
            `searchCriteria[filter_groups][${index}][filters][${key}][field]=${data.name}&searchCriteria[filter_groups][${index}][filters][${key}][value]=${data.value}&searchCriteria[filter_groups][${index}][filters][${key}][condition_type]=${data.condition}`,
          );
        });
      });
    }

    const sortCriterias = this.sort_orders.map((sortOrder, index) => {
      return `searchCriteria[sortOrders][${index}][field]=${sortOrder.field}&searchCriteria[sortOrders][${index}][direction]=${sortOrder.direction}`;
    });

    const pageSizeCriteria = `searchCriteria[pageSize]=${this.page_size}`;
    const pageNumberCriteria = `searchCriteria[currentPage]=${this.page_number}`;

    const criterias = [
      ...fieldSearchCriterias,
      ...sortCriterias,
      pageSizeCriteria,
      pageNumberCriteria,
    ];

    return criterias.join('&');
  }
}

export default MAQB;
