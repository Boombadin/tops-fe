import React, { PureComponent } from 'react'
import pt from 'prop-types'
import { noop, get as prop, map, find, isEmpty } from 'lodash'
import { connect } from 'react-redux';
import moment from 'moment';
import Cookie from 'js-cookie';
import { getTranslate } from 'react-localize-redux';
import { format } from '../../utils/time';
import ClickAndCollectStore from './ClickAndCollectStore'
import ClickAndCollectForm from './ClickAndCollectForm'
import { fetchStoreLocator } from '../../reducers/checkout'
import { langSelector } from '../../selectors';

class ClickAndCollectTab extends PureComponent {
  state = {
    currentStoreLocator: ''
  };

  static propTypes = {
    onBackClick: pt.func,
  }

  static defaultProps = {
    onBackClick: noop,
  }

  componentDidMount() {
    const shippingMethod = this.props.shippingMethod || Cookie.get('shipping_method');
    this.props.fetchStoreLocator(shippingMethod)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.storeLocator !== this.props.storeLocator) {
      this.setState({ currentStoreLocator: prop(this.props.storeLocator, '0.id', '') });
    }
  }

  handleSetStoreLocator = storeLocator => {
    this.setState({ currentStoreLocator: storeLocator });
  };

  // handleSelectStoreLocator = () => {
  //   this.props.onConfirm('tops')
  // }

  render() {
    const { translate, storeLocator, onConfirm } = this.props

    return (
      <div className="click-collect-tab">
        <div className="click-collect-header">
          <span>{translate('right_menu.shipping_options.pickup_at_store')}</span>
          <span className="text-warning">{translate('right_menu.shipping_options.header.warning')}</span>
        </div>
        <div className="body">
          <div className="address-store">
            <p className="title">{translate('right_menu.shipping_options.pickup_at')}</p>
            {
              map(storeLocator, location => {
                const storeName = prop(location, 'name', '')
                const deliverySlot = prop(location, 'delivery_slot', [])

                const filterSlot = find(deliverySlot, data => {
                  return find(prop(data, 'slots'), slot => {
                    return slot.quota_available > 0 && slot.is_available && slot.quota_available;
                  })
                })

                const nextRound = find(prop(filterSlot, 'slots'), slot => {
                  return slot.quota_available > 0 && slot.is_available && slot.quota_available;
                });

                const selectStore = this.state.currentStoreLocator === location.id || storeLocator.length <= 1
                return (
                  <div className={`click-collect-store-section ${selectStore && 'active'}`}
                  onClick={() => this.handleSetStoreLocator(location.id)}
                  >
                    <div className="click-collect-store-body">
                      <p>{storeName}</p>
                    </div>
                    <div className="click-collect-store-bottom">
                      <span>
                      {translate('right_menu.shipping_options.fast_round')}{' '}
                      {!isEmpty(deliverySlot) && !isEmpty(nextRound) ? 
                        translate('right_menu.shipping_options.next_round_datetime', {
                          date: moment(moment().format('YYYY-MM-DD')).isSame(filterSlot.date) ? translate('right_menu.shipping_options.today') : format(filterSlot.date, "DD MMM", this.props.lang),
                          time: `${nextRound.time_from} - ${nextRound.time_to}`
                        }) : !isEmpty(deliverySlot) && isEmpty(nextRound) ? (
                          translate('timeslot.grid.slot.full')
                        ) : (
                          '-'
                        )}
                      </span>
                      <span className="method-select-slot">{translate('right_menu.shipping_options.select_slot_next_step')}</span>
                      <span>
                        {!isEmpty(nextRound) && prop(nextRound, 'cost') ? prop(nextRound, 'cost') : translate('right_menu.shipping_options.free_service')}
                      </span>
                    </div>
                  </div>
                )
              })
            }
            
          </div>
          <div className="collector-form">
            <p className="title">{translate('right_menu.shipping_options.collector')}</p>
            <ClickAndCollectForm locatorId={this.state.currentStoreLocator} onBackClick={this.props.onBackClick} onConfirm={onConfirm} />
          </div>
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  storeLocator: state.checkout.storeLocator.items,
  lang: langSelector(state),
});

const mapDispatchToProps = dispatch => ({
  fetchStoreLocator: (shippingMethod) => dispatch(fetchStoreLocator(shippingMethod))
});

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ClickAndCollectTab);