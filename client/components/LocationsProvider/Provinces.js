import React from 'react';
import { bool, func } from 'prop-types';
import RegionApi from '../../apis/region';
import withStoreConfig from '../../hoc/withStoreConfig';

class Provinces extends React.Component {
  state = {
    provinces: [],
    loading: false,
    error: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.provinces !== this.state.provinces) {
      return true;
    }

    if (nextState.loading !== this.state.loading) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (!this.state.loading) {
      this.fetchProvince();
    }
  }

  fetchProvince = async () => {
    const { storeConfig, onlyDeliveryAvailiable } = this.props;
    const { loading } = this.state;
    if (!loading) {
      try {
        this.setState({
          loading: true,
          provinces: this.state.provinces,
          error: null,
        });
        const { provinces } = await RegionApi.getProvince(
          storeConfig.code,
          onlyDeliveryAvailiable,
        );
        this.setState({
          loading: false,
          provinces: provinces,
        });
      } catch (error) {
        this.setState({
          loading: false,
          provinces: [],
          error: error,
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    return children({
      data: {
        provinces: this.state.provinces,
      },
      loading: this.state.loading,
      error: this.state.error,
    });
  }
}

Provinces.propTypes = {
  onlyDeliveryAvailiable: bool,
  children: func,
};

Provinces.defaultProps = {
  onlyDeliveryAvailiable: false,
  children: () => null,
};

export default withStoreConfig(Provinces);
