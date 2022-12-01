import React from 'react';
import PropTypes from 'prop-types';
import SpCateItem from './SpCateItem';
import withCategories from '../../hoc/withCategories';
import withStoreConfig from '../../hoc/withStoreConfig';
import { SubCategoryPreloader } from '../SpSubCate';
import { getActiveCategoryList } from '../../utils/category';
import { filter, get } from 'lodash';
import './SpCate.scss';

const SpCate = ({ className, mainCategory, categoryLoading, storeConfig }) => {
  if (categoryLoading) {
    return <SubCategoryPreloader />;
  }

  const imgUrl = get(storeConfig, 'base_media_url');

  return (
    <div id="sp-category" className={`sp-category ${className}`}>
      {mainCategory.map(item => (
        <SpCateItem
          key={item.name}
          title={item.name}
          link={`/${item.url_path}`}
          img={item.icon ? `${imgUrl}catalog/category/${item.icon}` : ''}
        />
      ))}
    </div>
  );
};
SpCate.propTypes = {
  className: PropTypes.string,
};

SpCate.defaultProps = {
  className: '',
};

export default withCategories(withStoreConfig(SpCate));
