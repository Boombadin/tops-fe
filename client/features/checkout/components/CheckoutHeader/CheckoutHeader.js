import React from 'react';
import { noop } from 'lodash';
import styled from 'styled-components';
import pt from 'prop-types';
import CheckoutProgress from '../CheckoutProgress';
import withLocales from '../../../../hoc/withLocales';
import {
  Container,
  Row,
  Text,
  Col,
  HideDesktop,
  Icon,
  breakpoint,
  Image,
  Padding,
} from '@central-tech/core-ui';
import { TextGuide } from '../../../../components/Typography';

const LOGO = '/assets/images/tops-logo.svg';
const HeaderWrapper = styled.div`
  height: 90px;
  background: #fff;
  border: solid 1px #cccccc;
  display: flex;
  align-items: center;
  ${breakpoint('xs', 'md')`
    height: 60px;
  `}
`;
const DeleteAll = styled(Text)`
  cursor: pointer;
`;
const MobileStep = styled.div`
  display: flex;
  align-items: center;
`;
const Show = styled.div`
  display: none;
  ${props => breakpoint(props.from, props.to)`
    display: block;
  `}
`;
const MobileTextStep = styled.div``;

const CheckoutHeader = ({
  step,
  isMobile,
  onDeleteAll,
  translate,
  handleClickBack,
  backText,
  isBackButton,
  textPaymentStatus,
  lang,
}) => {
  let stepNo = step;
  if (isMobile) {
    if (step === 2) {
      stepNo = 3;
    } else if (step === 3) {
      stepNo = 4;
    }
  }

  return (
    <HeaderWrapper>
      <Container>
        <Show from="md">
          <Row>
            <Col md="77px;">
              <a href={`/${lang.url}`} title="Tops Online">
                <Image
                  src={LOGO}
                  alt="Tops online ท็อปส์ออนไลน์"
                  width="77px"
                  lazyload={false}
                />
              </a>
            </Col>
            <Col>
              <CheckoutProgress
                step={step}
                textPaymentStatus={textPaymentStatus}
              />
            </Col>
          </Row>
        </Show>
        <HideDesktop>
          <Row>
            <Col padding="8px 20px">
              <MobileStep>
                {isBackButton && (
                  <Icon
                    src="/assets/icons/round-arrow-back.svg"
                    style={{ marginRight: 16 }}
                    height={16}
                    onClick={() => handleClickBack()}
                  />
                )}
                <MobileTextStep>
                  <TextGuide type="topic" bold>
                    {backText}
                  </TextGuide>
                  <TextGuide type="caption-2" color="#666666">
                    {translate('multi_checkout.mobile_header.step', {
                      step: stepNo,
                    })}
                  </TextGuide>
                </MobileTextStep>
              </MobileStep>
            </Col>
            {onDeleteAll && step === 1 && (
              <Col align="right">
                <Padding
                  xs="33px 20px 0 0"
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Icon
                    src="/assets/icons/round-delete.svg"
                    style={{ marginRight: 3 }}
                    width={8}
                  />
                  <DeleteAll size={11} onClick={onDeleteAll}>
                    <TextGuide type="caption-2" color="#666666">
                      {translate('multi_checkout.mobile_header.delete_all')}
                    </TextGuide>
                  </DeleteAll>
                </Padding>
              </Col>
            )}
          </Row>
        </HideDesktop>
      </Container>
    </HeaderWrapper>
  );
};

CheckoutHeader.propTypes = {
  step: pt.number.isRequired,
  onDeleteAll: pt.func,
  handleClickBack: pt.func,
  backText: pt.string,
  isMobile: pt.bool,
  isBackButton: pt.bool,
};

CheckoutHeader.defaultProps = {
  onBackClick: noop,
  handleClickBack: noop,
  backText: '',
  isMobile: false,
  isBackButton: true,
};

export default withLocales(CheckoutHeader);
