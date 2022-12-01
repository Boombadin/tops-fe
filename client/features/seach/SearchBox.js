import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import { localize, getTranslate } from 'react-localize-redux';
import {
  map,
  isEmpty,
  filter,
  find,
  last,
  uniq,
  get,
  reverse,
  first,
  slice,
  size,
} from 'lodash';
import onClickOutside from 'react-onclickoutside';
import queryString from 'query-string';
import { withRouter, NavLink } from 'react-router-dom';
import { fetchSuggestions, removeSuggestions } from '../../reducers/search';
// import { Input, Button, Image, Icon } from '../../magenta-ui';
import { Icon, Button, Image, Text } from '@central-tech/core-ui';
import {
  gtmSearchSuggestionLabel,
  gtmSearchSuggestionAttr,
} from '../../utils/gtmSearchTracking';
import { getCookie } from '../../utils/cookie';
import withCategories from '../../hoc/withCategories';

const DEFAULT_SORT = 'relevance,desc';
const ENTER_KEY = 13;
const BACKSPACE_KEY = 8;
class SearchBox extends PureComponent {
  state = {
    inputValue: '',
    showSuggestions: false,
    searchValues: [],
    inputActive: false,
    searchKeySuggestion: [],
    showSearchKeySuggestion: false,
  };
  componentDidMount() {
    const { customer } = this.props;
    const customerId = get(customer, 'id', '').toString();
    const keySearch = `search_${customerId}`;

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
    if (!this.props.location.pathname.includes('/search')) {
      return;
    }

    if (
      prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.location.search !== this.props.location.search
    ) {
      const pathnameArray = this.props.location.pathname.split('/');
      const multiSearch = pathnameArray[2];
      const searchValues = multiSearch
        .split(',')
        .filter(q => !!q)
        .map(decodeURIComponent);

      const searchParams = queryString.parse(
        this.props.history.location.search,
      );
      const { category_id: categoryId } = searchParams;
      const sort = searchParams.sort || DEFAULT_SORT;

      this.setState({ searchValues, sort, categoryId });
    }
  }

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
    const { inputValue, searchValues, searchKeySuggestion } = this.state;

    if (
      searchKeySuggestion.length > 0 &&
      isEmpty(inputValue) &&
      isEmpty(searchValues)
    ) {
      this.setState({ showSearchKeySuggestion: true });
    } else {
      this.setState({ showSearchKeySuggestion: false });
    }

    if (isEmpty(inputValue) && isEmpty(searchValues)) {
      this.props.removeSuggestions();
      this.setState({ showSuggestions: false });
    } else {
      this.setState({ showSuggestions: true });
    }
  };

  handleClickOutside = event => {
    this.setState({ showSuggestions: false, showSearchKeySuggestion: false });
  };

  handleClickTermSuggestion = suggestion => {
    const searchValues = [...this.state.searchValues];

    if (!searchValues.includes(suggestion.title)) {
      searchValues.push(suggestion.title);
    }

    this.setState({
      inputValue: '',
      searchValues,
      categoryId: null,
    });

    this.props.removeSuggestions();

    this.props.history.push(`/search/${searchValues}`);
  };

  handleClickProductSuggestion = suggestion => {
    const { suggestions } = this.props;
    const sizeProdSuggest = size(get(suggestions, 'product'));
    dataLayer.push({
      event: 'suggest-product',
      SearchResultCount: sizeProdSuggest,
    });

    if (!isEmpty(suggestion)) {
      this.setSuggestSearchKeyValue(get(suggestion, 'title', ''));
    }
    this.props.removeSuggestions();
  };

  setSuggestSearchKeyValue = inputValue => {
    const { customer } = this.props;
    if (!isEmpty(customer)) {
      let searchKey = [];

      if (isEmpty(getCookie(`search_${get(customer, 'id', {})}`))) {
        searchKey.push(inputValue);
        Cookie.set(`search_${get(customer, 'id')}`, JSON.stringify(searchKey));
        // localStorage.setItem(`search_${get(customer, 'id')}`, JSON.stringify(searchKey))
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
          // localStorage.setItem(`search_${get(customer, 'id')}`, JSON.stringify(searchKey))
        }
      }
    }
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

    this.props.history.push(`/search/${queries}`);
  };

  handleRemoveSearchValue = value => {
    const searchValues = filter(this.state.searchValues, v => v !== value);

    this.setState({ searchValues });

    this.props.removeSuggestions();

    if (isEmpty(searchValues)) {
      this.props.history.push('/');
    } else {
      this.props.history.push(`/search/${searchValues}`);
    }
  };

  handleCategorySuggestionClick = suggestion => {
    const { history } = this.props;
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
      return get(el, 'id') === get(category, 'id');
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

    this.props.removeSuggestions();

    history.push(href);
    this.setState({ inputValue: '' });
  };

  handleKeyDown = event => {
    const { keyCode } = event;
    const { searchValues, inputValue } = this.state;

    if (keyCode === ENTER_KEY) {
      this.handleClickSubmit();
    } else if (keyCode === BACKSPACE_KEY) {
      if (!inputValue && !isEmpty(searchValues)) {
        this.handleRemoveSearchValue(last(searchValues));
      }
    }
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
        <SearchSuggestionItemName>
          <span {...searchSuggestionLabel}>
            {suggestionTitle.slice(0, index)}
          </span>
          <SearchSuggestionItemNameBold>
            <span {...searchSuggestionLabel}>
              {suggestionTitle.slice(index, index + inputValue.length)}
            </span>
          </SearchSuggestionItemNameBold>
          <span {...searchSuggestionLabel}>
            {suggestionTitle.slice(index + inputValue.length)}
          </span>
        </SearchSuggestionItemName>
      );
    }

    return (
      <SearchSuggestionItemName {...searchSuggestionLabel}>
        {suggestionTitle}
      </SearchSuggestionItemName>
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
    if (get(suggestion, 'type') === 'term') {
      return (
        <div
          key={`term-${get(suggestion, 'sku')}`}
          className="term-suggestion"
          // onClick={this.handleClickTermSuggestion.bind(this, suggestion)}
          onClick={() => this.handleClickTermSuggestion(suggestion)}
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
        {...gtmSearchSuggestionAttr(inputValue, suggestion)}
      >
        <SearchSuggestionItem>
          <Image
            width={32}
            height={25}
            style={{ marginRight: 10 }}
            src={`${this.props.storeConfig.base_media_url}catalog/product/${get(
              suggestion,
              'image',
              '',
            )}`}
          />
          {this.renderSuggestionName(suggestion)}
          <RotateIcon src="/assets/icons/arrow-round-back.svg" />
        </SearchSuggestionItem>
      </NavLink>
    );
  };

  renderCategorySuggestion = suggestion => {
    const { inputValue } = this.state;
    return (
      <SearchSuggestionItem
        id={`product-${get(suggestion, 'url')}`}
        onClick={() => this.handleCategorySuggestionClick(suggestion)}
      >
        {this.renderSuggestionName(suggestion)}
        <CategorySuggestion>
          <span {...gtmSearchSuggestionLabel(inputValue, suggestion)}>
            {this.props.translate('search.category')}
          </span>
        </CategorySuggestion>
      </SearchSuggestionItem>
    );
  };

  renderSearchValues = () => {
    const { searchValues } = this.state;

    if (isEmpty(searchValues)) {
      return null;
    }

    return (
      <React.Fragment>
        {map(searchValues, value => (
          <MultisearchValue key={value}>
            <MultisearchValueText>{value}</MultisearchValueText>
            <MultisearchValueRemove
              width={14}
              src="/assets/icons/close.svg"
              onClick={this.handleRemoveSearchValue.bind(this, value)}
            />
          </MultisearchValue>
        ))}
      </React.Fragment>
    );
  };

  renderSuggestions = suggestion => {
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

  renderSuggestionKey = () => {
    const { translate } = this.props;
    if (
      !isEmpty(this.state.searchKeySuggestion) &&
      this.state.searchKeySuggestion.length > 0
    ) {
      return (
        <SearchKeySuggestionContainer>
          <SearchKeyTitle>
            {translate('search_suggestion.recent_search')}
          </SearchKeyTitle>
          <SearchKeySuggestionWrapper>
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
          </SearchKeySuggestionWrapper>
        </SearchKeySuggestionContainer>
      );
    }
  };

  focusSearchBox = () => {
    if (this.searchBox) {
      this.searchBox.focus();
      this.setState({
        inputActive: true,
      });
    }
  };

  handleBlur = () => {
    this.setState({
      inputActive: false,
    });
  };
  render() {
    const { translate, suggestions } = this.props;
    const mapSuggestions = [
      get(suggestions, 'categories', []),
      get(suggestions, 'products', []),
    ];

    return (
      <SearchBoxWrap
        onClick={this.focusSearchBox}
        active={`${this.state.inputActive ? 'active' : 'deactive'}`}
      >
        {this.renderSearchValues()}
        <SearchBar
          id="search-input"
          ref={node => (this.searchBox = node)}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus}
          onKeyDown={this.handleKeyDown}
          placeholder={translate('search.placeholder')}
          onBlur={this.handleBlur}
          autoComplete="off"
        />
        <SearchSuggestionContainer>
          {this.state.showSuggestions &&
            // map(brandSuggestions, this.renderBrandSuggestion),
            // inputSuggestion && this.renderDefaultSuggestion(inputSuggestion),
            // map(suggestions, suggestion => {
            //   return map(suggestion, s => {
            //     if (s.type === 'product') {
            //       return this.renderDefaultSuggestion(s);
            //     }
            //     if (s.type === 'category') {
            //       return this.renderCategorySuggestion(s);
            //     }
            //   });
            // }),
            map(mapSuggestions, this.renderSuggestions)}
        </SearchSuggestionContainer>
        {this.state.showSearchKeySuggestion && this.renderSuggestionKey()}
        <SearchButton
          radius="0 4px 4px 0"
          color="danger"
          width={49}
          height={28}
          onClick={this.handleClickSubmit}
        >
          <Image
            style={{ paddingTop: 5 }}
            src="/assets/icons/search-icon.svg"
            width={17}
          />
        </SearchButton>
      </SearchBoxWrap>
    );
  }
}
const SearchBoxWrap = styled.div`
  display: flex;
  align-items: center;
  line-height: normal;
  border-radius: 4px;
  width: 100%;
  height: 30px;
  border: solid 2px #ec1d24;
  background-color: #ffffff;
  position: relative;
  &.deactive {
    max-height: 40px;
    overflow: hidden;
  }
`;

const SearchBar = styled.input`
  /* padding: 0 10px; */
  margin: 2px 5px;
  border: none;
  height: 25px;
  width: 100%;
  line-height: 1.64;
  font-size: 14px;
  font-family: Thonburi, sans-serif !important;
  ::placeholder {
    color: #999999;
  }
`;

const SearchButton = styled(Button)`
  border: none;
`;
const MultisearchValue = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 22px;
  border-radius: 6px;
  background-color: #e2e2e2;
  margin: 4px 0;
  margin-right: 10px;
  padding-left: 13px;
  padding-right: 10px;
  /* width: 100%; */
  white-space: nowrap;
  /* overflow: hidden; */
  &:first-child {
    margin-left: 10px !important;
  }
  &:last-child {
    margin-right: 0 !important;
  }
`;
const MultisearchValueText = styled(Text)`
  font-size: 13px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const MultisearchValueRemove = styled(Icon)`
  margin-right: 0 !important;
  margin-bottom: 2.2px;
  cursor: pointer;
  color: #808080;
`;

const SearchSuggestionContainer = styled.div`
  width: calc(100% - 49px);
  position: absolute;
  z-index: 2;
  top: 30px;
  background: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  /* max-height: 400px;
  overflow: auto; */
`;

const SearchSuggestionItem = styled.div`
  width: 100%;
  min-height: 40px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #cfcfcf;
  padding: 0 18px;
  cursor: pointer;
  color: #808080;
  word-break: break-all;
`;
const SearchSuggestionItemName = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #808080;
`;
const SearchSuggestionItemNameBold = styled(Text)`
  color: #333333 !important;
  font-weight: 700;
  font-size: 14px;
`;
const CategorySuggestion = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  width: 80px;
  height: 20px;
  background-color: #e2e2e2;
  color: #808080;
  margin-right: -18px;
`;

const RotateIcon = styled(Icon)`
  width: 1.18em;
  height: 1em;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
`;
const SearchKeySuggestionContainer = styled.div`
  width: 100%;
  z-index: 10;
  position: relative;
  min-height: 60px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  color: #808080;
  word-break: break-all;
  border-radius: 5px;
  border: 1px solid #d8d8d8;
  position: absolute;
  top: 29px;
`;
const SearchKeyTitle = styled.div`
  font-size: 15px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.1;
  letter-spacing: normal;
  color: #231f20;
  margin: 17px 10px 5px;
`;
const SearchKeySuggestionWrapper = styled.div`
  margin-bottom: 22px;
  .search-key-suggestion-item {
    min-height: 25px;
    font-size: 14px;
    border-radius: 12.5px;
    border: 1px solid #d8d8d8;
    background-color: #f5f5f5;
    color: gray;
    padding: 0 15px;
    margin: 5px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
`;
const mapStateToProps = state => ({
  customer: state.customer.items,
  translate: getTranslate(state.locale),
  suggestions: state.search.suggestions,
  categories: state.category.items,
  // brandSuggestions: getBrandSuggestions(state),
  // defaultSuggestions: getDefaultSuggestions(state),
  // categorySuggestions: getCategorySuggestions(state),
  storeConfig: state.storeConfig.current,
});
const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSuggestions(query)),
  removeSuggestions: () => dispatch(removeSuggestions()),
});
export default withRouter(
  localize(
    withCategories(
      connect(mapStateToProps, mapDispatchToProps)(onClickOutside(SearchBox)),
    ),
    'locale',
  ),
);
