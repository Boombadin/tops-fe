import React from 'react';
import pt from 'prop-types';
import { get as prop, map } from 'lodash';
import moment from 'moment';
import { localize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import Heart from '../../components/Icons/TabBar/Heart';
import Deal from '../../components/Icons/TabBar/Deal';
import Privilege from '../../components/Icons/TabBar/Privilege';
import Cart from '../../components/Icons/TabBar/Cart';
// import Basket from '../../components/Icons/TabBar/Basket';
// import Charity from '../../components/Icons/TabBar/Charity';
import TopsPick from '../../components/Icons/TabBar/TopsPick';
import SeasonalCny from '../../components/Icons/TabBar/SeasonalCny';
import './Tabbar.scss';
import {
  ROUTE_CATEGORY_NYB,
  ROUTE_NEW_YEAR_BUSKET,
  ROUTE_NEW_YEAR_BUSKET_TAB_2,
  ROUTE_NEW_YEAR_BUSKET_TAB_3,
} from '../../config/promotions';
import { makeGetCategoryNYB } from '../../features/nyb';
import uuidV4 from 'uuid/v4';

const Tabbar = ({ translate, ...props }) => (
  <div className="navigation-bar">
    <div className="navigation-item">
      <NavLink
        exact
        to="/"
        className="navigation-link"
        isActive={(_, location) => {
          return props.fill.every(x => !location.pathname.includes(x));
        }}
      >
        <Cart
          className="navigation-link-icon"
          fill={
            props.fill.every(x => !props.location.pathname.includes(x))
              ? '#fff'
              : '#333'
          }
        />
        <span>{translate('tabbar.all_product')}</span>
      </NavLink>
    </div>
    {/* {
      props.isCategoryNyb && (
        <div className="navigation-item">
          <NavLink
            to={ROUTE_CATEGORY_NYB}
            className="navigation-link"
            isActive={(_, location) =>
              [
                ROUTE_CATEGORY_NYB,
                ROUTE_NEW_YEAR_BUSKET,
                ROUTE_NEW_YEAR_BUSKET_TAB_2,
                ROUTE_NEW_YEAR_BUSKET_TAB_3,
              ].some(x => location.pathname.includes(x))
            }
          >
            <Basket
              className="navigation-link-icon"
              fill={[
                ROUTE_CATEGORY_NYB,
                ROUTE_NEW_YEAR_BUSKET,
                ROUTE_NEW_YEAR_BUSKET_TAB_2,
                ROUTE_NEW_YEAR_BUSKET_TAB_3,
              ].some(x => props.location.pathname.includes(x))
                ? '#fff'
                : '#333'}
            />
            {translate('new_year_hamper')}
          </NavLink>
        </div>
      )
    } */}
    {map(prop(props, 'megaMenu.items'), item => {
      return (
        moment(prop(item, 'start_date')) <= moment(prop(item, 'end_date')) && (
          <div className="navigation-item" key={uuidV4()}>
            <NavLink to={`/${item.url}`} className="navigation-link">
              <svg width="18" height="17" viewBox="0 0 18 17">
                <image
                  xlinkHref={
                    !props.location.pathname.includes(`/${item.url}`)
                      ? item.icon
                      : item.inactive_icon
                  }
                  width="18"
                  height="17"
                />
              </svg>
              {item.name}
            </NavLink>
          </div>
        )
      );
    })}
    {props.isCategoryNyb && prop(props, 'isCnyTabbar', false) && (
      <div className="navigation-item">
        <NavLink
          to="/campaign/promotion-product-chinese-new-year-2019"
          className="navigation-link"
        >
          <SeasonalCny
            className="navigation-link-icon"
            fill={
              props.location.pathname.includes(
                '/campaign/promotion-product-chinese-new-year-2019',
              )
                ? '#fff'
                : '#333'
            }
          />
          {translate('tabbar.seasonal_cny')}
        </NavLink>
      </div>
    )}
    <div className="navigation-item">
      <NavLink to="/wishlist" className="navigation-link">
        <Heart
          className="navigation-link-icon"
          fill={props.location.pathname.includes('/wishlist') ? '#fff' : '#333'}
        />
        {translate('tabbar.my_list')}
      </NavLink>
    </div>
    <div className="navigation-item">
      <NavLink to="/deals" className="navigation-link">
        <Deal
          className="navigation-link-icon"
          fill={props.location.pathname.includes('/deals') ? '#fff' : '#333'}
        />
        {translate('tabbar.deal')}
      </NavLink>
    </div>
    <div className="navigation-item">
      <NavLink to="/privilege" className="navigation-link">
        <Privilege
          className="navigation-link-icon"
          fill={
            props.location.pathname.includes('/privilege') ? '#fff' : '#333'
          }
        />
        {translate('tabbar.special_offer')}
      </NavLink>
    </div>
    {/* <div className="navigation-item">
      <NavLink to="/offer" className="navigation-link">
        <Charity className="navigation-link-icon" fill={props.location.pathname.includes('/offer') ? '#fff' : '#333'}/>
        {translate('tabbar.offer')}
      </NavLink>
    </div> */}
    <div className="navigation-item">
      <a
        href="https://www.topspicks.tops.co.th/"
        target="_blank"
        rel="noopener noreferrer"
        className="navigation-link"
      >
        <TopsPick
          className="navigation-link-icon"
          fill={props.location.pathname.includes('/top_pick') ? '#fff' : '#333'}
        />
        {translate('tabbar.top_pick')}
      </a>
    </div>
  </div>
);

Tabbar.propTypes = {
  translate: pt.func.isRequired,
};

const makeMapStateToProps = state => {
  const getIsCategoryNyb = makeGetCategoryNYB();
  const dateCurrent = moment();
  const dateEnd = moment('2019-02-03 23:59:59');

  const fill = [
    ROUTE_CATEGORY_NYB,
    ROUTE_NEW_YEAR_BUSKET,
    ROUTE_NEW_YEAR_BUSKET_TAB_2,
    ROUTE_NEW_YEAR_BUSKET_TAB_3,
    '/campaign/promotion-product-chinese-new-year-2019',
    '/wishlist',
    '/deals',
    '/privilege',
    '/special_offer',
    '/offer',
    '/top_pick',
  ];

  map(prop(state, 'megaMenu.items.items', []), item => {
    fill.push(`/${item.url}`);
  });

  return () => ({
    isCategoryNyb: getIsCategoryNyb(state),
    isCnyTabbar: dateCurrent <= dateEnd,
    megaMenu: state.megaMenu.items,
    fill,
  });
};

export default withRouter(
  connect(makeMapStateToProps, {})(localize(Tabbar, 'locale')),
);
