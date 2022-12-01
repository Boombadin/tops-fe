import PropTypes from 'prop-types';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const ReduxContext = createContext();

export function useReduxContext() {
  return useContext(ReduxContext);
}

function ReduxProvider({ children, store }) {
  const [reduxState, setReduxState] = useState({});

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setReduxState(store.getState());
    });

    return unsubscribe;
  }, [store]);

  const reduxStore = useMemo(
    () => ({
      reduxState,
      reduxAction: {
        dispatch: store.dispatch,
      },
    }),
    [reduxState],
  );

  return (
    <ReduxContext.Provider value={reduxStore}>{children}</ReduxContext.Provider>
  );
}

ReduxProvider.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.object.isRequired,
};

export default ReduxProvider;
