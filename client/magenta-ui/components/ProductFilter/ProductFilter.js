import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get as prop, find, map, reduce } from 'lodash';
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';
import ProductFilterCategory from './ProductFilterCategory';
import ProductFilterItem from './ProductFilterItem';

resetIdCounter();

class ProductFilter extends Component {
  static defaultProps = {
    labelCategory: 'Categories',
    allowKey: '*',
    fixCategory: false,
    labelResetButton: 'reset',
    nodataMessage: 'No Filter Data',
    type: 'tab',
    disabled: false,
    ignoreKey: [],
    onFilterReset: () => {},
    resetCurrentIndex: () => {},
    loading: false,
    onFilterChange: () => {},
    categories: [],
    categoriesBaseUrl: '/',
    hideEmptyCategory: false,
  };

  static propTypes = {
    filters: PropTypes.array.isRequired,
    categories: PropTypes.array,
    badgeConfig: PropTypes.object.isRequired,
    badgeBaseUrl: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func,
    loading: PropTypes.bool,
    resetCurrentIndex: PropTypes.func,
    onFilterReset: PropTypes.func,
    ignoreKey: PropTypes.array,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    nodataMessage: PropTypes.string,
    labelResetButton: PropTypes.string,
    fixCategory: PropTypes.bool,
    categoriesBaseUrl: PropTypes.string,
    labelCategory: PropTypes.string,
    allowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    hideEmptyCategory: PropTypes.bool,
    searchQuery: PropTypes.string,
  };

  filtersObj = null;
  filterId = null;

  state = {
    curIndex: 0,
  };

  componentDidMount() {
    this.filtersObj = reduce(
      this.props.filters,
      (result, e) => {
        if (this.isAllow(e.attribute_code)) {
          result.push(e);
        }

        return result;
      },
      [],
    );
  }

  componentDidUpdate(prevProp) {
    if (prevProp.filters !== this.props.filters) {
      this.filtersObj = reduce(
        this.props.filters,
        (result, e) => {
          if (this.isAllow(e.attribute_code)) {
            result.push(e);
          }

          return result;
        },
        [],
      );

      const currentActiveId = prop(this.filtersObj[this.state.curIndex], 'attribute_code');

      if (this.filterId && currentActiveId !== this.filterId) {
        const realIndex = map(this.filtersObj, e => e.attribute_code).indexOf(this.filterId);

        if (realIndex >= 0) {
          this.handleSelectTab(realIndex);
        } else {
          this.handleSelectTab(0);
        }
      }
    }
  }

  resetIndex = () => {
    this.setState({
      curIndex: 0,
    });
  };

  handleSelectTab = index => {
    this.filterId = prop(this.filtersObj[index], 'attribute_code');
    this.setState({ curIndex: index });
  };

  isAllow = attributeCode => {
    return (
      !this.props.ignoreKey.includes(attributeCode) &&
      (this.props.allowKey === '*' || this.props.allowKey.includes(attributeCode))
    );
  };

  render() {
    const {
      filters,
      categories,
      badgeBaseUrl,
      onFilterChange,
      onFilterReset,
      disabled,
      type,
      nodataMessage,
      labelResetButton,
      fixCategory,
      labelCategory,
      categoriesBaseUrl,
      hideEmptyCategory,
      searchQuery,
    } = this.props;

    const renderPusherFilter = filters.map(filter => {
      if (this.isAllow(filter.attribute_code)) {
        return (
          <div className="product-filter-pusher-elem" key={filter.attribute_code}>
            <div
              id={`product-filter-pusher-header--${filter.attribute_code}`}
              className="product-filter-pusher-header"
            >
              <span className="title">{filter.name}</span>
            </div>
            <div className="collape-body">
              <div className="product-filter-pusher-list">
                {this.isAllow(filter.attribute_code) ? (
                  <div key={filter.attribute_code}>
                    {filter.items.map((listItem, idx) => {
                      return (
                        <ProductFilterItem
                          key={idx}
                          code={filter.attribute_code}
                          item_count={listItem.item_count}
                          label={listItem.label}
                          value={listItem.value}
                          checked={listItem.checked}
                          onChange={onFilterChange}
                          disabled={disabled}
                          icon={listItem.icon}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      }
    });

    const filterTabList = filters.map(filter => {
      const isChecked = find(filter.items, item => item.checked);
      if (this.isAllow(filter.attribute_code)) {
        return (
          <Tab key={filter.attribute_code}>
            <div
              id={`product-filter--elem--${filter.attribute_code}`}
              className="product-filter--elem"
            >
              <span className="title">{filter.name}</span>
              {isChecked && <span className="has-selected" />}
            </div>
          </Tab>
        );
      }
    });

    const filterTabPane = filters.map(filter => {
      if (this.isAllow(filter.attribute_code)) {
        return (
          <TabPanel key={filter.attribute_code}>
            {filter.items.map((listItem, idx) => {
              return (
                <ProductFilterItem
                  key={idx}
                  code={filter.attribute_code}
                  item_count={listItem.item_count}
                  label={listItem.label}
                  value={listItem.value}
                  checked={listItem.checked}
                  onChange={onFilterChange}
                  disabled={disabled}
                  icon={listItem.icon}
                />
              );
            })}
          </TabPanel>
        );
      }
    });

    return (
      <div id="product-filter" className={`product-filter product-filter--${type}`}>
        {type === 'tab' && (
          <Tabs
            className="product-filter--tabs"
            selectedIndex={this.state.curIndex}
            onSelect={this.handleSelectTab}
          >
            <div className="product-filter--container">
              <TabList className="product-filter--tablist">
                {fixCategory && (
                  <Tab key="category">
                    <span className="title">{labelCategory}</span>
                  </Tab>
                )}
                {filterTabList}
              </TabList>
              <button className="reset-all" onClick={onFilterReset}>
                {labelResetButton}
              </button>
            </div>

            {fixCategory && (
              <TabPanel className="category--filters" key="category">
                <ProductFilterCategory
                  baseMediaUrl={badgeBaseUrl}
                  categories={categories}
                  categoriesBaseUrl={categoriesBaseUrl}
                  hideEmptyCategory={hideEmptyCategory}
                  searchQuery={searchQuery}
                />
              </TabPanel>
            )}

            {filterTabPane}
          </Tabs>
        )}

        {type === 'pusher' && (
          <div className="product-filter--pusher">
            {filters && filters.length == 0 && <div className="nodata">{nodataMessage}</div>}
            {renderPusherFilter}
          </div>
        )}
      </div>
    );
  }
}

export default ProductFilter;
