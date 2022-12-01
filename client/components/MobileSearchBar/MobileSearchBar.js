import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { NavLink } from 'react-router-dom';
import pt from 'prop-types';
import {
  isEmpty,
  map,
  filter,
  find,
  last,
  get,
  uniq,
  reverse,
  size,
  first,
  slice,
} from 'lodash';
import { withRouter } from 'react-router-dom';
import Cookie from 'js-cookie';
import queryString from 'query-string';
import { Icon } from '../../magenta-ui';
import {
  getBrandSuggestions,
  getDefaultSuggestions,
  getCategorySuggestions,
} from '../../selectors';
import { fetchSuggestions, removeSuggestions } from '../../reducers/search';
import './MobileSearchBar.scss';
import {
  gtmSearchSuggestionLabel,
  gtmSearchSuggestionAttr,
} from '../../utils/gtmSearchTracking';
import { getCookie } from '../../utils/cookie';
import withCategories from '../../hoc/withCategories';

const DEFAULT_SORT = 'relevance,desc';
const BACKSPACE_KEY = 8;
const ENTER = 13;
@withCategories
class MobileSearchBar extends PureComponent {
  input = null;

  static propTypes = {
    translate: pt.func.isRequired,
    fetchSuggestions: pt.func.isRequired,
    customer: pt.object,
  };

  state = {
    inputValue: '',
    showSuggestions: false,
    showAll: false,
    searchValues: [],
    searchKeySuggestion: [],
    showSearchKeySuggestion: false,
  };

  componentDidMount() {
    const { customer } = this.props;
    const customerId = get(customer, 'id', '').toString();
    const keySearch = `search_${customerId}`;
    this.searchInput.focus();

    if (!isEmpty(getCookie(keySearch))) {
      this.setState({
        searchKeySuggestion: reverse(JSON.parse(getCookie(keySearch))),
      });
    }

    if (!this.props.location.pathname.includes('/search')) {
      return;
    }
    const pathnameArray = this.props.location.pathname.split('/');
    const multiSearch = pathnameArray[2];
    const searchValues = multiSearch
      .split(',')
      .filter(q => !!q)
      .map(decodeURIComponent);

    // const searchValues = window.location.pathname.slice(8).split(',').filter(q => !!q).map(decodeURIComponent);
    const searchParams = queryString.parse(window.location.search);
    const { category_id: categoryId } = searchParams;
    const sort = searchParams.sort || DEFAULT_SORT;

    this.setState({ searchValues, sort, categoryId });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.searchKeySuggestion.length > 0 &&
      isEmpty(this.state.inputValue) &&
      isEmpty(this.state.searchValues)
    ) {
      this.setState({ showSearchKeySuggestion: true });
    } else {
      this.setState({ showSearchKeySuggestion: false });
    }
  }

  getSearchValues = () => {
    const { location } = this.props;
    const pathnameArray = location.pathname.split('/');
    const multiSearch = pathnameArray[2];
    const searchValues = multiSearch
      .split(',')
      .filter(q => !!q)
      .map(decodeURIComponent);

    return searchValues;
  };

  setSuggestSearchKeyValue = inputValue => {
    const { customer } = this.props;

    if (!isEmpty(customer)) {
      let searchKey = [];
      if (isEmpty(getCookie(`search_${get(customer, 'id', {})}`))) {
        searchKey.push(inputValue);
        Cookie.set(`search_${get(customer, 'id')}`, JSON.stringify(searchKey));
      } else {
        searchKey = JSON.parse(getCookie(`search_${get(customer, 'id', {})}`));
        const checkSearchKeyDuplicate = filter(searchKey, key => {
          return key === inputValue;
        });

        if (checkSearchKeyDuplicate.length <= 0) {
          searchKey.push(inputValue);

          if (searchKey.length > 4) {
            searchKey.shift();
          }

          Cookie.set(
            `search_${get(customer, 'id')}`,
            JSON.stringify(searchKey),
          );
        }
      }
    }
  };

  handleInputChange = event => {
    const { value } = event.target;
    if (size(this.props.categories) <= 0) {
      this.props.fetchCategory();
    }
    if (!value) {
      this.props.removeSuggestions();

      return this.setState({
        showSearchKeySuggestion: true,
        showSuggestions: false,
        inputValue: '',
      });
    }

    if (this.suggestionTimeoutId) {
      clearTimeout(this.suggestionTimeoutId);
    }

    this.suggestionTimeoutId = setTimeout(() => {
      this.props.fetchSuggestions(value);
      this.suggestionTimeoutId = null;
    }, 500);

    this.setState({
      showSearchKeySuggestion: false,
      showSuggestions: true,
      inputValue: value.trimLeft(),
    });
  };

  handleInputFocus = () => {
    const { inputValue, searchValues } = this.state;

    if (isEmpty(inputValue) && isEmpty(searchValues)) {
      this.props.removeSuggestions();
      this.setState({ showSuggestions: false });
    } else {
      this.setState({ showSuggestions: true });
    }
  };

  handleClickTermSuggestion = suggestion => {
    const searchValues = [...this.state.searchValues];

    if (!searchValues.includes(suggestion.title)) {
      searchValues.push(suggestion.title);
    }

    this.setState({
      inputValue: '',
      searchValues,
    });

    this.input.focus();

    this.props.history.push(`/search/${searchValues}`);
  };

  handleClickProductSuggestion = suggestion => {
    const { suggestions } = this.props;

    // const sizeProdSuggest = size(suggestions.filter(s => s.type === 'product'));
    const sizeProdSuggest = size(get(suggestions, 'product', ''));

    dataLayer.push({
      event: 'suggest-product',
      SearchResultCount: sizeProdSuggest,
    });
    const searchValues = [...this.state.searchValues];

    if (!searchValues.includes(suggestion.title)) {
      searchValues.push(suggestion.title);
    }

    if (!isEmpty(suggestion)) {
      this.setSuggestSearchKeyValue(get(suggestion, 'title', ''));
    }

    this.setState({
      inputValue: '',
      searchValues,
    });

    this.props.removeSuggestions();
    this.props.closeSearchSuggestion();
    this.props.history.push(`/search/${searchValues}`);
  };

  handleClickSubmit = () => {
    const queries = [...this.state.searchValues];
    const { searchValues, inputValue } = this.state;

    if (inputValue) {
      this.setState({
        searchValues: uniq([...searchValues, inputValue]),
        inputValue: '',
      });

      this.setSuggestSearchKeyValue(inputValue);
    }

    if (inputValue && !queries.includes(inputValue)) {
      queries.push(inputValue);
    }

    if (isEmpty(queries)) {
      return;
    }

    this.props.removeSuggestions();
    this.props.closeSearchSuggestion();
    this.props.history.push(`/search/${queries}`);
  };

  handleRemoveSearchValue = value => {
    const searchValues = filter(this.state.searchValues, v => v !== value);

    this.setState({ searchValues });

    if (isEmpty(searchValues)) {
      this.props.history.push('/');
      this.props.removeSuggestions();
    } else {
      this.props.history.push(`/search/${searchValues}`);
    }
  };

  handleShowAllTags = () => {
    this.setState({ showAll: true });
  };

  handleCategorySuggestionClick = suggestion => {
    if (!this.state.inputValue) {
      return;
    }

    const category = find(
      this.props.categories,
      c => c.url_path === suggestion.url,
    );
    this.setSuggestSearchKeyValue(get(category, 'name', ''));

    let href = `/search/${this.state.inputValue}?category_id=${get(
      suggestion,
      'id',
      '',
    )}`;

    const categorySuggest = this.props.categories.find(el => {
      return el.id === get(category, 'id', '');
    });
    dataLayer.push({
      event: 'suggest-cat',
      SearchResultCount: get(
        categorySuggest,
        'extension_attributes.product_count',
      ),
    });

    if (this.state.sort && this.state.sort !== DEFAULT_SORT) {
      href += `&sort=${this.state.sort}`;
    }

    this.props.closeSearchSuggestion();
    this.props.history.push(href);
  };

  renderSuggestionName = suggestion => {
    const { inputValue } = this.state;

    let index;
    let suggestionTitle = get(suggestion, 'title', '');
    if (get(suggestion, 'type') === 'brand_name') {
      index = suggestion.attribute.label
        .toLowerCase()
        .indexOf(inputValue.toLowerCase().trim());
    } else if (get(suggestion, 'type') === 'category') {
      suggestionTitle = `${inputValue}${suggestionTitle}`;
      index = suggestionTitle
        .toLowerCase()
        .indexOf(inputValue.toLowerCase().trim());
    } else {
      index = suggestionTitle
        .toLowerCase()
        .indexOf(inputValue.toLowerCase().trim());
    }

    const searchSuggestionLabel = gtmSearchSuggestionLabel(
      inputValue,
      suggestion,
    );
    if (inputValue && index !== -1) {
      return (
        <span className="name">
          <span {...searchSuggestionLabel}>
            {suggestionTitle.slice(0, index)}
          </span>
          <span className="bold-name" {...searchSuggestionLabel}>
            {suggestionTitle.slice(index, index + inputValue.length)}
          </span>
          <span {...searchSuggestionLabel}>
            {suggestionTitle.slice(index + inputValue.length)}
          </span>
        </span>
      );
    }

    return (
      <span className="name" {...searchSuggestionLabel}>
        {suggestionTitle}
      </span>
    );
  };

  renderBrandSuggestion = suggestion => {
    const { inputValue } = this.state;
    return (
      <NavLink
        key={`brand-${suggestion.url}`}
        to={`/${suggestion.url}`}
        className="brand-suggestion"
      >
        {this.renderSuggestionName(suggestion)}
        <Icon
          className="chevron right"
          {...gtmSearchSuggestionLabel(inputValue, suggestion)}
        />
      </NavLink>
    );
  };

  renderDefaultSuggestion = suggestion => {
    const { inputValue } = this.state;
    if (suggestion.type === 'term') {
      return (
        <div
          key={`term-${get(suggestion, 'url')}`}
          className="term-suggestion"
          // onClick={this.handleClickTermSuggestion.bind(this, suggestion)}
          onClick={() => this.handleClickProductSuggestion(suggestion)}
        >
          {this.renderSuggestionName(suggestion)}
          <Icon
            className="arrow left"
            {...gtmSearchSuggestionLabel(inputValue, suggestion)}
          />
        </div>
      );
    }
    return (
      <NavLink
        onClick={() => this.handleClickProductSuggestion(suggestion)}
        key={`product-${get(suggestion, 'sku')}`}
        to={`/${get(suggestion, 'url')}?from=search`}
        className="product-suggestion"
        {...gtmSearchSuggestionAttr(inputValue, suggestion)}
      >
        <img
          className="image"
          src={`${this.props.storeConfig.base_media_url}catalog/product/${get(
            suggestion,
            'image',
          )}`}
          alt={get(suggestion, 'title')}
        />
        {this.renderSuggestionName(suggestion)}
        <Icon className="arrow left" />
      </NavLink>
    );
  };

  renderCategorySuggestion = suggestion => {
    const { inputValue } = this.state;
    return (
      <div
        key={`category-${suggestion.url}`}
        className="category-suggestion"
        // onClick={this.handleCategorySuggestionClick.bind(this, suggestion)}
        onClick={() => this.handleCategorySuggestionClick(suggestion)}
        {...gtmSearchSuggestionLabel(inputValue, suggestion)}
      >
        {this.renderSuggestionName(suggestion)}
      </div>
    );
  };

  renderSearchValues = () => {
    const { searchValues, showAll } = this.state;

    return (
      <div className="mobile-search-multisearch-values">
        {map(searchValues.slice(0, 2), value => (
          <div key={value} className="multisearch-value">
            <span className="text">{value}</span>
            <Icon
              className="remove"
              onClick={this.handleRemoveSearchValue.bind(this, value)}
            />
          </div>
        ))}
        {searchValues.length > 2 &&
          (showAll ? (
            map(searchValues.slice(2), value => (
              <div key={value} className="multisearch-value">
                <span className="text">{value}</span>
                <Icon
                  className="remove"
                  onClick={this.handleRemoveSearchValue.bind(this, value)}
                />
              </div>
            ))
          ) : (
            <div className="all" onClick={this.handleShowAllTags}>
              {this.props.translate('search.all')} ({searchValues.length})
            </div>
          ))}
      </div>
    );
  };

  renderSuggestions = suggestion => {
    // if (suggestion.type === 'term') {
    //   return this.renderDefaultSuggestion(suggestion);
    // }
    // if (suggestion.type === 'category') {
    //   return this.renderCategorySuggestion(suggestion);
    // }
    // if (suggestion.type === 'product') {
    //   return this.renderDefaultSuggestion(suggestion);
    // }
    // if (suggestion.type === 'product_attribute') {
    //   return this.renderBrandSuggestion(suggestion);
    // }
    if (get(first(suggestion), 'type') === 'term') {
      return map(suggestion, s => {
        return this.renderDefaultSuggestion(s);
      });
    }
    if (get(first(suggestion), 'type') === 'category') {
      return map(slice(suggestion, 0, 3), s => {
        return this.renderCategorySuggestion(s);
      });
    }
    if (get(first(suggestion), 'type') === 'product') {
      return map(slice(suggestion, 0, 7), s => {
        return this.renderDefaultSuggestion(s);
      });
    }
    if (get(first(suggestion), 'type') === 'brand_name') {
      return map(suggestion, s => {
        return this.renderBrandSuggestion(s);
      });
    }
  };

  handleKeyDown = event => {
    const { keyCode } = event;
    const { searchValues, inputValue } = this.state;

    if (keyCode === BACKSPACE_KEY) {
      if (!inputValue && !isEmpty(searchValues)) {
        this.handleRemoveSearchValue(last(searchValues));
      }
    }
    if (keyCode === ENTER) {
      this.handleClickSubmit();
    }
  };

  renderSuggestionKey = () => {
    const { translate } = this.props;

    if (
      !isEmpty(this.state.searchKeySuggestion) &&
      this.state.searchKeySuggestion.length > 0
    ) {
      return (
        <div className="search-key-suggestion-container">
          <span className="search-key-suggestion-title">
            {translate('search_suggestion.recent_search')}
          </span>
          <div className="search-key-suggestion-wrapper">
            {map(this.state.searchKeySuggestion, searchKey => {
              return (
                <NavLink
                  to={`/search/${searchKey}`}
                  className="search-key-suggestion-item"
                >
                  {searchKey}
                </NavLink>
              );
            })}
          </div>
        </div>
      );
    }
  };

  render() {
    const { showSuggestions } = this.state;
    const { translate, suggestions } = this.props;
    const mapSuggestions = [
      get(suggestions, 'categories', []),
      // get(suggestions, 'product_attributes', []),
      get(suggestions, 'products', []),
      // get(suggestions, 'terms', []),
    ];
    return (
      <div className="mobile-search-bar">
        <div className="mobile-search-modal">
          <div className="input-panel">
            <img
              className="back-btn"
              src="/assets/icons/baseline-keyboard-backspace.svg"
              onClick={this.props.closeSearchSuggestion}
            />
            <div className="input-value">
              {this.renderSearchValues()}
              <input
                type={'search'}
                className="input"
                ref={input => (input ? (this.searchInput = input) : null)}
                placeholder={translate('search.placeholder')}
                value={this.state.inputValue}
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
                onKeyDown={this.handleKeyDown}
              />
              <button
                className={`mobile-search-btn ${
                  this.state.inputValue ? 'icon-red' : 'icon-gray'
                }`}
                onClick={this.handleClickSubmit}
                disabled={!this.state.inputValue ? 'disabled' : ''}
              >
                <span className={this.state.inputValue ? 'red' : 'gray'}>
                  {translate('search_suggestion.search_btn')}
                </span>
              </button>
            </div>
          </div>
          {showSuggestions && (
            <div className="suggestions">
              {map(mapSuggestions, this.renderSuggestions)}
            </div>
          )}
          {this.state.showSearchKeySuggestion && this.renderSuggestionKey()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: state.customer.items,
  translate: getTranslate(state.locale),
  categories: state.category.items,
  suggestions: state.search.suggestions,
  brandSuggestions: getBrandSuggestions(state),
  defaultSuggestions: getDefaultSuggestions(state),
  categorySuggestions: getCategorySuggestions(state),
  storeConfig: state.storeConfig.current,
});

const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSuggestions(query)),
  removeSuggestions: () => dispatch(removeSuggestions()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MobileSearchBar),
);
