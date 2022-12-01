import React from 'react';
import { bool, string, func } from 'prop-types';
import RegionApi from '../../apis/region';
import withStoreConfig from '../../hoc/withStoreConfig';

class SubDistricts extends React.Component {
  state = {
    subDistricts: [],
    loading: false,
    error: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.regionId !== this.props.regionId) {
      return true;
    }

    if (nextProps.districtId !== this.props.districtId) {
      return true;
    }

    if (nextProps.subDistrictId !== this.props.subDistrictId) {
      return true;
    }

    if (nextState.subDistricts !== this.state.subDistricts) {
      return true;
    }

    if (nextState.loading !== this.state.loading) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (!this.state.loading && this.props.regionId && this.props.districtId) {
      this.fetchSubDistrict();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.regionId !== this.props.regionId ||
      prevProps.districtId !== this.props.districtId
    ) {
      if (this.props.regionId && this.props.districtId) {
        this.fetchSubDistrict();
      } else {
        this.setState({
          loading: false,
          subDistricts: [],
          error: null,
        });
      }
    }
  }

  fetchSubDistrict = async () => {
    const { storeConfig, onlyDeliveryAvailiable, regionId, districtId } = this.props;
    const { loading } = this.state;
    if (!loading && regionId) {
      try {
        this.setState({
          loading: true,
          subDistricts: this.state.subDistricts,
          error: null,
        });
        const { subdistricts } = await RegionApi.getSubDistrict(
          storeConfig.code,
          regionId,
          districtId,
          onlyDeliveryAvailiable,
        );
        this.setState({
          loading: false,
          subDistricts: subdistricts,
        });
      } catch (error) {
        this.setState({
          loading: false,
          subDistricts: [],
          error: error,
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    return children({
      data: {
        subDistricts: this.state.subDistricts,
      },
      loading: this.state.loading,
      error: this.state.error,
    });
  }
}

SubDistricts.propTypes = {
  onlyDeliveryAvailiable: bool,
  regionId: string,
  districtId: string,
  children: func,
};

SubDistricts.defaultProps = {
  onlyDeliveryAvailiable: false,
  regionId: '',
  districtId: '',
  children: () => null,
};

export default withStoreConfig(SubDistricts);
