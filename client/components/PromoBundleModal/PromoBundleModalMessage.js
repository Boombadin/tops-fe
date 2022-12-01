import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, isEmpty, find } from 'lodash';
import { getTranslate } from 'react-localize-redux';

class PromoBundleModalMessage extends Component {
  static propTypes = {
    itemsBundle: PropTypes.array,
    loaded: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    itemsBundle: [],
  };

  state = {
    isBundleComplete: false,
  };

  componentDidMount() {
    this.generateBundleMessage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.itemsBundle !== prevProps.itemsBundle) {
      this.generateBundleMessage();
    }
  }

  generateBundleMessage() {
    const { itemsBundle, promoNo } = this.props;

    const selectedBundle = find(itemsBundle, bundle => {
      return bundle.name === promoNo;
    });

    if (isEmpty(selectedBundle)) {
      return this.setState({
        isBundleComplete: false,
      });
    }

    const qtyStep = selectedBundle.qty_step;
    const itemLength = selectedBundle.items.length;

    if (itemLength % qtyStep === 0) {
      return this.setState({
        isBundleComplete: true,
      });
    }

    this.setState({
      isBundleComplete: false,
    });
  }

  render() {
    const { translate } = this.props;

    return (
      <div id="promo-bundle-modal-message">
        {this.state.isBundleComplete ? (
          <div className="desc-success">
            {translate('promotion.notic_success')}
          </div>
        ) : (
          <div className="desc">{translate('promotion.notic')}</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  itemsBundle: state.cart.itemsBundle,
  loaded: state.cart.loaded,
});

export default connect(mapStateToProps)(PromoBundleModalMessage);
