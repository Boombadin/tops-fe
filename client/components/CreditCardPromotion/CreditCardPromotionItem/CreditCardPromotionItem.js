import React from 'react';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';
const CardBox = styled.div`
  flex: 0 0 100%;
`;
const CardBoxInside = styled.div`
  display: flex;
  /* min-height: 48px; */
  height: auto;
  padding: 15px;
  font-size: 13px;
  position: relative;
`;
const CardInfo = styled.div`
  width: 100%;
  display: block;
`;
const CardInfoBank = styled.div`
  display: flex;
  align-items: center;
`;
const CardDefault = styled.div`
  width: 16px;
  height: 16px;
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
`;
const BankName = styled(TextGuide)`
  color: #171722;
  margin-right: 5px;
`;
const CardDesc = styled.div`
  padding: 10px 0 0 30px;
`;

const CreditCardPromotionItem = ({
  card,
  isSelectedCard,
  lang,
  onSelectCard = () => {},
}) => {
  return (
    <CardBox
      data-testid={generateTestId({
        type: ELEMENT_TYPE.INFO,
        action: ELEMENT_ACTION.VIEW,
        moduleName: 'CreditCardPromotionItem',
        uniqueId: 'Container',
      })}
    >
      <CardBoxInside
        onClick={() => {
          onSelectCard(card?.card_code);
        }}
        data-testid={generateTestId({
          type: ELEMENT_TYPE.BUTTON,
          action: ELEMENT_ACTION.EDIT,
          moduleName: 'CreditCardPromotionItem',
          uniqueId: 'OnSetSelectCard',
        })}
      >
        <CardInfo>
          <CardInfoBank>
            <CardDefault
              data-testid={generateTestId({
                type: ELEMENT_TYPE.IMAGE,
                action: ELEMENT_ACTION.VIEW,
                moduleName: 'CreditCardPromotionItem',
                uniqueId: 'DefaultCard',
              })}
            >
              <CardDefaultIcon
                src={`${
                  isSelectedCard === card?.card_code
                    ? '/assets/icons/red-checked.svg'
                    : '/assets/icons/none-checked.svg'
                }`}
              />
            </CardDefault>
            <CardTypeIcon>
              <img width="100%" src={card?.card_icon} />
            </CardTypeIcon>
            <BankName type="body" bold>
              {card?.card_title?.[lang?.url]}
            </BankName>
          </CardInfoBank>
          <CardDesc
            dangerouslySetInnerHTML={{
              __html: card?.card_promotion_description?.web?.[
                lang?.url
              ]?.replace(/(?:\\r\\n|\\r|\\n)/g, '<br />'),
            }}
          />
        </CardInfo>
      </CardBoxInside>
    </CardBox>
  );
};

export default withLocales(CreditCardPromotionItem);
