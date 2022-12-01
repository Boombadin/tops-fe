import React from 'react';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import withLocales from '@client/hoc/withLocales';

import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '../../../utils/generateElementId';

const CardBox = styled.div`
  flex: 0 0 100%;
`;
const CardBoxInside = styled.div`
  display: flex;
  min-height: 48px;
  padding: 0 15px;
  font-size: 13px;
  position: relative;
`;
const CardInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const CardInfoBank = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;
const CardDefault = styled.div`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  margin-right: 14px;
`;
const CardDefaultIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const CardTypeIcon = styled.div`
  width: 32px;
  height: 20px;
  display: flex;
  align-items: center;
  margin-right: 17px;
  & img {
    max-width: 32px;
  }
`;
const BankName = styled(TextGuide)`
  color: #171722;
  margin-right: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const DefaultText = styled(TextGuide)`
  flex: 0 0 auto;
`;
const CardNumber = styled.div`
  flex: 0 0 auto;
  margin-left: 15px;
`;

const SavedCreditCardListItem = ({
  translate,
  card,
  isCanBeSelect = false,
  selectedCard,
  bankName,
  onSelectCard = () => {},
}) => {
  const isCardSelected = isCanBeSelect ? selectedCard?.id === card?.id : false;
  if (bankName === '') {
    bankName = '';
  } else if (bankName === null || bankName === 'undefined') {
    bankName = translate('payment.credit_card.other_card');
  }
  return (
    <CardBox
      data-testid={generateTestId({
        type: ELEMENT_TYPE.INFO,
        action: ELEMENT_ACTION.VIEW,
        moduleName: 'SavedCreditCardListItem',
        uniqueId: 'Container',
      })}
    >
      <CardBoxInside
        onClick={() => {
          onSelectCard(card);
        }}
        data-testid={generateTestId({
          type: ELEMENT_TYPE.BUTTON,
          action: ELEMENT_ACTION.EDIT,
          moduleName: 'SavedCreditCardListItem',
          uniqueId: 'OnSetSelectCard',
        })}
      >
        <CardInfo>
          <CardInfoBank>
            <CardDefault>
              {isCardSelected && (
                <CardDefaultIcon
                  data-testid={generateTestId({
                    type: ELEMENT_TYPE.IMAGE,
                    action: ELEMENT_ACTION.VIEW,
                    moduleName: 'SavedCreditCardListItem',
                    uniqueId: 'DefaultCard',
                  })}
                  src="/assets/icons/red-checked.svg"
                />
              )}
            </CardDefault>
            <CardTypeIcon>
              <img src={card?.typeIcon} />
            </CardTypeIcon>
            <BankName
              data-testid={generateTestId({
                type: ELEMENT_TYPE.INFO,
                action: ELEMENT_ACTION.VIEW,
                moduleName: 'SavedCreditCardListItem',
                uniqueId: 'BankName',
              })}
              type="body"
            >
              {bankName}
            </BankName>
            {card?.isDefault && (
              <DefaultText type="body" color={'#b4b8c1'}>
                {translate('payment.credit_card.card_list_default')}
              </DefaultText>
            )}
          </CardInfoBank>
          <CardNumber>
            {card?.maskedNumberByStar.substr(
              card?.maskedNumberByStar.length - 6,
              6,
            )}
          </CardNumber>
        </CardInfo>
      </CardBoxInside>
    </CardBox>
  );
};

export default withLocales(SavedCreditCardListItem);
