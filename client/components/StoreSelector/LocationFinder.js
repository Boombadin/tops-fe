import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, result, noop, get as prop } from 'lodash';
import { Button, Icon } from '../../magenta-ui';
import axios from 'axios';
import { getTranslate } from 'react-localize-redux';
import {
  fetchProvince,
  fetchDistrict,
  fetchSubDistrict,
  selectProvince,
  selectDistrict,
  selectSubDistrict,
  selectZipcode,
} from '../../reducers/region';
import { checkStoreConfig } from '../../reducers/storeConfig';

import './LocationFinder.scss';

class LocationFinder extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    onLocationActive: PropTypes.func,
    onFoundLocation: PropTypes.func,
    className: PropTypes.string,
    labelPosition: PropTypes.string,
  };

  static defaultProps = {
    onLocationActive: noop,
    className: '',
    labelPosition: '',
    onFoundLocation: () => null,
  };

  state = {
    locationLoading: false,
    locationNotSupport: false,
    geolocationActive: false,
  };

  onLocationActive = status => this.props.onLocationActive(status);

  handleFindLocation = async event => {
    event.preventDefault();
    event.stopPropagation();

    if (navigator.geolocation) {
      this.setState({ locationLoading: true });

      navigator.geolocation.getCurrentPosition(
        async position => {
          const googleApi = 'https://maps.googleapis.com/maps/api/geocode/json';
          const apiKey = 'AIzaSyB7bvtJs3RMFEAx8L-bG77EFQGzOD1OZ_s';
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          fetch(`${googleApi}?latlng=${pos.lat},${pos.lng}&key=${apiKey}&language=en`)
            .then(res => {
              return res.json();
            })
            .then(data => {
              this.setState({ locationLoading: false });
              this.locationMapping(data.results);
            })
            .catch(err => {
              this.setState({ locationLoading: false });
              this.onLocationActive(false);
            });
        },
        err => {
          this.setState({ locationLoading: false, locationNotSupport: true });
          this.onLocationActive(false);
        },
      );
    } else {
      this.setState({ locationLoading: false, locationNotSupport: true });
      this.onLocationActive(false);
    }
  };

  async locationMapping(location) {
    if (!location || location.length <= 0) {
      this.onLocationActive(false);
      return false;
    }

    const currentLocation = location[0];

    let provinceName = result(
      find(currentLocation.address_components, addressObj => {
        return (
          addressObj.types.includes('administrative_area_level_1') ||
          addressObj.long_name.includes('Chang Wat') ||
          addressObj.long_name === 'Bangkok'
        );
      }),
      'long_name',
    );
    // Fix Bangkok
    provinceName = provinceName === 'Krung Thep Maha Nakhon' ? 'Bangkok' : provinceName;

    const districtName = result(
      find(currentLocation.address_components, addressObj => {
        return (
          addressObj.long_name.includes('Amphoe') || addressObj.long_name.includes('Khet')
        );
      }),
      'long_name',
    );

    const subdistrictName = result(
      find(currentLocation.address_components, addressObj => {
        return (
          addressObj.long_name.includes('Tambon') || addressObj.long_name.includes('Khwaeng')
        );
      }),
      'long_name',
    );

    const provinceFormat = this.regionReplacer(provinceName);
    const districtFormat = this.regionReplacer(districtName);
    const subdistrictFormat = this.regionReplacer(subdistrictName);

    const foundProvince = find(
      this.props.provinces,
      prov => this.regionReplacer(prov.default_name) === provinceFormat,
    );

    if (!foundProvince) {
      this.props.onFoundLocation({});
      this.onLocationActive(false);
      return null;
    }

    const regionId = foundProvince.region_id;
    const province = await this.props.selectProvince(regionId);
    const districts = await this.props.fetchDistrict(regionId);

    // find and select district
    const foundDistrict = find(
      this.props.districts,
      dist => this.regionReplacer(dist.default_name) === districtFormat,
    );

    if (!foundDistrict) {
      this.props.onFoundLocation({ regionId });
      this.onLocationActive(false);
      return null;
    }

    const districtId = foundDistrict.district_id;
    const district = await this.props.selectDistrict(districtId);
    const subdistricts = await this.props.fetchSubDistrict(regionId, districtId);

    // find and select subdistrict
    const foundSubDistrict = find(
      this.props.subdistricts,
      dist => this.regionReplacer(dist.default_name) === subdistrictFormat,
    );

    if (!foundSubDistrict) {
      this.props.onFoundLocation({ regionId, districtId });
      this.onLocationActive(false);
      return null;
    }
    this.onLocationActive(true);

    const subdistrictId = foundSubDistrict.subdistrict_id;
    const zipcode = foundSubDistrict.zip_code;

    this.props.selectSubDistrict(subdistrictId);
    this.props.selectZipcode(zipcode);
    this.props.checkStoreConfig(subdistrictId);

    this.props.onFoundLocation({ regionId, districtId, subdistrictId });
  }

  regionReplacer(text) {
    if (!text) {
      return;
    }

    return text
      .replace(
        /\s|Khet |Amphoe |Tambon |Khwaeng |Chang Wat |แขวง |เขต |อำเภอ |ตำบล |จังหวัด | District|\s/g,
        '',
      )
      .toLowerCase();
  }

  render() {
    const { translate, className, labelPosition, noPadding, isOverflow } = this.props;
    const { locationNotSupport, geolocationActive } = this.state;
    return (
      <div id="location-finder">
        {this.state.locationLoading ? (
          <Button
            type="button"
            className={`location-finder-submit ${className}`}
            size="large"
            icon
            loading={this.state.locationLoading}
            disabled={locationNotSupport}
          >
            <span style={{ height: 40, display: 'block' }} />
          </Button>
        ) : (
          <div
            className={`location-finder-submit button ${className}`}
            onClick={this.handleFindLocation}
          >
            <div
              className={`icon-marker ${noPadding ? 'no-padding' : ''} ${
                isOverflow ? 'overflow' : ''
              }`}
            >
              <Icon className="icon-location-finder" name="point" />
              <span className="location-finder-support">
                {!locationNotSupport
                  ? translate('location_finder.finder_button')
                  : translate('location_finder.location_not_support')}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  provinces: state.region.provinces,
  provincesLoading: state.region.provincesLoading,
  provinceSelected: state.region.provinceSelected,
  districts: state.region.districts,
  districtsLoading: state.region.districtsLoading,
  districtSelected: state.region.districtSelected,
  subdistricts: state.region.subdistricts,
  subdistrictsLoading: state.region.subdistrictsLoading,
  subdistrictSelected: state.region.subdistrictSelected,
});

const mapDispatchToProps = dispatch => ({
  fetchProvince: () => dispatch(fetchProvince()),
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId)),
  fetchSubDistrict: (regionId, districtId) => dispatch(fetchSubDistrict(regionId, districtId)),
  selectProvince: regionId => dispatch(selectProvince(regionId)),
  selectDistrict: districtId => dispatch(selectDistrict(districtId)),
  selectSubDistrict: subDistrictId => dispatch(selectSubDistrict(subDistrictId)),
  selectZipcode: zipcode => dispatch(selectZipcode(zipcode)),
  checkStoreConfig: subDistrictId => dispatch(checkStoreConfig(subDistrictId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationFinder);
