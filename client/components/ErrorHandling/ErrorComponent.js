import React from 'react';
import styled from 'styled-components';
import { func, string } from 'prop-types';
import { Icon } from '../../magenta-ui';
import { withTranslate } from '../../utils/translate';

export const Paragraph = styled.p`
  color: ${props => props.color || '#333'};
  font-size: ${props => (props.size ? `${props.size}px` : '13px')};
  font-weight: ${props => (props.type ? props.type : 'normal')};
  ${props => (props.align ? `text-align: ${props.align}` : '')};
  padding: ${props => props.padding || '0'};
`;

const FlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 50px 5px;
`;
const TextLink = styled.a`
  text-decoration: underline;
  color: #007aff;
  cursor: pointer;
`;
const ErrorComponent = ({ onReload, message, translate }) => (
  <FlexCenter>
    <Paragraph align="center">
      <Icon name="warning sign" size="big" color="grey" />
    </Paragraph>
    <Paragraph align="center" color="#666">
      <div>{translate('common.data_not_load')}</div>
      <div>{message}</div>
    </Paragraph>
    {onReload && <TextLink onClick={onReload}>{translate('common.try_again')}</TextLink>}
  </FlexCenter>
);

ErrorComponent.propTypes = {
  onReload: func,
  message: string,
};

ErrorComponent.defaultProps = {
  message: '',
  onReload: null,
};

export default withTranslate(ErrorComponent);
