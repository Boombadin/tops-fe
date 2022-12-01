import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';

const HeroBanner = ({ className, setting, children }) => {
  const markupClassName = `mt-hero-banner ${className}`;

  const defaultSettings = {
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  const objSetting = Object.assign({}, defaultSettings, setting);

  return (
    <div className={markupClassName}>
      <Swiper {...objSetting}>{children}</Swiper>
    </div>
  );
};

HeroBanner.propTypes = {
  className: PropTypes.string,
  slides: PropTypes.array,
  bannerHeight: PropTypes.number,
};

HeroBanner.defaultProps = {
  className: '',
  slides: [],
  bannerHeight: 230,
};

export default HeroBanner;
