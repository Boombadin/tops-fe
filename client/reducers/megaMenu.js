export const TYPES = {
  FETCH_MEGA_MENU: 'FETCH_MEGA_MENU',
};

export const fetchMegaMenu = megaMenu => ({
  type: TYPES.FETCH_MEGA_MENU,
  payload: {
    megaMenu,
  },
});

const initialState = {
  items: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_MEGA_MENU: {
      const { megaMenu } = action.payload;
      return {
        ...state,
        ...{
          items: megaMenu,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
