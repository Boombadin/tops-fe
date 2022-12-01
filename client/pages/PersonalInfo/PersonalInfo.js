import React, { PureComponent } from 'react';
import { get, size, isEmpty } from 'lodash';
import { Padding } from '@central-tech/core-ui';
import { Breadcrumb } from '../../magenta-ui';
import Layout from '../../components/Layout';
import Tabbar from '../../components/Tabbar';
import Breadcrumbs from '../../components/Breadcrumbs';
import ProfileContainer from '../../features/account';
import withLocales from '../../hoc/withLocales';
import { isLoggedIn } from '../../utils/cookie';

class CustomerInfo extends PureComponent {
  renderBreadcrums() {
    const { translate } = this.props;

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
      {
        label: translate('profile_info.personal.title'),
        isStatic: true,
      },
    ];

    return (
      <div className="breadcrumb-background">
        <Breadcrumb>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumbs
              key={get(breadcrumb, 'label', '')}
              label={get(breadcrumb, 'label', '')}
              url={get(breadcrumb, 'url', '')}
              isStatic={get(breadcrumb, 'isStatic', false)}
              hasNext={index < size(breadcrumbs) - 1}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  render() {
    if (!isLoggedIn() && isEmpty(this.props.customer)) {
      this.props.history.push('/');
      return '';
    }

    return (
      <div id="profile">
        <Layout>
          <Tabbar />
          {this.renderBreadcrums()}
          <Padding>
            <ProfileContainer />
          </Padding>
        </Layout>
      </div>
    );
  }
}

export default withLocales(CustomerInfo);
