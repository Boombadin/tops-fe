import React from 'react'
import './ProductListPreloader.scss'

const ProductList = () => (
  <div className="preload-product-item">
    <span className="image animated-background" />
    <span className="title animated-background" />
    <span className="price animated-background" />
    <span className="button animated-background" />
  </div>
)

const ProductListPreloader = () => (
  <div className="preload-product-list">
    <ProductList />
    <ProductList />
    <ProductList />
    <ProductList />
    <ProductList />
  </div>
)

export default ProductListPreloader
