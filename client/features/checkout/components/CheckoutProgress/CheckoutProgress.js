import React from 'react';
import pt from 'prop-types';
import styled from 'styled-components';
import withLocales from '../../../../hoc/withLocales';
import { ProcessWizard, Text, Icon } from '@central-tech/core-ui';

const CustomContainer = styled.div`
  padding-left: 40px;
  width: 808px;
`;
const TextStep = styled(Text)`
  padding-top: 3px;
  color: #ffffff;
`;
const IconStepCompleted = styled.div`
  text-align: center;
`;

const Checkoutprogress = ({ translate, step, textPaymentStatus }) => {
  const data = [
    {
      id: 1,
      text:
        step === 1 ? (
          <Text color="#ec1d24">
            {translate('multi_checkout.progress_bar.step_1')}
          </Text>
        ) : (
          translate('multi_checkout.progress_bar.step_1')
        ),
      icon:
        step > 1 ? (
          <IconStepCompleted>
            <Icon src="/assets/icons/checked.svg" />
          </IconStepCompleted>
        ) : (
          <TextStep>1</TextStep>
        ),
    },
    {
      id: 2,
      text:
        step === 2 ? (
          <Text color="#ec1d24">
            {translate('multi_checkout.progress_bar.step_2')}
          </Text>
        ) : (
          translate('multi_checkout.progress_bar.step_2')
        ),
      icon:
        step > 2 ? (
          <IconStepCompleted>
            <Icon src="/assets/icons/checked.svg" />
          </IconStepCompleted>
        ) : (
          <TextStep>2</TextStep>
        ),
    },
    {
      id: 3,
      text:
        step === 3 ? (
          <Text color="#ec1d24">
            {textPaymentStatus
              ? textPaymentStatus
              : translate('multi_checkout.progress_bar.step_3')}
          </Text>
        ) : (
          translate('multi_checkout.progress_bar.step_3')
        ),
      icon: step > 3 && <TextStep>3</TextStep>,
    },
  ];

  return (
    <CustomContainer>
      <ProcessWizard
        data={data}
        currentLevel={step}
        lineActiveColor="#cccccc"
        bulletActiveColor="#ec1d24"
        bulletColor="#666666"
        bulletBorderColor="transparent"
        bulletActiveBorderColor="transparent"
        textPosition="right"
        textSize="13px"
      />
    </CustomContainer>
  );
};

Checkoutprogress.propTypes = {
  step: pt.number.isRequired,
};

export default withLocales(Checkoutprogress);
