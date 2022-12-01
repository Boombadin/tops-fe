import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Image.scss';
import { ProductImpressionAttr } from '../../../features/gtm/models/Product';
import { Image as ImageCoreUI } from '@central-tech/core-ui';
class Image extends Component {
  static defaultProps = {
    alt: '',
    sku: '',
    orderItem: '',
  };

  static propTypes = {
    sorting: PropTypes.string,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    sku: PropTypes.string,
    orderItem: PropTypes.number,
    product: PropTypes.object,
    section: PropTypes.string,
  };

  state = {
    status: 'loading',
  };

  handleImageLoaded = () => {
    this.setState({ status: 'success' });
  };

  handleImageErrored = () => {
    this.setState({ status: 'failed' });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.status === this.state.status &&
      nextProps.src === this.props.src
    ) {
      return false;
    }

    return true;
  }

  render() {
    const { src, alt, className, orderItem, product, section } = this.props;
    const productImpressionAttr = ProductImpressionAttr(
      product,
      section,
      orderItem,
    );
    return (
      // <img
      //   className={`${className} mt-image ${this.state.status}`}
      //   src={src}
      //   alt={alt}
      //   onLoad={this.handleImageLoaded}
      //   onError={this.handleImageErrored}
      //   {...productImpressionAttr}
      // />
      <ImageCoreUI
        className={`${className} mt-image ${this.state.status}`}
        src={src}
        alt={alt}
        defaultImage="/assets/images/tops_default.jpg"
        {...productImpressionAttr}
      />
    );
  }
}

export default Image;
