import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import NumberFormat from 'react-number-format';
import Loader from '../../components/Loader'
import { getTranslate } from 'react-localize-redux'
import './ShippingDetails.scss'
import { Accordion, Icon } from '../../magenta-ui'

const renderDetail = (detail) => {
  if (detail.data) {
    return (
      <section className="shipping-details-data-pane" key={detail.label}>
        <p className="shipping-details-data-pane__label">{detail.label}:</p>
        <span className="shipping-details-data-pane__data">
          {detail.data}
          {
            detail.tel &&
              <React.Fragment>
                <br />
                {
                  detail.tel && 
                  <span>(
                    {
                      <NumberFormat 
                        value={detail.tel} 
                        displayType="text"
                        format="###-###-####"
                      />
                    })
                  </span>
              }
              </React.Fragment>
          }
        </span>
      </section>
    );
  }
  
  if (detail.method === 'tops_express') {
    return (
      <section className="shipping-details-data-pane" key={detail.label}>
        <p className="shipping-details-data-pane__label">{detail.label}:</p>
        <span className="shipping-details-data-pane__data">
          <span className="powered-by-text-grab">{detail.delivery_method}</span>
          <div className="method-powered-by">
            <span className="powered-by-text-grab">{detail.powered_by}</span>
            <img className="powered-by-icon-grab" src="/assets/images/Grab_logo.svg" alt="" />
          </div>
        </span>
      </section>
    );
  }

  if (detail.shipping_info) {
    return (
      <section className="shipping-details-data-pane" key={detail.label}>
        <p className="shipping-details-data-pane__label">{detail.label}:</p>
        <span className="shipping-details-data-pane__data">
          {
            (detail.shipping_info.address_name)
            ?
              <div>
                <span>
                  {detail.shipping_info.address_name}
                </span>
                <br />
              </div>
            :
              ''
          }
          <span>{detail.shipping_info.address}</span>
        </span>
      </section>
    );
  }

  return null;
};

class ShippingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
    };
    this.renderContent = this.renderContent.bind();
    this.handleClick = this.handleClick.bind();
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  renderContent = () => {
    const { isShownOnMob, activeIndex } = this.state;
    const { leftColData, rightColData, className, mobileColIData, shippingMethod, loaded } = this.props;
    const markupClassName = `shipping-details ${className}`;
    
    return (
      <Accordion className="checkout-page-accordion">
        <Accordion.Title className="checkout-page-accordion-title"
          active={activeIndex === 1} index={1}
          onClick={this.handleClick}
          className="checkout-page-title"
        >
          <Icon className="checkout-page-title__icon chevron down" />
          <Accordion.Title className="checkout-page-title">{shippingMethod !== 'pickupatstore_tops' ? this.props.translate('shipping_address.title') : this.props.translate('shipping_address.title_pickup')}</Accordion.Title>
        </Accordion.Title>
        <Accordion.Content className="checkout-page-content" active={activeIndex === 1}>
          {
            !loaded
            ?
              <Loader className="loader" />
            :
              <div className={markupClassName}>
                <div className="shipping-details-grid desktop">
                  <div className="shipping-details-grid--left">
                    {leftColData.map(detail => renderDetail(detail))}
                  </div>
                  <div className="shipping-details-grid--middle"></div>
                  <div className="shipping-details-grid--right">
                    {rightColData.map(detail => renderDetail(detail))}
                  </div>
                </div>
                <div className="shipping-details-grid mobile">
                  <div className="shipping-details-grid--left">
                    {mobileColIData.map(detail => renderDetail(detail))}
                  </div>
                </div>
              </div>
          }
        </Accordion.Content>
      </Accordion>
    );
  };

  render() {
    return (
      <div className="shipping-details-wrap">
        {this.renderContent()}
      </div>
    );
  }
}

ShippingDetails.propTypes = {
  className: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  leftColData: PropTypes.arrayOf(
    PropTypes.shape(
      {
        label: PropTypes.string,
        data: PropTypes.string,
      }
    )
  ),
  rightColData: PropTypes.arrayOf(
    PropTypes.shape(
      {
        label: PropTypes.string,
        data: PropTypes.string,
      }
    )
  ),
}

ShippingDetails.defaultProps = {
  className: '',
}

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  loaded: state.cart.loaded,
})

export default connect(mapStateToProps)(ShippingDetails)
