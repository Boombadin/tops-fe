import React from 'react';
import { array, string, bool } from 'prop-types';
import styled from 'styled-components';
import { filter, includes, isEmpty, unescape } from 'lodash';
import { breakpoint } from '@central-tech/core-ui';
const Wrapper = styled.div`
  /* background-image: linear-gradient(to right, #ffffff, #e2e2e2); */
  background-color: transparent !important;
  z-index: 10000000;
  width: 100%;
  top: 0;
  left: 0;
  ${breakpoint('xs', 'md')`
    .promo-top-banner {
      display: flex;
      justify-content: center;
      text-align: center;
    }
  `}
`;

const UpperHeader = ({
  isCustomer,
  className,
  classWrapperName,
  cmsBlock,
  baseMediaUrl,
  isGrabProvider,
}) => {
  let content = '';

  const filterData = filter(cmsBlock, val => {
    return (
      includes(
        val.identifier,
        isCustomer
          ? 'promo_banner_homepage_customer'
          : 'promo_banner_homepage_guest',
      ) && val.active === true
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

UpperHeader.propTypes = {
  className: string,
  cmsBlock: array,
  baseMediaUrl: string,
  isCustomer: bool,
  classWrapperName: string,
  isGrabProvider: bool,
};

UpperHeader.defaultProps = {
  className: '',
  cmsBlock: [],
  baseMediaUrl: '',
  isCustomer: false,
  classWrapperName: '',
  isGrabProvider: false,
};

export default UpperHeader;
