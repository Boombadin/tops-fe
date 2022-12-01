import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Layout from '../../components/Layout';
import Tabbar from '../../components/Tabbar';
import './NotFound.scss';

class NotFoundPage extends PureComponent {
  componentDidMount() {
    if (this.props?.match?.url === '/') {
      return this.props.history.push(`/`);
    }
  }

  render() {
    const { translate } = this.props;
    return (
      <Layout>
        <Tabbar />
        <div className="page-not-found">
          <img
            className="image_404"
            src="/assets/images/404_image.svg"
            alt=""
          />
          <p className="title">
            <span>{translate('404_not_found.title1')}</span>{' '}
            <span>{translate('404_not_found.title2')}</span>
          </p>
          <p className="content">
            <span>{translate('404_not_found.sub_title1')}</span>{' '}
            <span>{translate('404_not_found.sub_title2')}</span>
          </p>
          <div className="button_section">
            <Link to="/promotion" className="button btn_promotion">
              {translate('404_not_found.btn_promotion')}
            </Link>
            <Link to="/" className="button btn_home">
              {translate('404_not_found.btn_home')}
            </Link>
          </div>
        </div>
        <div className="insider-sr-404"></div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(NotFoundPage);
