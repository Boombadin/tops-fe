import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Cookie from 'js-cookie'
import { localize, getTranslate } from 'react-localize-redux'
import { map, isEmpty, filter, find, last, uniq, get as prop, reverse } from 'lodash'
import onClickOutside from 'react-onclickoutside'
import queryString from 'query-string'
import { withRouter, NavLink } from 'react-router-dom'
import { fetchSuggestions, removeSuggestions } from '../../reducers/search'
import { Input, Button, Image, Icon } from '../../magenta-ui'
import './PcSearch.scss'
import { getBrandSuggestions, getDefaultSuggestions, getCategorySuggestions } from '../../selectors'

const DEFAULT_SORT = 'relevance,desc'

const ENTER_KEY = 13
const BACKSPACE_KEY = 8

class PcSearch extends PureComponent {
  state = {
    inputValue: '',
    showSuggestions: false,
    searchValues: [],
    inputActive: false,
    searchKeySuggestion: [],
    showSearchKeySuggestion: false
  }

  componentDidMount() {
    const { customer } = this.props
    
    if (!isEmpty(Cookie(`search_${prop(customer, 'id', {})}`))) {
      this.setState({
        searchKeySuggestion: reverse(JSON.parse(Cookie(`search_${prop(customer, 'id', {})}`)))
      })
    }

    if (!this.props.location.pathname.includes('/search')) {
      return
    }
    const pathnameArray = this.props.location.pathname.split('/')
    const multiSearch = pathnameArray[2]
    const singleSearch = pathnameArray[3]
    const searchValues = multiSearch
      .split(',')
      .filter(q => !!q)
      .map(decodeURIComponent)

    // const searchValues = window.location.pathname.slice(8).split(',').filter(q => !!q).map(decodeURIComponent);
    const searchParams = queryString.parse(window.location.search)
    const { category_id: categoryId } = searchParams
    const sort = searchParams.sort || DEFAULT_SORT

    this.setState({ searchValues, sort, categoryId })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.location.pathname.includes('/search')) {
      return
    }

    if (
      prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.location.search !== this.props.location.search
    ) {
      const pathnameArray = this.props.location.pathname.split('/')
      const multiSearch = pathnameArray[2]
      const singleSearch = pathnameArray[3]
      const searchValues = multiSearch
        .split(',')
        .filter(q => !!q)
        .map(decodeURIComponent)

      // const searchValues = this.props.history.location.pathname.slice(8).split(',').filter(q => !!q).map(decodeURIComponent);
      const searchParams = queryString.parse(this.props.history.location.search)
      const { category_id: categoryId } = searchParams
      const sort = searchParams.sort || DEFAULT_SORT

      this.setState({ searchValues, sort, categoryId })
    }
  }

  handleInputChange = event => {
    const { value } = event.target

    if (!value) {
      this.props.removeSuggestions()

      return this.setState({ showSearchKeySuggestion: true, showSuggestions: false, inputValue: '' })
    }

    if (this.suggestionTimeoutId) {
      clearTimeout(this.suggestionTimeoutId)
    }

    this.suggestionTimeoutId = setTimeout(() => {
      this.props.fetchSuggestions(value)
      this.suggestionTimeoutId = null
    }, 500)

    this.setState({ showSearchKeySuggestion: false, showSuggestions: true, inputValue: value.trimLeft() })
  }

  handleInputFocus = () => {
    const { inputValue, searchValues, searchKeySuggestion } = this.state

    if (searchKeySuggestion.length > 0 && isEmpty(inputValue) && isEmpty(searchValues)) {
      this.setState({ showSearchKeySuggestion: true })
    } else {
      this.setState({ showSearchKeySuggestion: false })
    }

    if (isEmpty(inputValue) && isEmpty(searchValues)) {
      this.props.removeSuggestions()
      this.setState({ showSuggestions: false })
    } else {
      this.setState({ showSuggestions: true })
    }
  }

  handleClickOutside = event => {
    this.setState({ showSuggestions: false, showSearchKeySuggestion: false })
  }

  handleClickTermSuggestion = suggestion => {
    const searchValues = [...this.state.searchValues]

    if (!searchValues.includes(suggestion.title)) {
      searchValues.push(suggestion.title)
    }

    this.setState({
      inputValue: '',
      searchValues,
      categoryId: null
    })

    this.props.removeSuggestions()

    this.props.history.push(`/search/${searchValues}`)
  }

  handleClickProductSuggestion = suggestion => {
    const { suggestions } = this.props;
    const sizeProdSuggest = _.size(suggestions.filter(s => s.type === 'product'));
    dataLayer.push({ event: 'suggest-product', SearchResultCount: sizeProdSuggest})
    // const searchValues = [...this.state.searchValues]

    // if (!searchValues.includes(suggestion.title)) {
    //   searchValues.push(suggestion.title)
    // }
    
    if (!isEmpty(suggestion)) {
      // this.setSuggestSearchKeyValue(prop(suggestion, 'title', ''))
      this.setSuggestSearchKeyValue(this.state.inputValue)
    }

    // this.setState({
    //   inputValue: '',
    //   searchValues,
    //   categoryId: null
    // })

    this.props.removeSuggestions()

    // this.props.history.push(`/search/${searchValues}`)
  }

  setSuggestSearchKeyValue = inputValue => {
    const { customer } = this.props;

    if (!isEmpty(customer)) {
      let searchKey = []
      
      if (isEmpty(Cookie(`search_${prop(customer, 'id', {})}`))) {
        searchKey.push(inputValue)
        Cookie.set(`search_${prop(customer, 'id')}`, JSON.stringify(searchKey))
        // localStorage.setItem(`search_${prop(customer, 'id')}`, JSON.stringify(searchKey))
      } else {
        searchKey = JSON.parse(Cookie(`search_${prop(customer, 'id', {})}`));
        const checkSearchKeyDuplicate = filter(searchKey, key => {
          return key === inputValue
        })
        
        if (checkSearchKeyDuplicate.length <= 0) {
          searchKey.push(inputValue)

          if (searchKey.length > 4) {
            searchKey.shift()
          }

          Cookie.set(`search_${prop(customer, 'id')}`, JSON.stringify(searchKey))
          // localStorage.setItem(`search_${prop(customer, 'id')}`, JSON.stringify(searchKey))
        }
      }
    }
  }

  handleClickSubmit = () => {
    const queries = [...this.state.searchValues]
    const { searchValues, inputValue } = this.state

    if (inputValue) {
      this.setState({
        searchValues: uniq([...searchValues, inputValue]),
        inputValue: ''
      })
      
      this.setSuggestSearchKeyValue(inputValue)
    }

    if (inputValue && !queries.includes(inputValue)) {
      queries.push(inputValue)
    }

    if (isEmpty(queries)) {
      return
    }

    this.props.removeSuggestions()

    this.props.history.push(`/search/${queries}`)
  }

  handleRemoveSearchValue = value => {
    const searchValues = filter(this.state.searchValues, v => v !== value)

    this.setState({ searchValues })

    this.props.removeSuggestions()

    if (isEmpty(searchValues)) {
      this.props.history.push('/')
    } else {
      this.props.history.push(`/search/${searchValues}`)
    }
  }

  handleCategorySuggestionClick = suggestion => {
    const { history } = this.props

    if (!this.state.inputValue) {
      return
    }

    const category = find(this.props.categories, c => c.url_path === suggestion.url)
    this.setSuggestSearchKeyValue(prop(category, 'name', ''))

    let href = `/search/${this.state.inputValue}?category_id=${prop(category, 'id', '')}`

    const categorySuggest = this.props.categories.find((el) => { return prop(el, 'id') === prop(category, 'id') });
    dataLayer.push({ event: 'suggest-cat', SearchResultCount: prop(categorySuggest, 'extension_attributes.product_count')})

    if (this.state.sort && this.state.sort !== DEFAULT_SORT) {
      href += `&sort=${this.state.sort}`
    }

    this.props.removeSuggestions()

    history.push(href)
    this.setState({ inputValue: '' })
  }

  handleKeyDown = event => {
    const { keyCode } = event
    const { searchValues, inputValue } = this.state

    if (keyCode === ENTER_KEY) {
      this.handleClickSubmit()
    } else if (keyCode === BACKSPACE_KEY) {
      if (!inputValue && !isEmpty(searchValues)) {
        this.handleRemoveSearchValue(last(searchValues))
      }
    }
  }

  renderSuggestionName = suggestion => {
    const { inputValue } = this.state

    const index = suggestion.title.toLowerCase().indexOf(inputValue.toLowerCase().trim())

    if (inputValue && index !== -1) {
      return (
        <span className="name">
          <span>{suggestion.title.slice(0, index)}</span>
          <span className="bold-name">{suggestion.title.slice(index, index + inputValue.length)}</span>
          <span>{suggestion.title.slice(index + inputValue.length)}</span>
        </span>
      )
    }

    return <span className="name">{suggestion.title}</span>
  }

  renderBrandSuggestion = suggestion => {
    return (
      <NavLink key={`brand-${suggestion.url}`} to={`/${suggestion.url}`} className="brand-suggestion">
        {this.renderSuggestionName(suggestion)}
        <Icon className="chevron right" />
      </NavLink>
    )
  }

  renderDefaultSuggestion = suggestion => {
    if (suggestion.type === 'term') {
      return (
        <div
          key={`term-${suggestion.url}`}
          className="term-suggestion"
          onClick={this.handleClickTermSuggestion.bind(this, suggestion)}
        >
          {this.renderSuggestionName(suggestion)}
          <Icon className="arrow left" />
        </div>
      )
    }

    return (
      <NavLink onClick={() => this.handleClickProductSuggestion(suggestion)} key={`product-${suggestion.url}`} to={`/${suggestion.url}?from=search`} className="product-suggestion">
        <img className="image" src={`${this.props.storeConfig.base_media_url}catalog/product/${suggestion.image}`} />
        {this.renderSuggestionName(suggestion)}
        <Icon className="arrow left" />
      </NavLink>
    )
  }

  renderCategorySuggestion = suggestion => {
    return (
      <div
        key={`category-${suggestion.url}`}
        className="category-suggestion"
        onClick={this.handleCategorySuggestionClick.bind(this, suggestion)}
      >
        {this.renderSuggestionName(suggestion)}
        <div className="category-column">
          <div className="rect">{this.props.translate('search.category')}</div>
        </div>
      </div>
    )
  }

  renderSearchValues = () => {
    const { searchValues } = this.state

    if (isEmpty(searchValues)) {
      return null
    }

    return (
      <React.Fragment>
        {map(searchValues, value => (
          <div key={value} className="multisearch-value">
            <span className="text">{value}</span>
            <Icon className="remove" onClick={this.handleRemoveSearchValue.bind(this, value)} />
          </div>
        ))}
      </React.Fragment>
    )
  }

  renderSuggestions = suggestion => {
    if (suggestion.type === 'term') {
      return this.renderDefaultSuggestion(suggestion)
    }
    if (suggestion.type === 'category') {
      return this.renderCategorySuggestion(suggestion)
    }
    if (suggestion.type === 'product') {
      return this.renderDefaultSuggestion(suggestion)
    }
    if (suggestion.type === 'product_attribute') {
      return this.renderBrandSuggestion(suggestion)
    }
  }

  renderSuggestionKey = () => {
    const { translate } = this.props;
    if (!isEmpty(this.state.searchKeySuggestion) && this.state.searchKeySuggestion.length > 0) {
      return (
        <div className="search-key-suggestion-container">
          <span className="search-key-suggestion-title">
            {translate('search_suggestion.recent_search')}
          </span>
          <div className="search-key-suggestion-wrapper">
            {
              map(this.state.searchKeySuggestion, searchKey => {
                return (
                  <NavLink to={`/search/${searchKey}`} className="search-key-suggestion-item">
                    {searchKey}
                  </NavLink>
                )
              })
            }
          </div>
        </div>
      )
    }
  }

  focusSearchBox = () => {
    if (this.searchBox) {
      this.searchBox.focus()
      this.setState({
        inputActive: true
      })
    }
  }

  handleBlur = () => {
    this.setState({
      inputActive: false
    })
  }

  render() {
    const { className, options, onChange, translate, suggestions, isMobile } = this.props
    const { searchValues, inputValue } = this.state

    // let brandSuggestions
    // let defaultSuggestions
    // let categorySuggestions
    // const categorySuggestionsCount = this.props.categorySuggestions.length
    // if (!isEmpty(this.props.brandSuggestions)) {
    //   brandSuggestions = this.props.brandSuggestions.slice(0, 1)
    //   defaultSuggestions = filter(this.props.defaultSuggestions, sugg => !searchValues.includes(sugg.title)).slice(0, 7)
    //   categorySuggestions = this.props.categorySuggestions.slice(0, 3)
    // } else {
    //   defaultSuggestions = filter(this.props.defaultSuggestions, sugg => !searchValues.includes(sugg.title)).slice(
    //     0,
    //     11 - categorySuggestionsCount
    //   )
    //   categorySuggestions = this.props.categorySuggestions.slice(0, 3)
    // }
    //
    // let inputSuggestion
    //
    // if (inputValue && !some(defaultSuggestions, sugg => sugg.title.toLowerCase() === inputValue.toLowerCase())) {
    //   inputSuggestion = {
    //     title: inputValue,
    //     type: 'term'
    //   }
    // }

    return (
      <div id="pc-search">
        <Input type="text">
          <div className="input-content">
            <div
              className={`search-product-bar ${this.state.inputActive ? 'active' : 'deactive'}`}
              onClick={this.focusSearchBox}
            >
              {this.renderSearchValues()}
              <input
                className="search-input"
                ref={node => (this.searchBox = node)}
                value={this.state.inputValue}
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
                onKeyDown={this.handleKeyDown}
                placeholder={translate('search.placeholder')}
                onBlur={this.handleBlur}
              />
            </div>
            <div className="search-suggestion-container">
              {this.state.showSuggestions && [
                // map(brandSuggestions, this.renderBrandSuggestion),
                // inputSuggestion && this.renderDefaultSuggestion(inputSuggestion),
                // map(defaultSuggestions, this.renderDefaultSuggestion),
                // map(categorySuggestions, this.renderCategorySuggestion)
                map(suggestions, this.renderSuggestions)
              ]}
            </div>
            {
              this.state.showSearchKeySuggestion && this.renderSuggestionKey()
            }
          </div>
          {/* <Select className="seach-select" options={options} placeholder={translate('search.placeholder_by')} /> */}
          <Button className="search-btn" type="submit" onClick={this.handleClickSubmit}>
            <Image className="search-icon" src="/assets/icons/search-icon.svg" centered />
          </Button>
        </Input>
      </div>
    )
  }
}

PcSearch.propTypes = {
  className: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired
}

PcSearch.defaultProps = {
  className: '',
  options: 'Please Select'
}

const mapStateToProps = state => ({
  customer: state.customer.items,
  translate: getTranslate(state.locale),
  suggestions: state.search.suggestions,
  categories: state.category.items,
  // brandSuggestions: getBrandSuggestions(state),
  // defaultSuggestions: getDefaultSuggestions(state),
  // categorySuggestions: getCategorySuggestions(state),
  storeConfig: state.storeConfig.current
})

const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSuggestions(query)),
  removeSuggestions: () => dispatch(removeSuggestions())
})

export default withRouter(
  localize(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(onClickOutside(PcSearch)),
    'locale'
  )
)
