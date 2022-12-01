import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CheckBoxWrapper = styled.label`
  display: block;
  position: relative;
  padding-left: 25px;
  margin: 0 10px 0 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  &:hover input ~ .checkbox-checkmark {
    background-color: #eee;
  }

  input:checked ~ .checkbox-checkmark {
    background-color: #80bd00;
  }

  input:checked ~ .checkbox-checkmark:after {
    display: block;
  }
`;

const CheckBoxCheckMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  border-radius: 2px;
  box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #cccccc;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);

  &:after {
    content: '';
    position: absolute;
    display: none;
  }

  &:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

const CheckBox = ({ name, label, onChange, checked = null, isHTML }) => {
  return (
    <CheckBoxWrapper className="checkbox-container">
      {isHTML ? <div dangerouslySetInnerHTML={{ __html: label }} /> : label}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <CheckBoxCheckMark className="checkbox-checkmark"></CheckBoxCheckMark>
    </CheckBoxWrapper>
  );
};

CheckBox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

CheckBox.defaultProps = {
  label: '',
};

export default CheckBox;
