import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { omit, isEmpty } from 'lodash';
import { Icon, Select } from '../..';
import './InputForm.scss';

class InputForm extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'select']),
    required: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]),
    error: PropTypes.bool,
    focused: PropTypes.bool,
    autoComplete: PropTypes.string
  };

  static defaultProps = {
    className: '',
    label: '',
    type: 'text',
    required: false,
    error: false,
    focused: false
  };

  state = {
    focused: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.focused) {
      this.handleFocus();
    }
  }

  handleFocus = () => {
    if (this.props.type === 'text') {
      return this.setState({ focused: true }, () => this.input.focus());
    }

    return this.setState({ focused: true });
  };

  handleClick = () => {
    if (this.props.type === 'select') {
      return this.setState({ focused: !this.state.focused });
    }

    if (this.input) {
      this.setState({ focused: true });
      return this.input.focus();
    }

    return this.setState({ focused: true }, () => this.input.focus());
  };

  handleBlur = event => {
    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleSelectChange(event, data) {
    this.props.onChange(data.value);

    this.setState({ focused: false });
  };

  renderInput() {
    return (
      <input
        {...omit(this.props, 'className')}
        autoComplete={this.props.autoComplete}
        onChange={this.props.onChange}
        ref={input => this.input = input}
        onBlur={this.handleBlur}
      />
    );
  }

  renderSelect() {
    return (
      <Select
        {...omit(this.props, 'className')}
        className="mt-input-form-select"
        open={this.state.focused}
        onClick={this.handleClick}
        onBlur={this.handleBlur}
        onChange={this.handleSelectChange.bind(this)}
        options={this.props.options}
      />
    );  
  }

  render() {
    const {
      className,
      label,
      value,
      type,
      required,
      options,
      error
    } = this.props;

    const { focused } = this.state;

    let showInput = !!value || focused;

    if (type === 'select' && isEmpty(options)) {
      showInput = false;
    }

    return (
      <div
        className={`mt-input-form ${className} ${error ? 'mt-input-form-error' : ''} ${focused ? 'mt-input-form-active' : ''}`}
        onClick={this.handleClick}
      >
        <div className={`label ${type === 'text' && showInput && 'label-small'}`}>
          {label}{required && <span className="star">*</span>}
        </div>
        {type === 'select' && !isEmpty(options) && !showInput && (
          <Icon className="dropdown icon custom-dropdown-icon" />
        )}
        {showInput && (
          type === 'select' ? this.renderSelect() : this.renderInput()
        )}
        {!showInput && <input className="hidden-input" onFocus={this.handleFocus} />}
      </div>
    )
  }
}

export default InputForm;
