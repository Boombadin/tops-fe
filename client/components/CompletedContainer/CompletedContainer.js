import { Button } from '@central-tech/core-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Image } from '@client/magenta-ui';

import './CompletedContainer.scss';

const StyledButton = styled(Button)`
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34, 36, 38, 0.15) inset;

  &:hover {
    filter: brightness(90%);
  }
`;

const CompletedContainer = ({
  className,
  img,
  children,
  onClick,
  btnText,
  width,
}) => {
  return (
    <div className={`completed-container ${className}`}>
      <div className="logo">
        <Image width={width} src={img} />
      </div>
      <div>{children}</div>
      <StyledButton
        type="submit"
        color="#f70405"
        textColor="#fff"
        height="40"
        radius="4"
        size="14"
        block
        bold
        onClick={onClick}
      >
        {btnText}
      </StyledButton>
    </div>
  );
};

CompletedContainer.propTypes = {
  className: PropTypes.string,
};

CompletedContainer.defaultProps = {
  className: '',
};

export default CompletedContainer;
