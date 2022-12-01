import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { get as prop } from 'lodash'
import './ShippingAddressPreview.scss'

const translation = {
  th_TH: {
    recipient: 'ผู้รับ',
    telephone: 'โทรศัพท์',
    edit: 'แก้ไข',
    delete: 'ลบ',
    soi: 'ซอย',
    moo: 'หมู่',
    default: 'ที่อยู่เริ่มต้น'
  },
  en_US: {
    recipient: 'Recipient',
    telephone: 'Tel.',
    edit: 'Edit',
    delete: 'Delete',
    soi: 'Soi',
    moo: 'Moo',
    default: 'Default Address'
  }
};

class ShippingAddressPreview extends PureComponent {
  render() {
    const {
      className,
      lang,
      address,
      isDefault,
      onClick,
      onEditClick,
      onDeleteClick,
      isShowDefault
    } = this.props;

    const {
      address_name: addressName,
      road,
      district,
      subdistrict,
      house_no: houseNo,
      telephone,
      postcode,
      firstname: firstName,
      lastname: lastName,
      soi,
      moo,
      village_name: village,
      default_shipping: DefaultShipping
    } = address;

    const region = prop(address, 'region.region');
    const showControls = onEditClick || onDeleteClick;

    return (
      <div
        className={`mt-shipping-address-preview-root ${className} ${isDefault ? 'mt-shipping-address-preview-default' : ''}`}
        onClick={onClick}
      >
        <div className="address-name-content">
          <div className="address-name">
            {`${addressName || ''}`} 
          </div>
          <div className="remark-address-default">
            {`${(isShowDefault && DefaultShipping) ? `(${translation[lang].default})` : ''}`}
          </div>
        </div>
        <div className="details">
          <div>{houseNo} {soi && `${translation[lang].soi} ${soi}`} {moo && `${translation[lang].moo} ${moo}`} {village}</div>
          <div>{road} {subdistrict} {district}</div>
          <div>{region} {postcode}</div>
        </div>
        <div className="manage">
          <div className="user-info" style={{ maxWidth: !showControls && '100%' }}>
            {(firstName || lastName) && <div>{translation[lang].recipient}: {firstName} {lastName}</div>}
            {telephone && <div>{translation[lang].telephone}: {telephone}</div>}
          </div>
          {showControls && (
            <div className="controls">
              {onEditClick && <span className="edit" onClick={onEditClick}>{translation[lang].edit}</span>}
              {onDeleteClick && (
                <span>
                  <span className="separator">|</span>
                  <span className="delete" onClick={onDeleteClick}>{translation[lang].delete}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

ShippingAddressPreview.propTypes = {
  className: PropTypes.string,
  lang: PropTypes.string,
  address: PropTypes.object.isRequired,
  isDefault: PropTypes.string,
  onClick: PropTypes.string,
  onEditClick: PropTypes.string,
  onDeleteClick: PropTypes.string
};

ShippingAddressPreview.defaultProps = {
  className: '',
  lang: 'en_US',
  address: {}
};

export default ShippingAddressPreview;
