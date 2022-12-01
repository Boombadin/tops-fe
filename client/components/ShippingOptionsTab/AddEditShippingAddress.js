import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, isEmpty, filter, reduce } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import { isMobile } from 'react-device-detect';
import { Button, Icon, Segment, Header, Container, Loader } from '../../magenta-ui';
import { addAddress, editAddress } from '../../reducers/customer';
import { fetchProvince } from '../../reducers/region';
import { requiredFields } from '../../constants/shippingAddress';
import { createCustomAttributes } from '../../utils/api';
import { getShippingAddressesSelector } from '../../selectors';
import AddressForm from './AddressForm';
import './ShippingOptionsTab.scss';

class AddEditShippingAddress extends PureComponent {
  static propTypes = {
    shippingAddresses: PropTypes.array.isRequired,
    provinces: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    addAddress: PropTypes.func.isRequired,
    editAddress: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
    onVerifyAddressClick: PropTypes.func.isRequired
  };

  state = {
    errors: {},
    requestsPending: false
  };

  componentWillMount() {
    this.props.fetchProvince();
  }

  handleVerifyAddress = async () => {
    const { provinces, form, shippingAddresses } = this.props;
    let { values = {} } = form;

    this.setState({ requestsPending: true })

    const emptyRequiredFields = filter(requiredFields, field => !values[field]);

    if (!isEmpty(emptyRequiredFields)) {
      this.setState({ requestsPending: false })
      return this.setState({
        focusedField: emptyRequiredFields[0],
        errors: reduce(
          emptyRequiredFields,
          (memo, field) => ({ ...memo, [field]: true }),
          {}
        )
      }, () => {
        this.setState({ focusedField: null });
      });
    }

    if (values.region_id) {
      values.region_id = String(values.region_id);
      const region = find(provinces, province => province.region_id === values.region_id);

      values.countryId = region.country_id;
    }

    values = reduce(values, (memo, val, key) => ({
      ...memo,
      [key]: typeof val === 'number' ? String(val) : val
    }), {});

    values.customer_address_type = 'shipping';

    if (isEmpty(shippingAddresses)) {
      values.default_shipping = true;
    }

    if (values.id) {
      await this.props.editAddress(values);
    } else {
      await this.props.addAddress(values);
    }

    this.setState({ requestsPending: false })
    this.props.afterVerify()
  }

  onRef = ref => this.form = ref;

  renderHeader() {
    return (
      <Segment className="header-wrapper">
        <Container fluid>
          <Header as="h4" className="text" handleToHome={() => this.props.history.push('/')}>{this.props.translate('right_menu.shipping_options.edit')}</Header>
          <div className="info">
            {this.props.translate('right_menu.shipping_options.header.enter_new')}
          </div>
        </Container>
      </Segment>
    )
  }

  renderBody() {
    const { onDefaultLocate } = this.props;
    return (
      <div key="body" className="body">
        <AddressForm
          onRef={this.onRef}
          focusedField={this.state.focusedField}
          errors={this.state.errors}
          onDefaultLocate={onDefaultLocate}
        />
      </div>
    );
  }

  renderBottom() {
    const disableBackButton = isEmpty(this.props.shippingAddresses);

    return (
      <div key="bottom" className="bottom">
        <Button.Group>
          <Button className="back" icon  onClick={this.props.onBackClick}>
            <Icon className="angle left" />
            <span className="text">{this.props.translate('right_menu.shipping_options.back')}</span>
          </Button>
          <Button className="verify" icon onClick={this.handleVerifyAddress}>
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
      this.renderBottom(),
      this.state.requestsPending && <div className="shipping-options-tab-mask" />,
      <Loader
        className="shipping-options-tab-loader"
        active={this.state.requestsPending}
        size="large"
      />
    ];
  }
}

const mapStateToProps = (state, ownProps) => ({
  shippingAddresses: getShippingAddressesSelector(state),
  form: state.form.address,
  translate: getTranslate(state.locale),
  provinces: state.region.provinces
});

const mapDispatchToProps = dispatch => ({
  fetchProvince: () => dispatch(fetchProvince()),
  addAddress: address => dispatch(addAddress(address)),
  editAddress: address => dispatch(editAddress(address))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditShippingAddress);
