import React from 'react';
import styled from 'styled-components';
import { Row, Col, Padding, breakpoint, Icon } from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';
import { get, includes } from 'lodash';
import withLocales from '../../../hoc/withLocales';
import {
  getOneCardMembershipIdFromCustomer,
  getThe1MobileFromCustomer,
  getPhoneNumberFromCustomer,
} from '../../../selectors';

const CustomRow = styled.div`
  display: flex;
  ${breakpoint('xs', 'md')`
        display: block;
    `}
`;

const Box = styled.div`
  flex: 1;
  word-break: break-word;
  ${breakpoint('xs', 'md')`
        width: 100%;
        padding: 0;
        word-break: break-word;
        ${props =>
          props.floatLeftMobile &&
          `
            width: 40%;
            float: left;
            margin-right: 30px;
            border-right: solid 1px #cccccc;
        `}
    `}

  ${breakpoint('md')`
        ${props =>
          props.width &&
          `
            width: ${props.width}
        `}
        ${props =>
          props.borderLeft &&
          `
            border-left: solid 1px #cccccc;
        `}
        ${props =>
          props.padding &&
          `
            padding: ${props.padding}
        `}
        margin-right: 30px;
    `}
`;

const PersonalInfoTitle = styled.div`
  display: flex;
  height: 28px;
  align-items: center;
`;

const Cursor = styled.div`
  cursor: pointer;
`;

const InfomationSection = ({
  customer,
  onEditPersonalInfoClick,
  translate,
}) => {
  const isEmailDummy =
    includes(get(customer, 'email'), '@grab') ||
    includes(get(customer, 'email'), '@dummy');
  return (
    <React.Fragment>
      <Padding xs="30px">
        <Row>
          <Col>
            <Padding xs="10px 0 10px 0">
              <PersonalInfoTitle>
                <TextGuide type="topic" bold>
                  {translate('profile_info.personal.title')}
                </TextGuide>
                <Cursor>
                  <Icon
                    width={10}
                    src="/assets/icons/ic-edit.svg"
                    style={{ marginLeft: 5, marginRight: 2 }}
                  />
                  <TextGuide
                    as="span"
                    type="caption"
                    color="#666"
                    onClick={() => onEditPersonalInfoClick()}
                  >
                    {translate('button.edit')}
                  </TextGuide>
                </Cursor>
              </PersonalInfoTitle>
            </Padding>
          </Col>
        </Row>
        <CustomRow>
          <Box>
            <TextGuide type="caption">
              {' '}
              {translate('profile_info.personal.name')}
            </TextGuide>
            <TextGuide type="callout" bold>{`${get(
              customer,
              'firstname',
            )} ${get(customer, 'lastname')}`}</TextGuide>
          </Box>
          <Box borderLeft floatLeftMobile padding="0 0 0 30px">
            <TextGuide type="caption">
              {translate('profile_info.personal.t1c_no')}
            </TextGuide>
            <TextGuide type="callout" bold>
              {getOneCardMembershipIdFromCustomer(customer) ||
                getThe1MobileFromCustomer(customer) ||
                '-'}
            </TextGuide>
          </Box>
          <Box borderLeft padding="0 0 0 30px">
            <TextGuide type="caption">
              {translate('profile_info.personal.phone')}
            </TextGuide>
            <TextGuide type="callout" bold>
              {getPhoneNumberFromCustomer(customer) || '-'}
            </TextGuide>
          </Box>
          <Box borderLeft padding="0 0 0 30px">
            <TextGuide type="caption">
              {translate('profile_info.personal.email')}
            </TextGuide>
            <TextGuide type="callout" bold>
              {!isEmailDummy ? get(customer, 'email') : '-'}
            </TextGuide>
          </Box>
        </CustomRow>
      </Padding>
    </React.Fragment>
  );
};

export default withLocales(InfomationSection);
