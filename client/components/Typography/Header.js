import styled from 'styled-components';
import { string, number, oneOf } from 'prop-types';

export const H1 = styled.h1`
  color: ${props => props.color || '#333'};
  font-size: ${props => (props.size ? `${props.size}px` : '24px')};
  font-weight: ${props => (props.type ? props.type : 'normal')};
  ${props => (props.align ? `text-align: ${props.align}` : '')};
  margin: 10px;
  @media (min-width: 991px) {
    font-size: ${props => (props.size ? `${props.size}px` : '36px')};
  }
`;

export const H2 = styled.h2`
  color: ${props => props.color || '#333'};
  font-size: ${props => (props.size ? `${props.size}px` : '20px')};
  font-weight: ${props => (props.type ? props.type : 'normal')};
  ${props => (props.align ? `text-align: ${props.align}` : '')};
  margin: 10px;
  @media (min-width: 991px) {
    font-size: ${props => (props.size ? `${props.size}px` : '24px')};
  }
`;

export const H3 = styled.h3`
  color: ${props => props.color || '#333'};
  font-size: ${props => (props.size ? `${props.size}px` : '18px')};
  font-weight: ${props => (props.type ? props.type : 'normal')};
  ${props => (props.align ? `text-align: ${props.align}` : '')};
  margin: 10px;
  @media (min-width: 991px) {
    font-size: ${props => (props.size ? `${props.size}px` : '20px')};
  }
`;

export const H4 = styled.h4`
  color: ${props => props.color || '#333'};
  font-size: ${props => (props.size ? `${props.size}px` : '16px')};
  font-weight: ${props => (props.type ? props.type : 'normal')};
  margin: 10px;
  ${props => (props.align ? `text-align: ${props.align}` : '')};
`;

const HeaderPropTypes = {
  color: string,
  size: number,
  type: string,
  align: oneOf(['left', 'center', 'right']),
};

const HeaderDefaultProps = {
  color: '',
  type: '',
  align: '',
};

H1.propTypes = HeaderPropTypes;
H1.defaultProps = HeaderDefaultProps;

H2.propTypes = HeaderPropTypes;
H2.defaultProps = HeaderDefaultProps;

H3.propTypes = HeaderPropTypes;
H3.defaultProps = HeaderDefaultProps;

H4.propTypes = HeaderPropTypes;
H4.defaultProps = HeaderDefaultProps;
