import React from 'react';
import { array, string, bool } from 'prop-types';
import styled from 'styled-components';
import { filter, includes, isEmpty, unescape } from 'lodash';

const Wrapper = styled.div`
  background-image: linear-gradient(to right, #ffffff, #e2e2e2);
  z-index: 10000000;
  width: 100%;
  top: 0;
  left: 0;
  & img {
    max-width: 100%;
  }
`;

const RoyalHeader = ({
  className,
  classWrapperName,
  cmsBlock,
  baseMediaUrl,
  isGrabProvider,
}) => {
  let content = '';

  const filterData = filter(cmsBlock, val => {
    return (
      includes(val.identifier, 'royal_header_banner') && val.active === true
    );
  });

  if (!isEmpty(filterData)) {
    filterData.map(resp => {
      content = unescape(resp.content)
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    });
  }

  if (!isEmpty(filterData) && filterData.length > 0 && !isGrabProvider) {
    return (
      <Wrapper className={classWrapperName}>
        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Wrapper>
    );
  }

  return null;
};

RoyalHeader.propTypes = {
  className: string,
  cmsBlock: array,
  baseMediaUrl: string,
  classWrapperName: string,
  isGrabProvider: bool,
};

RoyalHeader.defaultProps = {
  className: '',
  cmsBlock: [],
  baseMediaUrl: '',
  classWrapperName: '',
  isGrabProvider: false,
};

export default RoyalHeader;
