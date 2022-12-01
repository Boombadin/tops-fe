import React, { PureComponent, Fragment } from 'react';
import { func, bool } from 'prop-types';
import { connect } from 'react-redux';
import { makeGetNybModalError, makeGetNormalModalError } from '../redux';
import {
  handleCheckoutModalErrorNyb,
  handleCheckoutModalErrorNormal,
} from '../redux/nybActions';
import { makeGetTranslate } from '../../../utils/translate';
import { ModalNYB } from '../components';

export const withCheckoutNYB = WrapperComponent => {
  class NewYearBasketCheckoutHOC extends PureComponent {
    static propTypes = {
      translate: func.isRequired,
      handleCheckoutModalErrorNyb: func.isRequired,
      handleCheckoutModalErrorNormal: func.isRequired,
      visibleNormal: bool,
      visibleNYB: bool,
    };

    static defaultProps = {
      visibleNormal: false,
      visibleNYB: false,
    };

    handleModalNyb = visible => {
      this.props.handleCheckoutModalErrorNyb(visible);
    };

    handleModalNormal = visible => {
      this.props.handleCheckoutModalErrorNormal(visible);
    };

    render() {
      const { visibleNormal, visibleNYB, translate } = this.props;
      return (
        <Fragment>
          <WrapperComponent {...this.props} />
          <ModalNYB
            type="normal"
            visible={visibleNormal}
            translate={translate}
            onClose={() => this.handleModalNormal(false)}
          />
          <ModalNYB
            type="nyb"
            visible={visibleNYB}
            translate={translate}
            onClose={() => this.handleModalNyb(false)}
          />
        </Fragment>
      );
    }
  }

  const makeMapStateToProps = () => {
    const getTranslate = makeGetTranslate();
    const getModalVisibleNyb = makeGetNybModalError();
    const getModalVisibleNormal = makeGetNormalModalError();
    return state => ({
      translate: getTranslate(state),
      visibleNormal: getModalVisibleNormal(state),
      visibleNYB: getModalVisibleNyb(state),
    });
  };

  const mapDispatchToProps = {
    handleCheckoutModalErrorNyb,
    handleCheckoutModalErrorNormal,
  };

  return connect(
    makeMapStateToProps,
    mapDispatchToProps,
  )(NewYearBasketCheckoutHOC);
};
