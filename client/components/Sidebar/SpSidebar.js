import filter from 'lodash/filter';
import find from 'lodash/find';
import prop from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import size from 'lodash/size';
import moment from 'moment';
import { arrayOf, bool, func, number, object, string } from 'prop-types';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import uuidV4 from 'uuid/v4';

import AccountTab from '@client/components/AccountTab';
import LanguageSwitch from '@client/components/LanguageSwitch';
import SidebarPreloader from '@client/components/Sidebar/SidebarPreloader';
import SpSidebarRow from '@client/components/Sidebar/SpSidebarRow';
import saleforceConfig from '@client/config/saleforce';
import { findCategoryNYB } from '@client/features/nyb';
import withCategories from '@client/hoc/withCategories';
import { Icon, Menu, Sidebar } from '@client/magenta-ui';
import { toggleLogin } from '@client/reducers/layout';
import {
  getCustomerSelector,
  isCustomerLoggedSelector,
} from '@client/selectors';

import './SpSidebar.scss';

const TextEllipsisBlogUsername = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 20px;
  width: 150px;
`;

@withCategories
class SpSidebar extends Component {
  static propTypes = {
    handleCloseSidebar: func.isRequired,
    baseUrl: string.isRequired,
    categories: arrayOf(object).isRequired,
    toggleLogin: func.isRequired,
    translate: func.isRequired,
    history: object.isRequired,
    isCustomerLogged: bool.isRequired,
    showLogin: bool,
    visible: bool.isRequired,
    customer: object,
    isCategoryNYB: number.isRequired,
    categoryLoading: bool,
    megaMenu: object,
  };

  static defaultProps = {
    showLogin: false,
    customer: {},
    categoryLoading: false,
    megaMenu: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      sidebarLevel2: {
        active: false,
        title: '',
        link: '',
        children: [],
      },
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.onPressPusher = this.onPressPusher.bind(this);
  }

  componentDidMount() {
    const env = window?.App?.environment;
    const livechatConfig =
      env === 'prod' ? saleforceConfig.prod : saleforceConfig.staging;
    const display = document.getElementById(
      livechatConfig.liveChat.liveChat_Online_th,
    )
      ? document.getElementById(livechatConfig.liveChat.liveChat_Online_th)
          .style.display
      : '';
    if (display !== 'none') {
      this.setState({
        isChatOnline: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.visible !== this.props.visible ||
        prevProps.showLogin !== this.props.showLogin) &&
      (this.props.visible || this.props.showLogin)
    ) {
      if (
        (size(this.props.categories) <= 0 ||
          size(prevProps.categories) !== size(this.props.categories)) &&
        isEmpty(this.props.categoriesLoading)
      ) {
        this.props.fetchCategory();
      }
    }
  }

  renderCateLevel1 = () => {
    const {
      mainCategory,
      baseUrl,
      handleCloseSidebar,
      categoryLoading,
    } = this.props;

    if (isEmpty(mainCategory) && categoryLoading) {
      return <SidebarPreloader />;
    }

    const mediaUrl = `${baseUrl}catalog/category/`;

    if (!mainCategory) return null;

    const component = mainCategory.map(item => {
      const icon = item.icon
        ? `${mediaUrl}${item.icon}`
        : '/assets/icons/sort-right.png';
      return (
        <SpSidebarRow
          key={uuidV4()}
          type="pusher"
          onPressPusher={() => this.onPressPusher(item.id)}
          title={item.name}
          icon={icon}
          onClick={handleCloseSidebar}
        />
      );
    });

    return component;
  };

  onPressPusher(id) {
    const { sidebarLevel2 } = this.state;
    const currentCategory = filter(this.props.categories, el => el.id === id);

    if (currentCategory.length > 0) {
      const newData = currentCategory[0];
      const children = this.fetchChildren(newData.children);
      const currentState = {
        active: true,
        title: newData.name,
        link: `/${newData.url_path}`,
        children: children,
      };

      const newState = { ...sidebarLevel2, ...currentState };

      this.setState({
        sidebarLevel2: newState,
      });
    }
  }

  fetchChildren = children => {
    let subCategories = [];

    if (children) {
      const childrenList = children.split(',');
      childrenList.map(childrenId => {
        const data = find(
          this.props.categories,
          categ => categ.id.toString() === childrenId,
        );
        if (data) {
          subCategories.push(data);
        }
      });
    }

    subCategories = orderBy(subCategories, 'position', 'asc');

    return subCategories;
  };

  toggleSidebar() {
    const { sidebarLevel2 } = this.state;
    const newState = Object.assign({}, sidebarLevel2, { active: false });

    this.setState({
      sidebarLevel2: newState,
    });
  }

  handleClickLogin = () => {
    this.props.toggleLogin();
  };

  handleClickToRegister = () => {
    window.location = '/registration';
  };

  handleClickToLogin = () => {
    window.location.href = encodeURI(
      `/login?ref=${window.location.pathname}${window.location.search}`,
    );
  };

  handleClickMenu = (link = '/') => {
    this.props.handleCloseSidebar;

    if (link !== 'livechat') {
      this.props.history.push(link);
    } else {
      window.embedded_svc.onHelpButtonClick();
    }
  };

  renderCategories() {
    const {
      translate,
      handleCloseSidebar,
      isCategoryNYB,
      megaMenu,
    } = this.props;

    return (
      <div>
        <SpSidebarRow className="sidebar-language-switch">
          <LanguageSwitch />
        </SpSidebarRow>
        <SpSidebarRow
          type="link"
          title={translate('homepage_link')}
          link="/"
          icon="/assets/icons/sidebar-home-icon.png"
          onClick={() => this.handleClickMenu()}
        />
        {map(prop(megaMenu, 'items'), item => {
          return (
            moment(prop(item, 'start_date')) <=
              moment(prop(item, 'end_date')) && (
              <SpSidebarRow
                key={uuidV4()}
                type="link"
                title={item.name}
                link={`/${item.url}`}
                icon={item.icon}
                onClick={() => this.handleClickMenu(`/${item.url}`)}
              />
            )
          );
        })}
        {isCategoryNYB && moment() <= moment('2019-02-03 23:59:59') ? (
          // <SpSidebarRow
          //   type="link"
          //   title={translate('new_year_hamper')}
          //   link={ROUTE_CATEGORY_NYB}
          //   icon="/assets/icons/sidebar-nyb-icon.png"
          //   onClick={handleCloseSidebar}
          // />
          <SpSidebarRow
            type="link"
            title={translate('tabbar.seasonal_cny')}
            link="/campaign/promotion-product-chinese-new-year-2019"
            icon="/assets/icons/cny_seasonal.png"
            onClick={() =>
              this.handleClickMenu(
                '/campaign/promotion-product-chinese-new-year-2019',
              )
            }
          />
        ) : null}
        <SpSidebarRow
          type="link"
          title={translate('tabbar.my_list')}
          link="/m/wishlist"
          icon="/assets/icons/sidebar-my-list.png"
          onClick={() => this.handleClickMenu('/m/wishlist')}
        />
        <SpSidebarRow
          type="link"
          title={translate('tabbar.deal')}
          link="/deals"
          icon="/assets/icons/sidebar-deal.png"
          onClick={() => this.handleClickMenu('/deals')}
        />
        <SpSidebarRow
          type="link"
          title={
            this.state.isChatOnline
              ? translate('tabbar.livechat_online')
              : translate('tabbar.livechat_offline')
          }
          link="#"
          icon="/assets/icons/sidebar-contact.png"
          onClick={() => {
            this.handleClickMenu('livechat');
          }}
        />
        <SpSidebarRow
          type="link"
          title={translate('tabbar.helps')}
          link="/help"
          icon="/assets/icons/sidebar-help-icon.png"
          onClick={() => this.handleClickMenu('/help')}
        />
        <SpSidebarRow type="header" title={translate('tabbar.all_product')} />

        {this.renderCateLevel1()}

        <SpSidebarRow
          type="link"
          title={translate('tabbar.special_offer')}
          link="/privilege"
          icon="/assets/icons/privilege-icon.svg"
          onClick={() => this.handleClickMenu('/privilege')}
        />
        <SpSidebarRow
          type="window"
          title={translate('tabbar.top_pick')}
          link="https://www.topspicks.tops.co.th/"
          icon="/assets/icons/other-icon.svg"
          onClick={handleCloseSidebar}
        />
      </div>
    );
  }
  handleClickProfile = () => {
    this.props.history.push('/profile');
  };
  render() {
    const { sidebarLevel2 } = this.state;
    const { translate, handleCloseSidebar, showLogin } = this.props;
    const visible = this.props.visible || showLogin;

    return (
      <React.Fragment>
        <Sidebar
          className="sp-sidebar-container"
          as={Menu}
          animation="overlay"
          visible={visible}
        >
          <div className="sp-sidebar" id="sp-sidebar">
            <div
              className={`sidebar-window level-2 ${showLogin ? 'active' : ''}`}
            >
              <div className="sp-sidebar__head black">
                <button
                  className="sp-sidebar__back"
                  onClick={this.handleClickLogin}
                >
                  <Icon name="chevron left" />
                </button>
                <div className="sp-sidebar__title">
                  {(this.props.isCustomerLogged && (
                    <div>{this.props.customer.firstname}</div>
                  )) || <div>{translate('sp_sidebar.login')}</div>}
                </div>
              </div>
              <div className="sp-sidebar__content">
                <AccountTab />
              </div>
            </div>

            <div
              className={`sidebar-window level-2 ${
                sidebarLevel2.active ? 'active' : ''
              }`}
            >
              <div className="sp-sidebar__head">
                <button
                  className="sp-sidebar__back"
                  onClick={this.toggleSidebar}
                >
                  <Icon name="chevron left" />
                </button>
                {sidebarLevel2.title && (
                  <div className="sp-sidebar__title">{sidebarLevel2.title}</div>
                )}
              </div>
              <div className="sp-sidebar__content">
                {sidebarLevel2.children.map(item => {
                  const productCount = prop(
                    item,
                    'extension_attributes.product_count',
                  );
                  if (productCount === 0) {
                    return null;
                  }

                  return (
                    <SpSidebarRow
                      key={uuidV4()}
                      type="link"
                      title={item.name}
                      link={`/${item.url_path}`}
                      onClick={() => this.handleClickMenu(`/${item.url_path}`)}
                    />
                  );
                })}
                <SpSidebarRow
                  type="link"
                  title={translate('view_all')}
                  link={sidebarLevel2.link}
                  onClick={() => this.handleClickMenu(sidebarLevel2.link)}
                />
              </div>
            </div>

            {!showLogin && (
              <div className="sidebar-window level-1">
                <div className="sp-sidebar__head">
                  <div className="sp-sidebar__user">
                    {this.props.isCustomerLogged ? (
                      <div
                        className="sp-sidebar_user-name"
                        onClick={this.handleClickProfile}
                      >
                        <div className="user-name-container">
                          <span className="user-icon">
                            <img
                              src="/assets/icons/mobile-user.svg"
                              alt="mobile-user"
                            />
                          </span>
                          <span className="username">
                            <TextEllipsisBlogUsername>
                              {`${this.props.customer.firstname} ${this.props.customer.lastname}`}
                            </TextEllipsisBlogUsername>
                          </span>
                        </div>
                        <span className="arrow-icon">
                          <Icon name="chevron right" />
                        </span>
                      </div>
                    ) : (
                      <div className="sp-sidebar_user-name">
                        <button
                          className="sp-sidebar_button"
                          onClick={this.handleClickToLogin}
                        >
                          {translate('sp_sidebar.login')}
                        </button>
                        <button
                          className="sp-sidebar_button"
                          onClick={this.handleClickToRegister}
                        >
                          {translate('sp_sidebar.register')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sp-sidebar__content">
                  {this.renderCategories()}
                </div>
              </div>
            )}
          </div>
        </Sidebar>

        {visible && (
          <div
            className={`sidebar-overlay ${visible ? 'active' : ''}`}
            onClick={handleCloseSidebar}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isCustomerLogged: isCustomerLoggedSelector(state),
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale),
  showLogin: state.layout.showLoginSidebar,
  isCategoryNYB: findCategoryNYB(state),
  categoryLoading: state.category.loading,
  megaMenu: state.megaMenu.items,
});

const mapDispatchToProps = dispatch => ({
  toggleLogin: () => dispatch(toggleLogin()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SpSidebar),
);
