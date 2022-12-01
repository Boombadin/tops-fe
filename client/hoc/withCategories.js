import React from 'react';
import { connect } from 'react-redux';
import { fetchCategory } from '../reducers/category';

const withCategories = WrappedComponent => {
  class HoC extends React.PureComponent {
    render() {
      const { children, categories, categoryLoading, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          categories={categories}
          categoryLoading={categoryLoading}
        >
          {children}
        </WrappedComponent>
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(HoC);
};

const mapStateToProps = state => ({
  categories: state.category.items,
  mainCategory: state.category.mainCategory,
  categoryLoading: state.category.loading,
});

const mapDispatchToProps = dispatch => ({
  fetchCategory: () => dispatch(fetchCategory()),
});

export default withCategories;
