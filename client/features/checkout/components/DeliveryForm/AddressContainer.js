import React, { Fragment, PureComponent } from 'react';
import styled, { css } from 'styled-components';
import pt from 'prop-types';
import { get, isEmpty, omit } from 'lodash';
import { breakpoint } from '@central-tech/core-ui';

const AddressLine1 = styled.div`
  color: #2a2a2a;
  font-size: 15px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0.6px;
`;

const AddressLine2 = styled.div`
  font-size: 12px;
  color: #2a2a2a;
`;

const Label = styled.label`
  font-size: 11px;
  color: #666666;
  cursor: pointer;
`;

const Group = styled.div`
  display: inline-grid;
  width: 100%;
  padding: 10px 0 10px;

	${breakpoint('lg')`
		width: 320px;
	`}
`;

const GroupLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0.4px;
`;

const GroupInput = styled.input`
  width: 100%;
  height: 38px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
  color: #2a2a2a;
  font-size: 14px;
  padding-left: 10px;
  
	${breakpoint('md')`
    width: 300px;
    padding: 0 10px 0 10px;
    
	`}
  ${props =>
    props.textarea &&
    css`
      width: 100%;
      height: 80px;
      ${breakpoint('lg')`
				width: 620px;
			`}
    `}
`;

class AddressContainer extends PureComponent {
  state = {
    isFirstLoad: true,
    consigneeName: '',
    telephone: '',
    detail: '',
  };

  componentDidUpdate(prevState, prevProps) {
    const { firstname, lastname, telephone } = get(this.props, 'customer');
    if (prevState !== this.state) {
      this.props.onChange({
        ...omit(this.state, ['isFirstLoad']),
      });
    }
    if (this.state.isFirstLoad && !isEmpty(firstname)) {
      this.setState({
        consigneeName: `${firstname} ${lastname}`,
        telephone: telephone,
        isFirstLoad: false,
      });
    }
  }

  handleChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  render() {
    const { line1, line2, line3, deliveryMethod, translate, addressType = '' } = this.props;

    return (
      <React.Fragment>
        <AddressLine1>
          {line1} <Label>เปลี่ยนที่อยู่</Label>
        </AddressLine1>
        <AddressLine2>{line2}</AddressLine2>
        <AddressLine2>{line3}</AddressLine2>

        {addressType == 'shipping' && (
          <Fragment>
            {deliveryMethod && deliveryMethod === 'home_delivery' && (
              <Fragment>
                <Group>
                  <GroupLabel>{translate('checkout_delivery.shipping_address.form.detail')}*</GroupLabel>
                  <GroupInput
                    name="detail"
                    textarea
                    value={this.state.detail}
                    onChange={e => this.handleChange('detail', e)}
                  />
                </Group>
                <br />
              </Fragment>
            )}

            <Group>
              <GroupLabel>{translate('checkout_delivery.shipping_address.form.recipient_name')}*</GroupLabel>
              <GroupInput
                name="consigneeName"
                value={this.state.consigneeName}
                onChange={e => this.handleChange('consigneeName', e)}
              />
            </Group>
            <Group>
              <GroupLabel>{translate('checkout_delivery.shipping_address.form.telephone')}*</GroupLabel>
              <GroupInput
                name="telephone"
                value={this.state.telephone}
                onChange={e => this.handleChange('telephone', e)}
              />
            </Group>
          </Fragment>
        )}
      </React.Fragment>
    );
  }
};

AddressContainer.propTypes = {
  line1: pt.string,
  line2: pt.string,
  line3: pt.string,
  deliveryMethod: pt.string,
  translate: pt.func,
  addressType: pt.string
};

AddressContainer.defaultProps = {
  line1: '',
  line2: '',
  line3: '',
  deliveryMethod: '',
  translate: function() { },
  addressType: ''
};

export default AddressContainer;
