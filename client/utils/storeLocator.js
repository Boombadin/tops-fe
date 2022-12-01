import levenshtein from 'fast-levenshtein';
import includes from 'lodash/includes';
import reduce from 'lodash/reduce';
import orderBy from 'lodash/orderBy';

export function filterStoreWithContain(stores, search) {
  const storesFilter = reduce(
    stores,
    (result, store) => {
      let storeName = store?.name || '';
      storeName = storeName.split(/,(.+)/)[0];

      const corresponding = includes(
        storeName.toLowerCase(),
        search.toLowerCase(),
      );

      if (corresponding) {
        result.push(store);
      }

      return result;
    },
    [],
  );

  return storesFilter;
}

export function filterStoreWithLevenshtein(stores, search) {
  const storesFilter = reduce(
    stores,
    (result, store) => {
      let storeName = store?.name || '';
      storeName = storeName.split(/,(.+)/)[0];

      const corresponding = levenshtein.get(storeName, search, {
        useCollator: true,
      });
      const percent = Math.ceil(
        ((storeName.length - corresponding) / storeName.length) * 100,
      );

      if (percent > 10) {
        const updatePercent = { ...store, percent };
        result.push(updatePercent);
      }

      return result;
    },
    [],
  );

  return storesFilter;
}
