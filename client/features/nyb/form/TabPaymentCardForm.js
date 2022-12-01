import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Radio } from 'semantic-ui-redux-form-fields';
import styled from 'styled-components';
import { Form } from '../../../magenta-ui';
import { Text } from '../../../components/Typography';
import { withTranslate } from '../../../utils/translate';

const RadioControl = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  @media (min-width: 991px) {
    width: 350px;
  }
  margin-bottom: ${props => props.marginBottom || '-10px'};
`;
const Flex = styled.div`
  flex-direction: column;
  flex: 2;
  margin-top: -5px;
`;

const styles = {
  size: (width, height) => ({
    width,
    height: height || width,
    marginLeft: 10,
    marginRight: 10,
  }),
};

class TabPaymentCardForm extends PureComponent {
  static propTypes = {
    onChangeState: func.isRequired,
    translate: func.isRequired,
    currentValue: object.isRequired,
  };

  render() {
    const { translate, currentValue, onChangeState } = this.props;
    const { issue } = currentValue;
    return (
      <div>
        <p className="checkout-page-title">{translate('nyb.select_credit')}</p>
        <Form>
          <RadioControl>
            <Field
              name="issue"
              component={Radio}
              value="t1"
              type="radio"
              checked={issue === 't1'}
              onChange={() => onChangeState({ issue: 't1' })}
            />
            <img
              src="/assets/images/t1_icon.png"
              alt="Central The 1 Credit Card"
              style={styles.size(24)}
            />
            <Flex>
              <Text size={13} color={issue === 't1' ? '#007a33' : '#333333'}>
                Central The 1 Credit Card
              </Text>
              <Text size={9} style={{ lineHeight: 1 }} color="#808080">
                {translate('nyb.form.t1_card_desc')}
              </Text>
            </Flex>
          </RadioControl>
          <RadioControl marginBottom="-25px">
            <Field
              name="issue"
              component={Radio}
              value="other"
              type="radio"
              checked={issue === 'other'}
              onChange={() => onChangeState({ issue: 'other' })}
            />
            <div style={{ marginLeft: 10 }}>
              <Text size={13} color={issue === 'other' ? '#007a33' : '#333333'}>
                {translate('nyb.form.credit_etc')}
              </Text>
            </div>
          </RadioControl>
        </Form>
      </div>
    );
  }
}

export default reduxForm({ form: 'nybCheckCard' })(withTranslate(TabPaymentCardForm));
