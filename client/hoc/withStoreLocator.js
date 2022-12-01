import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchStoreLocator,
  searchStoreLocator,
  resetSearchStore,
} from '../reducers/storeLocator';

const withStoreLocator = WrappedComponent => {
  class HoC extends React.PureComponent {
    componentDidMount() {
      if (!this.props.storeLocator.loaded && !this.props.storeLocator.loading) {
        this.props.fetchStoreLocator();
      }
    }

    render() {
      const { storeLocator, ...props } = this.props;

      return <WrappedComponent {...props} storeLocator={storeLocator} />;
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(HoC);
};

const mapStateToProps = state => ({
  storeLocator: state.storeLocator,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchStoreLocator: fetchStoreLocator,
      searchStoreLocator,
      resetSearchStore,
    },
    dispatch,
  );
};

export default withStoreLocator;
