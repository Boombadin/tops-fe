import React from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import StoreListItem from './components/StoreListItem';
import withStoreLocator from '../../hoc/withStoreLocator';
import withLocales from '../../hoc/withLocales';

const StoreListWrapper = styled.div`
  background: #ffffff;
`;

const StoreLocatorList = ({
  storeLocator,
  selectedStore,
  onStoreSelected,
  translate,
}) => {
  let stores = storeLocator?.items;
  if (storeLocator?.search?.items?.length > 0) {
    stores = storeLocator?.search?.items;
  }

  return (
    <StoreListWrapper>
      {stores.map(store => (
        <StoreListItem
          key={store.id}
          store={store}
          selected={parseInt(selectedStore.id) === parseInt(store.id)}
          onStoreSelected={onStoreSelected}
          translate={translate}
        />
      ))}
    </StoreListWrapper>
  );
};

StoreLocatorList.propTypes = {
  selectedStore: object,
};

StoreLocatorList.defaultProps = {
  selectedStore: {},
};

export default withLocales(withStoreLocator(StoreLocatorList));
