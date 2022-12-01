import React from 'react';
import styled from 'styled-components';
import { Padding, Text, Icon, breakpoint } from '@central-tech/core-ui';
import withLocales from '../../../hoc/withLocales';

const LineShowMoreItems = styled(Text)`
  width: 100%;
  height: 15px;
  min-height: 1px;
  text-align: center;
  border-bottom: solid 1px #e9e9e9;
  line-height: 0.1em;
  display: flex;
  justify-content: center;
  background-color: #ffffff;

  span {
    width: 200px;
    height: 30px;
    border-radius: 15px;
    border: solid 1px #bfbfbf;
    background-color: #ffffff;
    padding: 0 10px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;
const ShowMoreItemContainer = styled.div`
  position: absolute;
  bottom: ${({ showMore }) => (showMore ? '12px' : 0)};
  left: 0;
  right: 0;
  ${breakpoint('xs', 'md')`
    bottom: ${({ showMore }) => (showMore ? '19px' : 0)};
  `}
`;

const ShowMoreItemButton = styled.div`
  background-color: #ffffff;
  padding: 0 0 38px;
`;
const ShowMoreItemBgGradient = styled.div`
  width: 100%;
  height: 79px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
`;

const ShowMoreItem = ({ translate, showMore, handleShowMore }) => {
  return (
    <Padding xs="0" md="20px">
      <ShowMoreItemContainer showMore={showMore}>
        {!showMore && <ShowMoreItemBgGradient />}
        <ShowMoreItemButton>
          <LineShowMoreItems as="h2" onClick={() => handleShowMore()}>
            <Text
              as="span"
              color="#808080"
              size={13}
              lineHeight="22px"
              display="flex"
            >
              {!showMore ? (
                <React.Fragment>
                  <Padding xs="0 3.5px 0 0">
                    {translate('cart.show_more_item')}
                  </Padding>
                  <Icon
                    src="/assets/icons/round-arrow-down.svg"
                    width={12}
                    height={8}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Padding xs="0 3.5px 0 0">
                    {translate('cart.hide_item')}
                  </Padding>
                  <Icon
                    src="/assets/icons/round-arrow-up.svg"
                    width={12}
                    height={8}
                  />
                </React.Fragment>
              )}
            </Text>
          </LineShowMoreItems>
        </ShowMoreItemButton>
      </ShowMoreItemContainer>
    </Padding>
  );
};

export default withLocales(ShowMoreItem);
