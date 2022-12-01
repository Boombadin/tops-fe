import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { isEmpty, find } from 'lodash';
import { resetPassword } from '../../reducers/account';
import RegisHeader from '../../components/RegisHeader';
import Footer from '../../components/Footer';
import ResetPassForm from '../../components/ResetPassForm';
import { Grid } from '../../magenta-ui';
import './ResetPassword.scss';
import { getCustomerSelector } from '../../selectors';
import MetaTags from '../../components/MetaTags';
import { fullpathUrl } from '../../utils/url';
import Sidebar from '../../components/Sidebar';
import { fetchCategory } from '../../reducers/category';
import { closeLoginSidebar } from '../../reducers/layout';
import { StickyContainer } from 'react-sticky';
import { get } from 'lodash';

class ResetPassword extends Component {
  state = {
    email: '',
    rpToken: '',
    visible: false,
  };

  static propTypes = {
    activeCategory: PropTypes.string,
    customItems: PropTypes.node,
  };

  static defaultProps = {
    activeCategory: '',
    customItems: null,
  };

  componentDidMount() {
    const search = queryString.parse(this.props.location.search);
    if (!isEmpty(search)) {
      this.setState({
        email: search.email,
        rpToken: search.rptoken,
      });
    }

    if (!isEmpty(this.props.customer)) {
      window.location.replace('/');
    }

    if (isEmpty(this.props.categories) && !this.props.categoriesLoading) {
      this.props.fetchCategory();
    }
  }

  handleCloseSidebar = () => {
    this.setState({ visible: false });
    this.props.closeLoginSidebar();
  };

  leftToggleVisibility = () => this.setState({ visible: !this.state.visible });

  handleOnsubmit = () => {
    const { lang } = this.props;
    if (!isEmpty(this.state.email) && !isEmpty(this.state.rpToken)) {
      this.props.resetPassword(
        this.state.rpToken,
        this.state.email,
        get(lang, 'url', 'th'),
      );
    }
  };

  render() {
    const { translate, activeCategory, customItems } = this.props;
    const { visible } = this.state;

    return (
      <StickyContainer>
        <div className="reset-password-content">
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.reset_password.title')}
            keywords={translate('meta_tags.reset_password.keywords')}
            description={translate('meta_tags.reset_password.description')}
          />
          <RegisHeader onBurgerClick={this.leftToggleVisibility} />

          <div className="side-bar-content">
            <Sidebar
              activeCategory={activeCategory}
              visible={visible}
              handleCloseSidebar={this.handleCloseSidebar}
              customItems={customItems}
            />
          </div>

          <div className="reset-password-wrap">
            <Grid centered columns={2}>
              <div className="reset-password-form">
                <Grid.Column>
                  <ResetPassForm
                    email={this.state.email}
                    onSubmit={this.handleOnsubmit}
                  />
                </Grid.Column>
              </div>
            </Grid>
          </div>
          <Footer />
        </div>
      </StickyContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  lang: getActiveLanguage(state.locale),
  customer: getCustomerSelector(state),
  category: find(
    state.category.items,
    categ => categ.id.toString() === ownProps.activeCategory,
  ),
  categoriesLoading: state.category.loading,
});

const mapDispatchToProps = dispatch => ({
  resetPassword: (rpToken, email, lang) =>
    dispatch(resetPassword(rpToken, email, lang)),
  fetchCategory: () => dispatch(fetchCategory()),
  closeLoginSidebar: () => dispatch(closeLoginSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
