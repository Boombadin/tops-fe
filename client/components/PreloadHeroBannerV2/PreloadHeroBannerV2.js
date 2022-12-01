import React, { useEffect, useState } from 'react';
import { string, object } from 'prop-types';
import { map, get as prop, isEmpty, reduce } from 'lodash';
import { HeroBanner } from '../../magenta-ui';
import { PagePreloader } from '../PreloaderComponent';
import { gtmDataAttr } from '../../utils/gtmDataAttr';

const PreloadHeroBannerV2 = ({
  banner,
  className,
  id,
  loading,
  config,
  bannerLocation,
}) => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const baseUrl = prop(config, 'base_media_url');
    const currentStoreId = prop(config, 'id');
    const slides = prop(banner, 'extension_attributes.slides');
    const baseImageUrl = prop(banner, 'extension_attributes.image_dir');

    const slideFormated = reduce(
      slides,
      (result, slide) => {
        const newSlideObj = { ...slide };

        if (slide.img_type === 1) {
          newSlideObj.img_url = `${baseUrl}${baseImageUrl}${slide.img_file}`;
        } else if (slide.img_type === 2) {
          newSlideObj.img_url = slide.img_url;
        }

        const slideIds = prop(newSlideObj, 'store_ids', []);
        const isContain =
          slideIds.includes(currentStoreId) || slideIds.includes(0);

        if (isContain) {
          result.push(newSlideObj);
        }

        return result;
      },
      [],
    );

    setSlides(slideFormated);
  }, [banner]);

  if (loading) {
    return <PagePreloader />;
  }

  const shouldRenderSlider = !isEmpty(slides) && prop(banner, 'status');

  if (!shouldRenderSlider) {
    return null;
  }

  const isSingleSlider = slides.length > 1;
  const displayArrow = banner.display_arrows;
  const displayBullets = banner.display_bullets;
  const slideDelay = banner.pause_time_between_transitions;
  const speed = banner.slide_transition_speed;

  const settings = {
    autoplay: true,
    infinite: true,
    speed: speed || 500,
    autoplaySpeed: slideDelay || 4000,
    shouldSwiperUpdate: true,
    slidesPerView: 'auto',
    loop: true,
    navigation: displayArrow
      ? {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      : false,
    pagination: displayBullets
      ? {
          el: '.swiper-pagination',
          clickable: true,
        }
      : false,
  };

  return (
    <div id={id} className={`tops-hero-banner ${className}`}>
      {(isSingleSlider && (
        <HeroBanner setting={settings}>
          {map(slides, (slide, idx) => (
            <SliderItem
              key={idx}
              index={idx}
              slide={slide}
              bannerLocation={bannerLocation}
            />
          ))}
        </HeroBanner>
      )) || (
        <SliderItem
          slide={slides[0]}
          className="single-slider"
          bannerLocation={bannerLocation}
        />
      )}
    </div>
  );
};

// eslint-disable-next-line react/no-multi-comp
const SliderItem = ({ index, slide, className, bannerLocation }) => {
  const imgUrl = slide.img_url;
  const imgAlt = slide.img_alt;
  const newWindow = slide.is_open_url_in_new_window;
  const linkUrl = slide.url;
  const position = index + 1;

  return (
    <div className={`swiper-slide ${className}`}>
      {linkUrl ? (
        <a href={linkUrl} target={newWindow ? '_blank' : ''}>
          <img
            src={imgUrl}
            alt={`Tops online ${imgAlt}`}
            {...gtmDataAttr(bannerLocation, position, imgUrl, linkUrl)}
          />
        </a>
      ) : (
        <img
          src={imgUrl}
          alt={`Tops online ${imgAlt}`}
          {...gtmDataAttr(bannerLocation, position, imgUrl, linkUrl)}
        />
      )}
    </div>
  );
};

SliderItem.propTypes = {
  slide: object.isRequired,
  className: string,
};

SliderItem.defaultProps = {
  className: '',
};

export default React.memo(PreloadHeroBannerV2);
