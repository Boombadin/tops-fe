import React from 'react'
import './ProductPreloader.scss'

const ProductPreloader = () => (
  <div className="preload-container">
    <div className="preload-product">
      <div className="preload-image">
        <span className="image-swatch animated-background" />
      </div>
      <div className="preload-description">
        <div className="left-block">
          <span className="title animated-background" />
          <span className="sku animated-background" />
        </div>
        <div className="right-block" />
      </div>
    </div>
  </div>
)

export default ProductPreloader
