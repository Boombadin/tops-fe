import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, find } from 'lodash';
import Cookie from 'js-cookie';
import RegisHeader from '../../components/RegisHeader';
import Footer from '../../components/Footer';
import { Grid } from '../../magenta-ui';
import { getTranslate } from 'react-localize-redux';
import CompletedContainer from '../../components/CompletedContainer';
import './ResetPassword.scss';
import { getCustomerSelector } from '../../selectors';
import MetaTags from '../../components/MetaTags';
import { fullpathUrl } from '../../utils/url';
import Sidebar from '../../components/Sidebar';
import { fetchCategory } from '../../reducers/category';
import { closeLoginSidebar } from '../../reducers/layout';
import { StickyContainer } from 'react-sticky';
class ResetPasswordCompleted extends Component {
  state = {
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

  handleBackClick = () => {
    if (!isEmpty(Cookie.get('reset_deep_link'))) {
      window.location.href = Cookie.get('reset_deep_link').replace(/"/g, '');
    } else {
      window.location.href = '/';
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
            title={translate('meta_tags.reset_password_completed.title')}
            keywords={translate('meta_tags.reset_password_completed.keywords')}
            description={translate('meta_tags.reset_password_completed.description')}
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
                  <CompletedContainer
                    img="/assets/images/updated-password.png"
                    width="109"
                    btnText={translate('reset_password.completed.button')}
                    onClick={this.handleBackClick}
                  >
                    <div className="content-section center">
                      <p className="title">{translate('reset_password.completed.title')}</p>
                      <p>{translate('reset_password.completed.desc')}</p>
                    </div>
                  </CompletedContainer>
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
  customer: getCustomerSelector(state),
  category: find(
    state.category.items,
    categ => categ.id.toString() === ownProps.activeCategory,
  ),
  categoriesLoading: state.category.loading,
});

const mapDispatchToProps = dispatch => ({
  fetchCategory: () => dispatch(fetchCategory()),
  closeLoginSidebar: () => dispatch(closeLoginSidebar()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPasswordCompleted);
