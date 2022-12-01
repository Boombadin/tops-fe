import Cookie from 'js-cookie';
import popup from '../utils/popup';
import { get } from 'lodash';

export const TYPES = {
  SET_FULL_PAGE_LOADING: 'SET_FULL_PAGE_LOADING',
  SET_PAGE_WIDTH: 'SET_PAGE_WIDTH',
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_SIDEBAR_ANIMATE: 'SET_SIDEBAR_ANIMATE',
  TOGGLE_LOGIN_SIDEBAR: 'TOGGLE_LOGIN_SIDEBAR',
  CLOSE_LOGIN_SIDEBAR: 'CLOSE_LOGIN_SIDEBAR',
  SET_ALWAYS_SHOW_SIDEBAR: 'SET_ALWAYS_SHOW_SIDEBAR',
  MODAL_OPENED: 'MODAL_OPENED',
  MODAL_CLOSED: 'MODAL_CLOSED',
  ON_BOARDING_DELIVERY_OPEN: 'ON_BOARDING_DELIVERY_OPEN',
  ON_BOARDING_CART_OPEN_COMPLETED: 'ON_BOARDING_CART_OPEN_COMPLETED',
  ON_BOARDING_CART_CLOSE_MODAL: 'ON_BOARDING_CART_CLOSE_MODAL',
  SHOW_BACKGROUND_OVERLAY: 'SHOW_BACKGROUND_OVERLAY',
};

export const setPageWidth = pageWidth => ({
  type: TYPES.SET_PAGE_WIDTH,
  payload: {
    pageWidth,
  },
});

export const setSidebar = currentTab => {
  return async (dispatch, getState) => {
    const store = getState();

    if (store.layout.alwaysShowSidebar && currentTab === -1) {
      return;
    }

    const reducerTab = getState().layout.sidebarActiveTab;

    dispatch(setSidebarStatus(currentTab));

    if (
      (reducerTab === -1 && currentTab !== -1) ||
      (reducerTab !== -1 && currentTab === -1)
    ) {
      setTimeout(() => {
        dispatch(setSidebarAnimate());
      }, 1);
    }
  };
};

export const onBoardingNextStepCart = () => {
  return async dispatch => {
    dispatch(onBoardingCartOpen());
  };
};

export const setSidebarStatus = index => ({
  type: TYPES.SET_SIDEBAR,
  payload: {
    index,
  },
});

export const fullPageLoading = (condition, message) => ({
  type: TYPES.SET_FULL_PAGE_LOADING,
  payload: {
    condition,
    message,
  },
});

export const setSidebarAnimate = () => ({
  type: TYPES.SET_SIDEBAR_ANIMATE,
});

export const toggleLogin = () => ({
  type: TYPES.TOGGLE_LOGIN_SIDEBAR,
});

export const openLoginPopup = () => {
  return (dispatch, getState) => {
    const url = getState().storeConfig.default.extension_attributes.login_url;
    popup(url);
  };
};

export const openRegisterPopup = () => {
  return (dispatch, getState) => {
    const url = getState().storeConfig.default.extension_attributes
      .register_url;
    popup(url);
  };
};

export const closeLoginSidebar = () => ({
  type: TYPES.CLOSE_LOGIN_SIDEBAR,
});

export const setAlwaysShowSidebar = value => ({
  type: TYPES.SET_ALWAYS_SHOW_SIDEBAR,
  payload: value,
});

export const setModalOpened = () => ({
  type: TYPES.MODAL_OPENED,
});

export const setModalClosed = () => ({
  type: TYPES.MODAL_CLOSED,
});

export const onBoardingDeliveryOpen = () => ({
  type: TYPES.ON_BOARDING_DELIVERY_OPEN,
});

export const onBoardingCartOpen = () => {
  return (dispatch, getState) => {
    const { customer } = getState();
    Cookie.set(`onboarding_${get(customer, 'items.id')}`, true);

    dispatch(onBoardingCartOpenCompleted());
    // dispatch(showBackgroundOverlay());
  };
};

export const onBoardingCartOpenCompleted = () => ({
  type: TYPES.ON_BOARDING_CART_OPEN_COMPLETED,
});

export const onBoardingCartClose = () => {
  return (dispatch, getState) => {
    const { customer } = getState();
    Cookie.set(`onboarding_${get(customer, 'items.id')}`, true);

    dispatch(onBoardingCartCloseModal());
  };
};

export const onBoardingCartCloseModal = () => ({
  type: TYPES.ON_BOARDING_CART_CLOSE_MODAL,
});

export const showBackgroundOverlay = () => ({
  type: TYPES.SHOW_BACKGROUND_OVERLAY,
});

const initialState = {
  pageWidth: 0,
  sidebarActiveTab: -1,
  sidebarAnimated: true,
  modalActive: false,
  fullPageLoading: false,
  fullPageMessage: '',
  onBoardingCart: false,
  onBoardingDelivery: false,
  backgroundOverlay: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.SET_PAGE_WIDTH: {
      return { ...state, pageWidth: action.payload.pageWidth };
    }
    case TYPES.SET_SIDEBAR: {
      return { ...state, sidebarActiveTab: action.payload.index };
    }
    case TYPES.SET_SIDEBAR_ANIMATE: {
      return { ...state, sidebarAnimated: !state.sidebarAnimated };
    }
    case TYPES.TOGGLE_LOGIN_SIDEBAR: {
      return { ...state, showLoginSidebar: !state.showLoginSidebar };
    }
    case TYPES.CLOSE_LOGIN_SIDEBAR: {
      return { ...state, showLoginSidebar: false };
    }
    case TYPES.SET_ALWAYS_SHOW_SIDEBAR: {
      return { ...state, alwaysShowSidebar: action.payload };
    }
    case TYPES.MODAL_OPENED: {
      return { ...state, modalActive: true };
    }
    case TYPES.MODAL_CLOSED: {
      return { ...state, modalActive: false };
    }
    case TYPES.SET_FULL_PAGE_LOADING: {
      const { condition, message } = action.payload;
      return { ...state, fullPageLoading: condition, fullPageMessage: message };
    }
    case TYPES.ON_BOARDING_DELIVERY_OPEN: {
      return {
        ...state,
        onBoardingDelivery: true,
        onBoardingCart: false,
      };
    }
    case TYPES.ON_BOARDING_CART_OPEN_COMPLETED: {
      return {
        ...state,
        onBoardingDelivery: false,
        onBoardingCart: true,
      };
    }
    case TYPES.ON_BOARDING_CART_CLOSE_MODAL: {
      return {
        ...state,
        onBoardingDelivery: false,
        onBoardingCart: false,
        backgroundOverlay: false,
      };
    }
    case TYPES.SHOW_BACKGROUND_OVERLAY: {
      return {
        ...state,
        backgroundOverlay: true,
      };
    }
    default:
      return state;
  }
};

export default reducer;
