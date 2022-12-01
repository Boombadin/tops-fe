import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { includes, get, unescape } from 'lodash';
import { createDeepEqualSelector } from '../../utils/selectors';

// Find State in Redux
const findStoreConfig = state => state.storeConfig.current;
const findCmsBlock = state => state.cmsBlock.items;

// Selectors
export const makeStoreConfig = () =>
  createDeepEqualSelector(findStoreConfig, storeConfig => storeConfig);
export const makeCmsBlock = () =>
  createDeepEqualSelector(findCmsBlock, cmsBlock => cmsBlock);

const DisplayFlex = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: content-box;
`;

// Container
class CMSContainer extends PureComponent {
  static defaultProps = {
    cmsBlock: [],
  };

  static propTypes = {
    identifier: PropTypes.string.isRequired,
    storeConfig: PropTypes.object.isRequired,
    cmsBlock: PropTypes.array,
  };

  filterCMSBlock(identifier) {
    const { cmsBlock, storeConfig } = this.props;
    const baseMediaUrl = get(storeConfig, 'base_media_url', '');
    let content = '';

    if (cmsBlock.length > 0) {
      const filterData = cmsBlock.filter(
        item => includes(item.identifier, identifier) && item.active === true,
      );

      filterData.map(resp => {
        content = unescape(resp.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      });
    }

    return content;
  }

  render() {
    const { identifier } = this.props;
    const content = this.filterCMSBlock(identifier);
    const renderHtml = ReactHtmlParser(content);
    return <DisplayFlex>{renderHtml}</DisplayFlex>;
  }
}

const makeMapStateToProps = () => {
  const getStoreConfig = makeStoreConfig();
  const getCmsBlock = makeCmsBlock();
  return state => ({
    storeConfig: getStoreConfig(state),
    cmsBlock: getCmsBlock(state),
  });
};

export default connect(makeMapStateToProps, {})(CMSContainer);
