import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import './Input.scss'

class Input extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    maxlength: PropTypes.number,
    textarea: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    value: '',
    onChange: noop,
    placeholder: '',
    required: false,
    maxlength: 100,
    textarea: false,
  }

  state = {
    focused: false
  }

  handlePlaceholderClick = () => {
    this.input.focus();
    this.setState({ focused: true });
  }

  renderInput() {
    const { value, onChange, textarea, maxLength } = this.props;
    const props = {
      ref: input => this.input = input,
      value,
      onChange,
      onFocus: () => this.setState({ focused: true }),
      onBlur: () => this.setState({ focused: false }),
      maxLength,
    };

    return textarea ? <textarea {...props} /> : <input {...props} />
  }

  render() {
    const { className, value, placeholder, required } = this.props

    return (
      <div className={`input-root ${className}`}>
        {this.renderInput()}
        {!value && (
          <span
            className={`placeholder ${this.state.focused ? 'placeholder-focused' : ''}`}
            onClick={this.handlePlaceholderClick}
          >
            <span className="text">{placeholder}</span>
            {required && <span className="star">*</span>}
          </span>
        )}
      </div>
    )
  }
}

export default Input;
