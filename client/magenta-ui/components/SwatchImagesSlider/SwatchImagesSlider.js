import React, { Component } from 'react';
import { size } from 'lodash';
import Proptypes from 'prop-types';
import Swiper from 'react-id-swiper';
import { Image } from '@central-tech/core-ui';
import uuidV4 from 'uuid/v4';
import './SwatchImagesSlider.scss';

class SwatchImagesSlider extends Component {
  render() {
    const { className, images, alt } = this.props;
    const params = {
      slidePerView: 1,
      loop: true,
      pagination: {
        el: size(images) > 1 && '.swiper-pagination',
        clickable: true,
      },
      rebuildOnUpdate: true,
      noSwiping: size(images) <= 1 && true,
    };

    return (
      <div className={`mt-img-slider ${className}`}>
        <Swiper {...params}>
          {images.map(image => (
            <div className="img-slider" key={uuidV4}>
              <Image src={image} alt={alt} />
            </div>
          ))}
        </Swiper>
      </div>
    );
  }
}

SwatchImagesSlider.defaultProps = {
  className: '',
  images: [],
};

SwatchImagesSlider.propTypes = {
  className: Proptypes.string,
  images: Proptypes.array,
};

export default SwatchImagesSlider;
