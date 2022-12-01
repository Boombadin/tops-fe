import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Image, Container, Header, Divider } from '../../magenta-ui';
import './Callback.scss';

class Callback extends Component {
  componentDidMount() {
    const params = this.props.match.params.slug;
    if (params === 'success') {
      this.redirectToHomepage();
    }
  }

  redirectToHomepage() {
    const lang = window.location.pathname.split('/')[1];
    if (window.opener && window.opener.location !== window.location) {
      try {
        window.opener.location.reload(true);
        window.close();
      } catch (e) {
        document.location.href = `/${lang}/`;
      }
    } else {
      document.location.href = `/${lang}/`;
    }
  }

  renderSuccessMessage() {
    const { translate } = this.props;
    return (
      <Container text className="header-error">
        <Image
          className="pc-logo image-error"
          src="/assets/images/tops-logo.svg"
          size="small"
        />
        <Header as="h2" handleToHome={() => this.props.history.push('/')}>
          {translate('call_back.success.title')}
        </Header>
        <Divider clearing />
        <p>{translate('call_back.success.sub_title')}</p>
      </Container>
    );
  }

  renderErrorMessage() {
    const { translate } = this.props;

    return (
      <Container text className="header-error">
        <Image
          className="pc-logo image-error"
          src="/assets/images/tops-logo.svg"
          size="small"
        />
        <Header as="h2" handleToHome={() => this.props.history.push('/')}>
          {translate('call_back.error.title')}
        </Header>
        <Divider clearing />
        <p>{translate('call_back.error.sub_title')}</p>
      </Container>
    );
  }

  render() {
    return (
      <div className="call-back">
        {this.props.match.params.slug === 'success'
          ? this.renderSuccessMessage()
          : this.renderErrorMessage()}
      </div>
    );
  }
}

Callback.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(Callback);
