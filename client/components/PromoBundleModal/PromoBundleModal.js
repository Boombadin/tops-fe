import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Modal, Loader } from '../../magenta-ui';
import PromoBundleList from '../../components/PromoBundleList';
import CartIcon from '../../components/CartIcon';
import PreloadedProductMini from '../../components/PreloadedProductMini';
import PromoBundleNotification, {
  PromoBundleNotificationOld,
} from '../PromoBundleNotification';
import PromoBundleModalMessage from './PromoBundleModalMessage';
import { fetchProductBundle } from '../../reducers/product';
import './PromoBundleModal.scss';

class PromoBundleModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    activePromoNo: PropTypes.string.isRequired,
    activePromoType: PropTypes.string,
    onCloseButton: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    open: false,
    activePromoType: '',
  };

  componentDidMount() {
    if (this.props.activePromoNo) {
      this.props.fetchProductBundle(this.props.activePromoNo);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.activePromoNo &&
      prevProps.activePromoNo !== this.props.activePromoNo
    ) {
      this.props.fetchProductBundle(this.props.activePromoNo);
    }
  }

  render() {
    const {
      onCloseButton,
      activePromoNo,
      activePromoType,
      translate,
      bundleProduct,
    } = this.props;

    return (
      <Modal
        id="promo-bundle-modal"
        className="mt-promo-bundle"
        open
        onClose={onCloseButton}
      >
        <Modal.Header className="mt-promo-bundle--header">
          <button className="close-icon" onClick={onCloseButton}>
            <img src="/assets/icons/close_modal.svg" alt="modal close" />
          </button>
          <div className="header-title">
            <div className="title">
              {/* {translate('promotion.title')}  */}
              {translate(`promotion.${activePromoType}`)}
            </div>
            <div className="desc-container">
              <PromoBundleModalMessage promoNo={activePromoNo} />
            </div>
          </div>
          <div className="m-cart-icon">
            <CartIcon url="/checkout" onClick={onCloseButton} />
            <PromoBundleNotification />
            <PromoBundleNotificationOld />
          </div>
        </Modal.Header>
        <Modal.Content className="mt-promo-bundle--content">
          <div
            className="mt-promo-bundle--container"
            style={{ maxWidth: 400, margin: 'auto' }}
          >
            <PromoBundleList promoNo={activePromoNo} />

            {this.props.bundleLoading && (
              <Loader active size="large" className="fix-bundle-modal" />
            )}

            <PreloadedProductMini
              // filterFunc={product => product.promotion_no === activePromoNo}
              sortingFunc={(a, b) => {
                const asc =
                  a.extension_attributes.stock_item.qty <
                  b.extension_attributes.stock_item.qty;
                return asc;
              }}
              ownProducts={bundleProduct}
            />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  activePromoNo: state.promoBundle.activePromoNo,
  activePromoType: state.promoBundle.activePromoType,
  bundleProduct: state.product.bundle,
  bundleLoading: state.product.bundleLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchProductBundle: promoNo => dispatch(fetchProductBundle(promoNo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromoBundleModal);
