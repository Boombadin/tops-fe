import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, filter, isEmpty, includes } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Text } from '@central-tech/core-ui';
import { Menu, Image } from '../../magenta-ui';
import SpSidebar from './SpSidebar';
import SidebarPreloader from './SidebarPreloader';
import './Sidebar.scss';
import { fetchCategory } from '../../reducers/category';
import {
  isCustomerLoggedSelector,
  getCustomerSelector,
  isAppGrab,
} from '../../selectors';
import { Sticky } from 'react-sticky';

const NavMenu = styled(Text)`
  cursor: pointer;
`;

class Sidebar extends PureComponent {
  static propTypes = {
    cmsBlock: PropTypes.array,
    isGrabProvider: PropTypes.bool,
  };

  static defaultProps = {
    cmsBlock: [],
    isGrabProvider: false,
  };

  renderNavItem(item) {
    const { storeConfig, location } = this.props;
    const activeItem = '';
    const iconCate = item.icon
      ? `${storeConfig.base_media_url}catalog/category/${item.icon}`
      : `/assets/icons/sort-right.png`;

    const currentPathname = location.pathname;
    const currentCateLevel2 = currentPathname.split('/')[1];

    return (
      <Menu.Item
        key={item.url_key}
        className={`sidebar-item ${
          item.url_key === currentCateLevel2 ? 'active' : ''
        }`}
        name={item.name}
        active={activeItem === item.name}
      >
        <NavMenu
          as="a"
          className="sidebar-link"
          onClick={() => this.props.history.push(`/${item.url_path}`)}
        >
          {(item.icon && (
            <Image
              src={iconCate}
              className="category-icon"
              alt={`Tops online ${item.name}`}
            />
          )) || (
            <img className="category-icon" src={iconCate} alt={item.name} />
          )}
          {item.name}
        </NavMenu>
        <span className="sidebar-icon">
          <i className="nav-icon" />
        </span>
      </Menu.Item>
    );
  }

  renderNavItems() {
    const { mainCategory } = this.props;
    const CustomItemsComponent = this.props.customItems;

    if (CustomItemsComponent) {
      return <CustomItemsComponent />;
    }

    if (isEmpty(this.props.mainCategory)) {
      return <SidebarPreloader />;
    }

    const categoryComponents = mainCategory.map(categ =>
      this.renderNavItem(categ),
    );
    return categoryComponents;
  }

  renderNavigation() {
    return (
      <Menu text vertical>
        {this.renderNavItems()}
      </Menu>
    );
  }

  render() {
    const {
      categories,
      storeConfig,
      customer,
      category,
      visible,
      handleCloseSidebar,
      cmsBlock,
      isGrabProvider,
    } = this.props;

    let filterData;
    if (!isGrabProvider) {
      filterData = filter(cmsBlock, val => {
        return (
          includes(
            val.identifier,
            !isEmpty(customer)
              ? 'promo_banner_homepage_customer'
              : 'promo_banner_homepage_guest',
          ) && val.active === true
        );
      });
    }

    const filterRoyalBanner = filter(cmsBlock, val => {
      return (
        includes(val.identifier, 'royal_header_banner') && val.active === true
      );
    });

    return (
      <div id="sidebar">
        <Sticky disableCompensation>
          {({ style }) => (
            <div style={{ ...style, top: 90 }} className={`sidebar pc-sideber`}>
              {this.renderNavigation()}
            </div>
          )}
        </Sticky>

        <SpSidebar
          baseUrl={storeConfig.base_media_url}
          categories={categories}
          category={category}
          visible={visible}
          handleCloseSidebar={handleCloseSidebar}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  categoryLoading: state.category.loading,
  customer: getCustomerSelector(state),
  error: state.category.error,
  categories: state.category.items,
  mainCategory: state.category.mainCategory,
  category: find(
    state.category.items,
    categ => categ.id.toString() === ownProps.activeCategory,
  ),
  storeConfig: state.storeConfig.current,
  translate: getTranslate(state.locale),
  cmsBlock: state.cmsBlock.items,
  isCustomerLogged: isCustomerLoggedSelector(state),
  isGrabProvider: isAppGrab(state),
});

const mapDispatchToProps = {
  fetchCategory,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar),
);
