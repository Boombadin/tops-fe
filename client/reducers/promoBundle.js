import { fetchProductBundle } from './product';

export const TYPES = {
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
};

export const openPromoBundleModal = (promoNo, promoType) => async (dispatch, getState) => {
  dispatch(setSelectedBundleProduct(promoNo, promoType));
  dispatch(fetchProductBundle(promoNo));
};

export const setSelectedBundleProduct = (promoNo, promoType) => ({
  type: TYPES.OPEN_MODAL,
  payload: {
    promoNo,
    promoType,
  },
});

export const closePromoBundleModal = () => ({
  type: TYPES.CLOSE_MODAL,
});

const initialState = {
  modalOpen: false,
  selectedProduct: {},
  activePromoNo: '',
};

const promoBundle = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.OPEN_MODAL: {
      const { promoNo, promoType } = action.payload;
      return {
        ...state,
        modalOpen: true,
        activePromoNo: promoNo,
        activePromoType: promoType,
      };
    }

    case TYPES.CLOSE_MODAL: {
      return { ...state, modalOpen: false };
    }

    default:
      return state;
  }
};

export default promoBundle;
