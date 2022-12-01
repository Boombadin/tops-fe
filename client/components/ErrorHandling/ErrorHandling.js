import React, { PureComponent, Fragment } from 'react'
import { func, bool, string, node, element, oneOfType } from 'prop-types'
import ErrorComponent from './ErrorComponent'

class ErrorHandling extends PureComponent {
  static propTypes = {
    isFetching: bool.isRequired,
    error: string,
    onLoadData: func,
    renderLoading: func,
    renderError: func,
    children: oneOfType([
      node,
      element,
      func,
    ])
  }

  static defaultProps = {
    error: '',
    children: null,
    renderLoading: () => null,
    renderError: () => null,
    onLoadData: () => null,
  }

  render() {
    const { children, isFetching, error, renderLoading, renderError, onLoadData } = this.props
    return (
      <Fragment>
        { 
          error ? <ErrorComponent message={error} onReload={() => onLoadData()} /> : (
            <Fragment>
              { isFetching ? renderLoading() : children }
            </Fragment>
          ) 
        }
      </Fragment>
    )
  }
}

export default ErrorHandling
