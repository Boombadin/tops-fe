import { Component } from 'react';
import pt from 'prop-types';
import { getCookie } from '../../utils/cookie';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router';

class GTMInitialize extends Component {
  static propTypes = {
    match: pt.object.isRequired,
    location: pt.object.isRequired,
    history: pt.object.isRequired,
  };

  componentDidMount() {
    if (this.props.pageType == 'checkout') {
      this.initialize();
    }
  }

  componentDidUpdate() {
    const prevLocation = localStorage.getItem('prevLocation');
    if (
      prevLocation != this.props.location.pathname &&
      this.props.pageType != 'undefined'
    ) {
      localStorage.setItem('prevLocation', this.props.location.pathname);
      this.initialize();
    }
  }

  initialize() {
    dataLayer.push({
      event: 'initialize',
      pageType: this.props.pageType || '',
      provider: !isEmpty(getCookie('provider')) ? getCookie('provider') : 'web',
    });
  }
  render() {
    return null;
  }
}

export default withRouter(GTMInitialize);
