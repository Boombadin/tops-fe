import React from 'react';
import { connect } from 'react-redux';

const withStoreConfig = WrappedComponent => {
  class HoC extends React.PureComponent {
    render() {
      const { children, storeConfig, storeConfigDefault, envConfig, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          storeConfig={storeConfig}
          storeConfigDefault={storeConfigDefault}
          envConfig={envConfig}
        >
          {children}
        </WrappedComponent>
      );
    }
  }

  return connect(mapStateToProps)(HoC);
};

const mapStateToProps = state => ({
  storeConfig: state.storeConfig.current,
  storeConfigDefault: state.storeConfig.default,
  envConfig: state.storeConfig.envConfig,
});

export default withStoreConfig;
