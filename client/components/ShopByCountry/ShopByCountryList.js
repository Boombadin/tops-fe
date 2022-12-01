import React, { PureComponent } from 'react';
import { map, get as prop, isEmpty, reduce, filter } from 'lodash';
import { HeadTitle } from '../../magenta-ui';
import { withBannerByName } from '../../features/banner';
import Swiper from 'swiper/dist/js/swiper.js';
import ShopByCountryItem from './ShopByCountryItem';
import PagePreloader from '../PreloaderComponent/PagePreloader';
import uuidV4 from 'uuid/v4';
import './ShopByCountryList.scss';
import withLocales from '../../hoc/withLocales';
import withStoreConfig from '../../hoc/withStoreConfig';

@withLocales
@withStoreConfig
class ShopByCountryList extends PureComponent {
  initialSwiper(node) {
    const defaultSettings = {
      slidesPerView: 'auto',
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      navigation: {
        nextEl: '.swiper-button-next-country',
        prevEl: '.swiper-button-prev-country',
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

  renderSlide() {
    const { banner, storeConfig, loading } = this.props;
    const bannerData = prop(banner.data, '0', {});
    const baseImageUrl = prop(bannerData, 'extension_attributes.image_dir');
    let slides = prop(bannerData, 'extension_attributes.slides');
    const isEnable = prop(bannerData, 'status');
    const currentStoreId = prop(storeConfig, 'id');
    const baseUrl = prop(storeConfig, 'base_media_url');

    if (loading) {
      return <PagePreloader />;
    }

    if (isEmpty(slides) || !isEnable) {
      return null;
    }

    slides = reduce(
      slides,
      (result, slide) => {
        const newSlideObj = { ...slide };

        if (slide.img_type === 1) {
          newSlideObj.img_url = `${baseUrl}${baseImageUrl}${slide.img_file}`;
        } else if (slide.img_type === 2) {
          newSlideObj.img_url = slide.img_url;
        }

        const slideIds = prop(newSlideObj, 'store_ids', []);
        const isContain = slideIds.includes(currentStoreId) || slideIds.includes(0);
        if (isContain) {
          result.push(newSlideObj);
        }

        return result;
      },
      [],
    );

    return (
      <React.Fragment>
        <div
          className="swiper-container"
          ref={node => (node ? this.initialSwiper(node) : null)}
        >
          <div className="swiper-wrapper">
            {map(slides, (slide, idx) => (
              <ShopByCountryItem index={idx} slide={slide} key={uuidV4()} />
            ))}
          </div>
          <div className="swiper-scrollbar" />
        </div>
        <div className={`swiper-button-next swiper-button-next-country`} />
        <div className={`swiper-button-prev swiper-button-prev-country`} />
      </React.Fragment>
    );
  }

  render() {
    const { title, button, titlePosition, titleLine, banner, storeConfig } = this.props;
    const bannerData = prop(banner.data, '0', {});
    const slides = prop(bannerData, 'extension_attributes.slides');
    const isSlider = !isEmpty(slides) && slides.length > 0;
    const isBanner = !isEmpty(bannerData) && bannerData.status === 1;
    const currentStoreId = prop(storeConfig, 'id');

    const slideStore = filter(slides, slide => {
      return !isEmpty(
        filter(prop(slide, 'store_ids', {}), storeId => {
          return storeId === currentStoreId;
        }),
      );
    });

    return (
      <React.Fragment>
        {isSlider && isBanner && slideStore.length > 0 && (
          <div className="shop-by-country-list-wrap">
            <HeadTitle
              className="head-title"
              topic={title}
              button={button}
              position={titlePosition}
              line={titleLine}
            />
            {this.renderSlide()}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withBannerByName(ShopByCountryList, 'Shop By Country');
