import React, { Component } from 'react';
import { head } from 'lodash';
import { func, object, string } from 'prop-types';
import { Breadcrumb } from '../../magenta-ui';
import Layout from '../../components/Layout';
import Tabbar from '../../components/Tabbar';
import MetaTags from '../../components/MetaTags';
import Breadcrumbs from '../../components/Breadcrumbs';
import { NewYearBasketContainer } from '../../features/nyb';
import { fullpathUrl } from '../../utils/url';

class NewYearBasketPage extends Component {
  static propTypes = {
    translate: func.isRequired,
    location: object.isRequired,
    title: string.isRequired,
    url: string.isRequired,
    metaTitle: string.isRequired,
    metaDescription: string.isRequired,
    metaKeywords: string.isRequired
  };

  renderBreadcrumbs() {
    const { translate, title, url } = this.props;

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/'
      },
      {
        label: title,
        url,
        isStatic: true
      }
    ];

    return (
      <div className="breadcrumb-background">
        <Breadcrumb>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumbs
              key={breadcrumb.label}
              label={breadcrumb.label}
              url={breadcrumb.url}
              isStatic={breadcrumb.isStatic}
              hasNext={index < breadcrumbs.length - 1}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  render() {
    const { location, title, metaTitle, metaDescription, metaKeywords } = this.props;
    return (
      <Layout title={title}>
        <Tabbar />
        <MetaTags
          canonicalUrl={head(fullpathUrl(this.props.location).split('?'))}
          title={metaTitle}
          description={metaDescription}
          keywords={metaKeywords}
        />
        {this.renderBreadcrumbs()}
        <NewYearBasketContainer {...this.props} />
      </Layout>
    );
  }
}

export default NewYearBasketPage;
