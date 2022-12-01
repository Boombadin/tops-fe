import React from 'react';
import { func, string, element, node, oneOfType, bool, number } from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from '../Grid';
import './FormControl.scss';

export const MaxWidth = styled.div`
  width: auto;
  @media (min-width: 991px) {
    width: ${props => props.width || 300};
  }
`;

export const FormControl = ({ label, children, success, width }) => (
  <Row>
    {label && (
      <Col>
        <div className="styled-form-control">
          <label className={success ? 'styled-success' : ''}>{label}</label>
        </div>
      </Col>
    )}
    <Col>
      <MaxWidth width={width}>{children}</MaxWidth>
    </Col>
  </Row>
);

FormControl.propTypes = {
  label: string,
  success: bool,
  children: oneOfType([func, element, node]),
  width: oneOfType([string, number]),
};

FormControl.defaultProps = {
  label: '',
  success: false,
  children: null,
  width: '',
};
