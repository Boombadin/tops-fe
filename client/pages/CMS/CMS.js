/**
 * @prettier
 */
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pt from 'prop-types';
import { NavLink } from 'react-router-dom';
import { get as prop, unescape } from 'lodash';
import { getTranslate } from 'react-localize-redux';

import Layout from '../../components/Layout';
import Tabbar from '../../components/Tabbar';
import MetaTags from '../../components/MetaTags';
import NotFound from '../NotFound';

import { Breadcrumb } from '../../magenta-ui';

import { getCurrentStoreConfigSelector } from '../../selectors';
import { fetchPage } from '../../reducers/cms';
import { fullpathUrl } from '../../utils/url';

import './CMS.scss';

class CMSPage extends PureComponent {
  static initialState = async (state, dispatch, match) => {
    const { slug } = match.params;
    const storeId = state.storeConfig.current.id;
    await dispatch(fetchPage(slug, storeId));
  };

  componentDidMount() {
    const pageSlug = this.props.match.params.slug;
    const storeId = this.props.storeConfig.id;

    this.props.fetchPage(pageSlug, storeId);
  }

  componentWillReceiveProps(nextProps) {
    const nextPageSlug = prop(nextProps, 'match.params.slug');
    const nextPage = nextProps.pages[nextPageSlug];
    const storeId = prop(nextProps, 'storeConfig.id');

    if (!nextPage) {
      nextProps.fetchPage(nextPageSlug, storeId);
    }
  }

  getPageHeml = () => {
    const { pages, storeConfig } = this.props;
    const pageSlug = this.props.match.params.slug;
    const currentPage = pages[pageSlug];
    let html = null;

    if (currentPage) {
      html = unescape(currentPage.content)
        .replace(/{{media url="/g, storeConfig.base_media_url)
        .replace(/"}}/g, '');
    }

    return html;
  };

  renderMetaTags = () => {
    const { pages } = this.props;
    const pageSlug = this.props.match.params.slug;
    const currentPage = pages[pageSlug];

    const title = currentPage.meta_title || currentPage.title;
    const description = currentPage.meta_description || '';
    const keywords = currentPage.meta_keywords || '';
    const ogImage = currentPage.og_image || '';

    return (
      <MetaTags
        canonicalUrl={fullpathUrl(this.props.location)}
        title={title}
        description={description}
        keywords={keywords}
        imageUrl={ogImage}
        ogTitle={description}
        ogDescription={description}
      />
    );
  };

  render() {
    const pageSlug = this.props.match.params.slug;
    const page = this.props.pages[pageSlug];

    if (page && !page.active && !page.loading) {
      return <NotFound />;
    }

    return (
      <Layout>
        {page && !page.loading && (
          <div>
            {this.renderMetaTags()}

            <Tabbar disableHome />

            <div className="breadcrumb-background">
              <Breadcrumb>
                <Breadcrumb.Section>
                  <NavLink to="/">
                    {this.props.translate('homepage_text')}
                  </NavLink>
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right angle" />
                <Breadcrumb.Section>{pageSlug}</Breadcrumb.Section>
              </Breadcrumb>
            </div>

            <div
              className="cms-content-block"
              dangerouslySetInnerHTML={{ __html: this.getPageHeml() }}
            />
          </div>
        )}
      </Layout>
    );
  }
}

CMSPage.propTypes = {
  match: pt.shape({
    params: pt.object.isRequired,
    isExact: pt.bool.isRequired,
    path: pt.string.isRequired,
    url: pt.string.isRequired,
  }).isRequired,
  pages: pt.object.isRequired,
  banner: pt.array.isRequired,
  storeConfig: pt.object.isRequired,
  fetchPage: pt.func.isRequired,
};

const mapStateToProps = state => ({
  banner: state.banner.items,
  pages: state.cms.pages,
  storeConfig: getCurrentStoreConfigSelector(state),
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchPage,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CMSPage);
