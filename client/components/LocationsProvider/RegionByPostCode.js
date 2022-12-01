import React from 'react';
import { string, func } from 'prop-types';
import RegionApi from '../../apis/region';
import withStoreConfig from '../../hoc/withStoreConfig';

class RegionByPostCode extends React.Component {
  state = {
    region: {},
    loading: false,
    error: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.postcode !== this.props.postcode) {
      return true;
    }

    if (nextState.region !== this.state.region) {
      return true;
    }

    if (nextState.loading !== this.state.loading) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (!this.state.loading && this.props.postcode) {
      this.fetchRegionByPostcode();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.postcode !== this.props.postcode) {
      if (this.props.postcode) {
        this.fetchRegionByPostcode();
      } else {
        this.setState({
          loading: false,
          region: {},
          error: null,
        });
      }
    }
  }

  fetchRegionByPostcode = async () => {
    const { storeConfig, postcode, onlyDeliveryAvailiable, onCompleted } = this.props;
    const { loading } = this.state;
    if (!loading) {
      try {
        this.setState({
          loading: true,
          region: this.state.region,
          error: null,
        });
        const { region } = await RegionApi.getRegionByPostcode(
          storeConfig.code,
          postcode,
          onlyDeliveryAvailiable,
        );
        this.setState({
          loading: false,
          region: region,
        });
        onCompleted(region);
      } catch (error) {
        this.setState({
          loading: false,
          region: {},
          error: error,
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    return children({
      data: {
        region: this.state.region,
      },
      loading: this.state.loading,
      error: this.state.error,
    });
  }
}

RegionByPostCode.propTypes = {
  postcode: string,
  children: func,
  onCompleted: func,
  onlyDeliveryAvailiable: string,
};

RegionByPostCode.defaultProps = {
  postcode: '',
  children: () => null,
  onlyDeliveryAvailiable: 'false',
  onCompleted: () => null,
};

export default withStoreConfig(RegionByPostCode);
