import React, { PureComponent } from 'react';
import { map, get, isEmpty, reduce } from 'lodash';
import { HeadTitle } from '../../../magenta-ui';
import { withBannerByName } from '../../../features/banner';
import Swiper from 'swiper/dist/js/swiper.js';
import withLocales from '../../../hoc/withLocales';
import withStoreConfig from '../../../hoc/withStoreConfig';

@withLocales
@withStoreConfig
class CarouselBanner extends PureComponent {
  initialSwiper(node) {
    const { bannerId } = this.props;
    const defaultSettings = {
      slidesPerView: 'auto',
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      navigation: {
        nextEl: `.swiper-button-next-${bannerId}`,
        prevEl: `.swiper-button-prev-${bannerId}`,
      },
      observer: true,
      observeParents: true,
      on: {
        observerUpdate: () => {
          if (window.innerWidth > 991) {
            const itemWidth = this.swiper.slides.css('width');
            const containerWidth = this.swiper.width;
            const perGroup = Math.floor(containerWidth / parseInt(itemWidth));
            this.swiper.params.slidesPerGroup = perGroup;
          }
        },
        resize: () => {
          if (window.innerWidth > 991) {
            const itemWidth = this.swiper.slides.css('width');
            const containerWidth = this.swiper.width;
            const perGroup = Math.floor(containerWidth / parseInt(itemWidth));
            this.swiper.params.slidesPerGroup = perGroup;
          }
        },
      },
      breakpoints: {
        // when window width is <= 991px
        991: {
          slidesPerGroup: 1,
        },
      },
    };

    this.swiper = new Swiper(node, defaultSettings);
  }

  generateBannerObject = (banner, storeConfig) => {
    const bannerData = get(banner.data, '0', {});
    const baseImageUrl = get(bannerData, 'extension_attributes.image_dir');
    let slides = get(bannerData, 'extension_attributes.slides');
    // const isEnable = get(bannerData, 'status');
    const currentStoreId = get(storeConfig, 'id');
    const baseUrl = get(storeConfig, 'base_media_url');

    slides = reduce(
      slides,
      (result, slide) => {
        const newSlideObj = { ...slide };

        if (slide.img_type === 1) {
          newSlideObj.img_url = `${baseUrl}${baseImageUrl}${slide.img_file}`;
        } else if (slide.img_type === 2) {
          newSlideObj.img_url = slide.img_url;
        }

        const slideIds = get(newSlideObj, 'store_ids', []);
        const isContain =
          slideIds.includes(currentStoreId) || slideIds.includes(0);
        if (isContain) {
          result.push(newSlideObj);
        }

        return result;
      },
      [],
    );

    return slides;
  };

  render() {
    const {
      title,
      button,
      titlePosition,
      titleLine,
      banner,
      storeConfig,
      bannerId,
      renderItem,
    } = this.props;
    const bannerData = get(banner.data, '0', {});
    const slides = get(bannerData, 'extension_attributes.slides');
    const isItemVisible = !isEmpty(slides) && slides.length > 0;
    const isBannerActive = !isEmpty(bannerData) && bannerData.status === 1;
    const activeSlides = this.generateBannerObject(banner, storeConfig);

    return (
      <React.Fragment>
        {isItemVisible && isBannerActive && activeSlides.length > 0 && (
          <div className={`shop-by-${bannerId}-list-wrap`}>
            <HeadTitle
              className="head-title"
              topic={title}
              button={button}
              position={titlePosition}
              line={titleLine}
            />
            <React.Fragment>
              <div
                className="swiper-container"
                ref={node => (node ? this.initialSwiper(node) : null)}
              >
                <div className="swiper-wrapper">
                  {map(
                    activeSlides,
                    (slide, key) => renderItem && renderItem(slide, key),
                  )}
                </div>
                <div className="swiper-scrollbar" />
              </div>
              <div
                className={`swiper-button-next swiper-button-next-${bannerId}`}
              />
              <div
                className={`swiper-button-prev swiper-button-prev-${bannerId}`}
              />
            </React.Fragment>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withBannerByName(CarouselBanner);
