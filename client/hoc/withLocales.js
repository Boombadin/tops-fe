import React from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { find } from 'lodash';

const wrapComponent = (WrappedComponent, componentTranslation = {}) => {
  class LocalizedComponent extends React.PureComponent {
    render() {
      const { children, ...props } = this.props;

      return (
        <WrappedComponent {...props} translate={this.props.translate}>
          {children}
        </WrappedComponent>
      );
    }
  }

  return connect(mapStateToProps)(LocalizedComponent);
};

// you can wrap in 2 ways: withLocales(Component) or withLocales(componentTranslation)(Component)
const withLocales = arg => {
  if (typeof arg === 'function') {
    // if argument is the wrapped component
    return wrapComponent(arg);
  }

  // else if argument is the component translation
  return wrappedComponent => wrapComponent(wrappedComponent, arg);
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  lang: find(state.locale.languages, lang => lang.active === true),
  langCode: find(state.locale.languages, lang => lang.active === true).code
});

export default withLocales;