import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get as prop, isEmpty } from 'lodash';
import queryString from 'query-string';
import Cookie from 'js-cookie';
import GrabID from '@grab-id/grab-id-client';
import { socialLogin } from '../../reducers/auth';
import './Provider.scss';
import GTMInitialize from '../../components/GoogleTagManager/GTMInitialize';

class Provider extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    socialLogin: PropTypes.func.isRequired,
    storeConfig: PropTypes.object,
    envConfig: PropTypes.object,
  };

  static defaultProps = {
    storeConfig: {},
    envConfig: {},
  };

  componentDidMount() {
    const { location, match } = this.props;
    const getResultGrab = GrabID.getResult();
    const language =
      prop(navigator, 'language', '') === 'th-TH' ||
      prop(navigator, 'language', '') === 'th' ||
      prop(navigator, 'userLanguage', '') === 'th-TH' ||
      prop(navigator, 'userLanguage', '') === 'th'
        ? 'th'
        : 'en';

    this.configGrab();
    if (match.params.slug === 'GrabFresh') {
      const parsedSearchQuery = queryString.parse(location.search);
      if (
        prop(parsedSearchQuery, 'code', '') &&
        prop(getResultGrab, 'state', '') !== '' &&
        prop(parsedSearchQuery, 'state', '') ===
          prop(getResultGrab, 'state', '')
      ) {
        this.loginWithGrab();
      } else if (prop(parsedSearchQuery, 'error', '')) {
        let refProvider = '';
        if (!isEmpty(Cookie.get('provider_ref'))) {
          refProvider = Cookie.get('provider_ref');
        }
        Cookie.remove('provider_ref');
        window.location.href = `/${language}/${refProvider}`;
      } else {
        this.authorizationGrab();
      }
    }

    if (!isEmpty(match.params.slug)) {
      Cookie.set('provider', match.params.slug);
    }
    if (!isEmpty(match.params.url_key)) {
      Cookie.set('provider_ref', match.params.url_key);
    }
  }

  configGrab = () => {
    const { storeConfig, envConfig } = this.props;
    const openIdUrl = `${prop(
      storeConfig,
      'extension_attributes.grab_url',
      '',
    )}grabid/v1/oauth2`;

    const appConfig = {
      clientId: atob(
        prop(storeConfig, 'extension_attributes.grab_client_id', ''),
      ),
      redirectUri: `${prop(
        envConfig,
        'baseUrl',
        'https://www.tops.co.th',
      )}/provider/GrabFresh`,
      scope: ['openid', 'phone', 'profile.read'].join(' '),
      acrValues: {
        service: 'PASSENGER',
        consentContext: {
          countryCode: 'SG',
        },
      },
    };

    const grabIdClient = new GrabID(openIdUrl, appConfig);

    return grabIdClient;
  };

  authorizationGrab = () => {
    const grabIdClient = this.configGrab();
    grabIdClient.makeAuthorizationRequest();
  };

  loginWithGrab = () => {
    const language =
      prop(navigator, 'language', '') === 'th-TH' ||
      prop(navigator, 'language', '') === 'th' ||
      prop(navigator, 'userLanguage', '') === 'th-TH' ||
      prop(navigator, 'userLanguage', '') === 'th'
        ? 'th'
        : 'en';

    const grabIdClient = this.configGrab();
    GrabID.handleAuthorizationCodeFlowResponse();
    grabIdClient
      .makeTokenRequest()
      .then(() => {
        if (prop(GrabID.getResult(), 'accessToken', '') !== 'undefined') {
          const accessToken = prop(GrabID.getResult(), 'accessToken', '');
          const provider = 'grab';
          const data = {
            token: accessToken,
            provider: provider,
          };
          if (accessToken) {
            let refProvider = '';
            if (!isEmpty(Cookie.get('provider_ref'))) {
              refProvider = Cookie.get('provider_ref');
            }
            this.props.socialLogin(`/${language}/${refProvider}`, data);
          }
        } else {
          this.authorizationGrab();
        }
      })
      .catch(error => {
        return error.toString();
      });
  };

  render() {
    return (
      <div className="provider-loading-wrapper">
        <GTMInitialize />
        <img
          src="/assets/images/Logo_CRG_CFR-Tops-01.svg"
          alt="site logo"
          width={150}
          height={150}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  storeConfig: state.storeConfig.current,
  envConfig: state.storeConfig.envConfig,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  socialLogin: (ref, data) => dispatch(socialLogin(ref, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Provider);
