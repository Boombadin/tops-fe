import React from 'react';
import { bool, string, func } from 'prop-types';
import RegionApi from '../../apis/region';
import withStoreConfig from '../../hoc/withStoreConfig';

class Districts extends React.Component {
  state = {
    districts: [],
    loading: false,
    error: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.regionId !== this.props.regionId) {
      return true;
    }

    if (nextState.districts !== this.state.districts) {
      return true;
    }

    if (nextState.loading !== this.state.loading) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (!this.state.loading && this.props.regionId) {
      this.fetchDistrict();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regionId !== this.props.regionId) {
      if (this.props.regionId) {
        this.fetchDistrict();
      } else {
        this.setState({
          loading: false,
          districts: [],
          error: null,
        });
      }
    }
  }

  fetchDistrict = async () => {
    const { storeConfig, onlyDeliveryAvailiable, regionId } = this.props;
    const { loading } = this.state;
    if (!loading && regionId) {
      try {
        this.setState({
          loading: true,
          districts: this.state.districts,
          error: null,
        });
        const { districts } = await RegionApi.getDistrict(
          storeConfig.code,
          regionId,
          onlyDeliveryAvailiable,
        );
        this.setState({
          loading: false,
          districts: districts,
        });
      } catch (error) {
        this.setState({
          loading: false,
          districts: [],
          error: error,
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    return children({
      data: {
        districts: this.state.districts,
      },
      loading: this.state.loading,
      error: this.state.error,
    });
  }
}

Districts.propTypes = {
  onlyDeliveryAvailiable: bool,
  regionId: string,
  children: func,
};

Districts.defaultProps = {
  onlyDeliveryAvailiable: false,
  regionId: '',
  children: () => null,
};

export default withStoreConfig(Districts);
