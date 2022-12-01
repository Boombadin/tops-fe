import React, { Component } from 'react'
import Proptypes from 'prop-types'
import ReactImageMagnify from 'react-image-magnify';

import { Image, Icon } from "semantic-ui-react"
import './SwatchImages.scss';

class SwatchImages extends Component {
  state = {
    currentPosition: 0
  }

  handlePreviewClick = index => {
    this.setState({
      currentPosition: index
    });
  }

  renderImage = (image, alt) => {
    let component
    
    if (image) {
      component = (
        <ReactImageMagnify {
          ...{
            smallImage: {
              alt: alt,
              isFluidWidth: true,
              src: image
            },
            largeImage: {
              src: image,
              width: 800,
              height: 800
            },
            enlargedImageContainerDimensions: {
              width: '250%',
              height: '250%'
            },
            enlargedImageContainerStyle: {
              top: '-11px',
              marginLeft: '21px',
              zIndex: '9999',
              border: 0,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            },
            shouldUsePositiveSpaceLens: true,
            lensStyle: {
              background: 'rgba(255,255,255,0.3)',
              border: '1px solid #ccc'
            }
          }
        } 
        />
      )
    } else {
      component = <Icon name="picture" />
    }
    
    return component
  }

  render() {
    const { className, images, alt } = this.props;
    const { currentPosition } = this.state;

    return (
      <div className={`swatch-images-root ${className || ''}`}>
        <div className="main-image">
          {this.renderImage(images[currentPosition], alt)}
        </div>
        <div className="images-preview">
          {images.map((image, idx) => (
            <div
              key={idx}
              className={`image-preview ${idx === currentPosition ? 'image-preview-active' : ''}`}
              onClick={this.handlePreviewClick.bind(this, idx)}
            >
              {this.renderImage(image, alt)}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

SwatchImages.defaultProps = {
  className: '',
  images: []
}

SwatchImages.propTypes = {
  className: Proptypes.string.isRequired,
  images: Proptypes.array.isRequired
}

export default SwatchImages;
