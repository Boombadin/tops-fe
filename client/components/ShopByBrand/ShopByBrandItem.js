import React from 'react';
import './ShopByBrandItem.scss';
import { get as prop } from 'lodash';
import { NavLink } from 'react-router-dom';
import { gtmDataAttr } from '../../utils/gtmDataAttr';

const ShopByBrandItem = ({ className, slide, index, bannerLocation }) => {
  const imgUrl = slide.img_url;
  const brandName = slide.img_title;
  const brandPromoText = slide.img_alt;
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
        className="brand-link"
        href={linkUrl}
        target={newWindow ? '_blank' : ''}
      >
        <div className="brand-img">
          <img
            src={imgUrl}
            alt={`Shop in ${brandName}`}
            {...gtmDataAttr(bannerLocation, position, imgUrl, splitUrl)}
          />
        </div>
        <div className="brand-name">{brandName}</div>
        <div className="brand-detail">{brandPromoText}</div>
      </a>
    ) : (
      <NavLink className="brand-link" to={`/${url}`}>
        <div className="brand-img">
          <img
            src={imgUrl}
            alt={`Shop in ${brandName}`}
            {...gtmDataAttr(bannerLocation, position, imgUrl, splitUrl)}
          />
        </div>
        <div className="brand-name">{brandName}</div>
        <div className="brand-detail">{brandPromoText}</div>
      </NavLink>
    );

  return (
    <div
      className={`shop-by-brand-item-wrap brand-item swiper-slide ${className}`}
    >
      {linkUrl ? (
        renderLink()
      ) : (
        <React.Fragment>
          <div className="brand-img">
            <img src={imgUrl} />
          </div>
          <div className="brand-name">{brandName}</div>
          <div className="brand-detail">{brandPromoText}</div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ShopByBrandItem;
