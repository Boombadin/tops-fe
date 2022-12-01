import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const ButtonRadioWrapper = styled.label`
  display: block;
  position: relative;
  padding-left: 25px;
  margin: 0 10px 0 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    z-index: -1;
  }

  &:hover input ~ .radio-checkmark {
    background-color: #eee;
  }

  input:checked ~ .radio-checkmark {
    background-color: white;
    border: 1px solid #cdcdcd;
  }

  input:checked ~ .radio-checkmark:after {
    display: block;
  }
`;

const RadioCheckMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;

  &:after {
    content: '';
    position: absolute;
    display: none;
  }

  &:after {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #80bd00;
  }
`;

const ButtonRadio = ({
  name,
  label,
  onChange,
  checked = null,
  readOnly = null,
}) => {
  return (
    <ButtonRadioWrapper className="radio-container">
      {label}
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        readOnly={readOnly}
      />
      <RadioCheckMark className="radio-checkmark"></RadioCheckMark>
    </ButtonRadioWrapper>
  );
};

ButtonRadio.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

ButtonRadio.defaultProps = {
  label: '',
};

export default ButtonRadio;
