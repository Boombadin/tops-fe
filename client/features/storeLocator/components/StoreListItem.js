import React from 'react';
import styled from 'styled-components';
import { TextGuide } from '../../../components/Typography';
import { ButtonRadio } from '../../../components/ButtonRadio';
import { storeAddressBuilder } from '../utils';
import { Row, Col } from '@central-tech/core-ui';

const StoreListItemWrapper = styled.div`
  padding: 14px 20px 10px;
  background: #ffffff;
  border-bottom: 1px solid #f3f3f3;
  min-height: 76px;
`;

const StoreListItem = ({ store, selected, onStoreSelected, translate }) => {
  return (
    <StoreListItemWrapper onClick={() => onStoreSelected(store)}>
      <Row>
        <Col xs="40px" style={{ alignSelf: 'center' }}>
          <ButtonRadio name={store.id} checked={selected} />
        </Col>
        <Col xs="auto">
          <TextGuide type="callout" bold>
            {store.name}
          </TextGuide>
          <TextGuide
            type="caption"
            padding="0 100px 0 0"
            dangerouslySetInnerHTML={{
              __html: storeAddressBuilder(store, false, translate),
            }}
          />
        </Col>
      </Row>
    </StoreListItemWrapper>
  );
};

export default StoreListItem;
