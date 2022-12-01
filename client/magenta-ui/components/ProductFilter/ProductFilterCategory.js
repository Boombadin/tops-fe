import React from 'react'
import { NavLink } from 'react-router-dom'

const ProductFilterCategory = ({ categories, baseMediaUrl, categoriesBaseUrl, hideEmptyCategory, searchQuery }) => {
  return (
    <div className="product-filter-category">
      {categories &&
        categories.map(item => {
          const categoryIcon = item.icon_square
            ? <img className="cate-image" src={`${baseMediaUrl}catalog/category/${item.icon_square}`} alt={`Tops online ${item.name}`} />
            : <img className="cate-image default" src="/assets/icons/image-icon.svg" alt={`Tops online ${item.name}`} />
          
          if (hideEmptyCategory && (item.product_count === 0 || !item.product_count)) {
            return null
          } 

          return (
            <NavLink key={item.id} className="category-item" to={searchQuery ? `?category_id=${item.id}` : `${categoriesBaseUrl}${item.url_path}`}>
              <div className="category-item--name"><h2>{item.name}</h2></div>
              <div className="category-item--image">
                {categoryIcon}
              </div>
              <div className="category-item--couter">{item.product_count || 0}</div>
            </NavLink>
          )
        })}
    </div>
  )
}

export default ProductFilterCategory
