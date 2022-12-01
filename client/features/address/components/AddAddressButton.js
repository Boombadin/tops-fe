import React from 'react';
import styled from 'styled-components';
import { Row, Col, Image, breakpoint } from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';

const AddAddressButtonGreenWrapper = styled.div`
  width: 225px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${breakpoint('lg')`
    justify-content: flex-end;
  `}

  ${breakpoint('xs', 'md')`
    justify-content: flex-start;
  `} 

  ${props =>
    props.floatRight &&
    `
    float: right;
  `}
`;

const AddAddressButtonBlackWrapper = styled.div`
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f3f3f3;
  cursor: pointer;
`;

const PlusCircleIcon = styled.div`
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
  width: 14.7px;
  height: 14.7px;
  padding: 0px;
  margin: ${props => props.margin || '0'};

  background: #ffffff;
  border: 1px solid #80bd00;
  color: #80bd00;
  text-align: center;
  -webkit-transition: background 0.2s linear;
  -moz-transition: background 0.2s linear;
  -ms-transition: background 0.2s linear;
  -o-transition: background 0.2s linear;
  transition: background 0.2s linear;
  transition: color 0.2s linear;
  font-size: 15px;
  line-height: 1em;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled(TextGuide)`
  padding-left: 5px;
  font-family: 'superstoreregular';
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: -0.4px;
  color: #80bd00;
`;

const ButtonBlack = (onAddAddressClick, text) => {
  return (
    <AddAddressButtonBlackWrapper onClick={onAddAddressClick}>
      <Row>
        <Col xs="40px" style={{ alignSelf: 'center' }}>
          <Image src="/assets/icons/round-control-point.svg" lazyload={false} />
        </Col>
        <Col>
          <TextGuide type="topic" bold>
            {text}
          </TextGuide>
        </Col>
      </Row>
    </AddAddressButtonBlackWrapper>
  );
};

const ButtonGreen = (
  onAddAddressClick,
  text,
  floatRight,
  border,
  margin,
  bold,
) => {
  return (
    <AddAddressButtonGreenWrapper
      floatRight={floatRight}
      border={border}
      onClick={onAddAddressClick}
    >
      <PlusCircleIcon margin={margin}>&#43;</PlusCircleIcon>
      <TextGuide
        type="body"
        bold={bold}
        color="#80bd00"
        dangerouslySetInnerHTML={{ __html: `&nbsp ${text}` }}
      />
    </AddAddressButtonGreenWrapper>
  );
};

const AddAddressButton = ({
  theme = 'black',
  onAddAddressClick,
  text,
  floatRight = false,
  border = false,
  margin,
  bold = true,
}) => {
  let button;
  switch (theme) {
    case 'green':
      button = ButtonGreen(
        onAddAddressClick,
        text,
        floatRight,
        border,
        margin,
        bold,
      );
      break;
    default:
      button = ButtonBlack(onAddAddressClick, text);
  }

  return button;
};

export default AddAddressButton;
