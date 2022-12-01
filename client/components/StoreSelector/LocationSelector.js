import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getTranslate } from 'react-localize-redux'
import { Dropdown, Message } from '../../magenta-ui'
import { checkStoreConfig } from '../../reducers/storeConfig'
import { 
  fetchProvince, 
  fetchDistrict, 
  fetchSubDistrict, 
  selectProvince,
  selectDistrict,
  selectSubDistrict,
  selectZipcode
} from '../../reducers/region'
import './LocationSelector.scss'

class LocationSelector extends Component {
  static propTypes = {
    enable: PropTypes.bool,
    translate: PropTypes.func.isRequired,
    provinces: PropTypes.array.isRequired,
    districts: PropTypes.array,
    subdistricts: PropTypes.array,
    provincesLoading: PropTypes.bool.isRequired,
    districtsLoading: PropTypes.bool.isRequired,
    subdistrictsLoading: PropTypes.bool.isRequired,
    selectedProvince: PropTypes.string.isRequired,
    selectedDistrict: PropTypes.string.isRequired,
    selectedSubDistrict: PropTypes.string.isRequired,
    selectedZipcode: PropTypes.string.isRequired,
    selectProvince: PropTypes.func.isRequired,
    fetchDistrict: PropTypes.func.isRequired,
    selectDistrict: PropTypes.func.isRequired,
    fetchSubDistrict: PropTypes.func.isRequired,
    selectSubDistrict: PropTypes.func.isRequired,
    selectZipcode: PropTypes.func.isRequired,
    checkStoreConfig: PropTypes.func.isRequired,
  }

  static defaultProps = {
    districts: [],
    subdistricts: [],
    enable: false
  }
  
  componentDidMount() {
    this.props.fetchProvince()
  }

  renderProvince() {
    const { translate, provinces, provincesLoading, selectedProvince } = this.props
    const hasData = Boolean(provinces.length)
    
    const provinceData = provinces.map((item) => {
      return {
        text: item.name,
        value: item.region_id
      }
    })
    
    return (
      <Dropdown 
        id="province-select" 
        className="location-selector--input"
        name="selected-state"
        placeholder={translate('location_selector.province')} 
        fluid 
        selection
        search
        selectOnNavigation={false}
        loading={provincesLoading}
        disabled={!hasData}
        value={selectedProvince}
        options={provinceData}
        onChange={this.onProvinceChange}
      />
    )
  }

  onProvinceChange = (e, data) => {
    const regionId = data.value
    
    if (regionId && regionId !== '' && regionId !== this.props.selectedProvince) {
      this.props.selectProvince(regionId)
      this.props.fetchDistrict(regionId)
    }
  }

  renderDistrict() {
    const { translate, districts, districtsLoading, selectedDistrict } = this.props
    const hasData = Boolean(districts.length)
    
    const districtData = districts.map((item) => {
      return {
        text: item.name,
        value: item.district_id
      }
    })

    return (
      <Dropdown 
        id="district-select" 
        className="location-selector--input"
        name="selected-state"
        placeholder={translate('location_selector.district')} 
        fluid 
        selection
        search
        selectOnNavigation={false}
        loading={districtsLoading}
        value={selectedDistrict}
        disabled={!hasData}
        options={districtData}
        onChange={this.onDistrictChange}
      />
    )
  }

  onDistrictChange = (e, data) => {
    const districtId = data.value
    const { selectedProvince, selectedDistrict } = this.props
    
    if (districtId && districtId !== '' && districtId !== selectedDistrict) {
      this.props.selectDistrict(districtId)
      this.props.fetchSubDistrict(selectedProvince, districtId)
    }
  }

  renderSubDistrict() {
    const { translate, subdistricts, subdistrictsLoading, selectedSubDistrict, selectedZipcode } = this.props
    const hasData = Boolean(subdistricts.length)
    
    const subdistrictData = subdistricts.map((item) => {
      return {
        text: item.formatName,
        value: item.formatValue
      }
    })
    
    let subdistrictValue
    if (selectedSubDistrict && selectedZipcode) {
      subdistrictValue = `${selectedSubDistrict}-${selectedZipcode}`
    }
    
    return (
      <Dropdown 
        id="subdistrict-select" 
        className="location-selector--input"
        placeholder={translate('location_selector.sub_district')} 
        fluid 
        selection
        search
        selectOnNavigation={false}
        loading={subdistrictsLoading}
        value={subdistrictValue}
        disabled={!hasData}
        options={subdistrictData}
        onChange={this.onSubDistrictChange}
      />
    )
  }

  onSubDistrictChange = (e, data) => {
    let subDistrictId = ''
    let zipcode = ''
    
    const newValue = data.value || ''
    
    if (newValue) {
      const valueSplit = newValue.split('-');
      subDistrictId = valueSplit[0]
      zipcode = valueSplit[1]
    }
    
    this.props.selectSubDistrict(subDistrictId)
    this.props.selectZipcode(zipcode)
    this.props.checkStoreConfig(subDistrictId)
  }
  
  checkStoreError = () => {
    const { storeStatus, selectedSubDistrict, storeLoading } = this.props
    return Boolean(!storeStatus && selectedSubDistrict && !storeLoading)
  }

  render() {
    const { translate } = this.props
    
    return (
      <div id="location-selector">
        {/* {this.checkStoreError() && <Message negative>{translate('location_selector.err_msg')}</Message>} */}
        {this.renderProvince()}
        {this.renderDistrict()}
        {this.renderSubDistrict()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  provinces: state.region.provinces,
  provincesLoading: state.region.provincesLoading,
  districts: state.region.districts,
  districtsLoading: state.region.districtsLoading,
  subdistricts: state.region.subdistricts,
  subdistrictsLoading: state.region.subdistrictsLoading,
  selectedProvince: state.region.selectedProvince,
  selectedDistrict: state.region.selectedDistrict,
  selectedSubDistrict: state.region.selectedSubDistrict,
  selectedZipcode: state.region.selectedZipcode,
  storeLoading: state.storeConfig.loading,
  storeStatus: state.storeConfig.storeStatus
})

const mapDispatchToProps = dispatch => ({
  fetchProvince: () => dispatch(fetchProvince(false)),
  fetchDistrict: (regionId) => dispatch(fetchDistrict(regionId, false)),
  fetchSubDistrict: (regionId, districtId) => dispatch(fetchSubDistrict(regionId, districtId, false)),
  selectProvince: (regionId) => dispatch(selectProvince(regionId)),
  selectDistrict: (districtId) => dispatch(selectDistrict(districtId)),
  selectSubDistrict: (subDistrictId) => dispatch(selectSubDistrict(subDistrictId)),
  selectZipcode: (zipcode) => dispatch(selectZipcode(zipcode)),
  checkStoreConfig: (subDistrictId) => dispatch(checkStoreConfig(subDistrictId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationSelector)
