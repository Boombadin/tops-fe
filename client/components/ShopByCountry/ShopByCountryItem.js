import React from 'react';
import { get as prop } from 'lodash';
import { NavLink } from 'react-router-dom';
import './ShopByCountryItem.scss';
import { gtmDataAttr } from '../../utils/gtmDataAttr';

const ShopByCountryItem = ({ className, slide, index, bannerLocation }) => {
  const imgUrl = slide.img_url;
  const imgAlt = slide.img_alt;
  const newWindow = slide.is_open_url_in_new_window;
  const linkUrl = slide.url;
  const splitUrl = !linkUrl.split('/th/').length
    ? linkUrl.split('/en/')
    : linkUrl.split('/th/');
  const url = prop(splitUrl, '1', '');
  const isUrl = Boolean(url);
  const position = index + 1;

  const renderLink = () =>
    !isUrl ? (
      <a
        className="country-link"
        href={linkUrl}
        target={newWindow ? '_blank' : ''}
      >
        <div className="country-img">
          <img
            src={imgUrl}
            alt={imgAlt}
            {...gtmDataAttr(bannerLocation, position, imgUrl, linkUrl)}
          />
        </div>
      </a>
    ) : (
      <NavLink className="country-link" to={`/${url}`}>
        <div className="country-img">
          <img
            src={imgUrl}
            alt={imgAlt}
            {...gtmDataAttr(bannerLocation, position, imgUrl, linkUrl)}
          />
        </div>
      </NavLink>
    );

  return (
    <div
      className={`shop-by-country-item-wrap country-item swiper-slide ${className}`}
    >
      {linkUrl ? (
        renderLink()
      ) : (
        <div className="country-img">
          <img
            src={imgUrl}
            alt={imgAlt}
            {...gtmDataAttr(bannerLocation, position, imgUrl, linkUrl)}
          />
        </div>
      )}
    </div>
  );
};

export default ShopByCountryItem;
