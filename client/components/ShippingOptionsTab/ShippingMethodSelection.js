import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, get as prop } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import { isMobile } from 'react-device-detect'
import AddressIcon from '../../components/Icons/Address';
import TruckIcon from '../../components/Icons/Truck';
import { Segment, Header, Container, Button, Image, Icon } from '../../magenta-ui';
import { langSelector } from '../../selectors';
import './ShippingOptionsTab.scss';

class ShippingMethodSelector extends PureComponent {

  renderHeader() {
    return (
      <Segment key="header" className="header-wrapper">
        <Container fluid>
          <Header as="h4" className="text" handleToHome={() => this.props.history.push('/')}>{this.props.translate('right_menu.shipping_options.choose_delivery_method')}</Header>
          <div className="info">
            <span>{this.props.translate('right_menu.shipping_options.please_select_delivery_method')}</span>
          </div>
        </Container>
      </Segment>
    );
  }

  renderBody() {
    return (
      <div key="body" className="body">
        <div className="method-choose">
          <div className="icon">
            <TruckIcon />
          </div>
          <div className="name">
            {this.props.translate('right_menu.shipping_options.method')}
          </div>
          <div className="group-title">
            {this.props.translate('right_menu.shipping_options.delivered_to_home')}
          </div>
          <div className="current-method">
            <Image className="icon" src="/assets/icons/delivery-icon.svg" size="small" wrapped />
            <div className="description">
              {this.props.translate('right_menu.shipping_options.standard_delivery')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderBottom() {
    const { cartLoaded } = this.props    

    return (
      <div key="bottom" className="bottom">
        <Button.Group>
          <Button className="back" icon onClick={this.props.onBackClick}>
            <Icon className="angle left" />
            <span className="text">{this.props.translate('right_menu.shipping_options.back')}</span>
          </Button>
          <Button className="verify" icon disabled onClick={this.handleVerifyAddressClick}>
            <span className="text">{this.props.translate('right_menu.shipping_options.verify_address')}</span>
            <Icon className="angle double right" />
          </Button>
        </Button.Group>
      </div>
    );
  }

  render() {
    return [
      this.renderHeader(),
      this.renderBody(),
      this.renderBottom()
    ]
  }
}

const mapStateToProps = (state, ownProps) => ({
  customer: state.customer.items,
  translate: getTranslate(state.locale),
  cartLoaded: state.cart.loaded,
  lang: langSelector(state)
});

const mapDispatchToProps = dispatch => ({

});
  
export default connect(mapStateToProps, mapDispatchToProps)(ShippingMethodSelector);
