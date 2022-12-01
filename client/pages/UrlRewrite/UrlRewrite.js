import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash'
import Layout from '../../components/Layout';
import Tabbar from '../../components/Tabbar';
import { ProductPreloader, BreadcrumbPreloader, PagePreloader } from '../../components/PreloaderComponent'

import { fetchPath } from '../../reducers/urlRewrite';
import pagesMap from './pagesMap';

class UrlRewritePage extends Component {
  // static initialState = async (state, dispatch, match) => {
  //   const { slug } = match.params;
  //   const pathObj = await dispatch(fetchPath(slug));
  //   const pageComponent = pagesMap[pathObj.entity_type];
  // 
  //   if (pageComponent && pageComponent.initialState) {
  //     await pageComponent.initialState(state, dispatch, match)
  //   }
  // }

  // Lifecycle methods
  componentDidMount() {
    window.scrollTo(0, 0)
    const { pathesMap, match, getPathObj } = this.props;
    const pathObj = pathesMap[match.params.slug];

    if (!pathObj) {
      getPathObj(match.params.slug);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pathesMap, getPathObj, match } = nextProps;
    const { slug } = match.params;

    if (slug !== this.props.match.params.slug && !pathesMap[slug]) {
      getPathObj(slug);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pathesMap, match } = nextProps;
    const pathObj = pathesMap[match.params.slug];

    if (isEmpty(pathObj)) {
      return false
    }

    return true
  }

  // Render Methods
  render() {
    const { pathesMap, match } = this.props;
    const pathObj = pathesMap[match.params.slug];

    if (isEmpty(pathObj)) {
      return (
        <Layout>
          <Tabbar />
          <BreadcrumbPreloader />
          <PagePreloader />
        </Layout>
      );
    }

    return React.createElement(pagesMap[pathObj.entity_type], { ...this.props });
  }
}

UrlRewritePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  pathesMap: PropTypes.object.isRequired,
  getPathObj: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pathesMap: state.urlRewrite.pathesMap
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getPathObj: path => dispatch(fetchPath(path, ownProps))
});

export default connect(mapStateToProps, mapDispatchToProps)(UrlRewritePage);
