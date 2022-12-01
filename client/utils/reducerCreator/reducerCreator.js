import { get } from 'lodash'

const defaultInitialState = {
  keys: {},
  byID: [],
  isFetching: false,
  isReload: true,
  isDeleting: false,
  error: '',
  errorDelete: '',
  code: 0,
}

/**
 * Default Initial State
 * @param {Object} newState set initial state
 * @return {State}
 * @example
 * export const initialState = defaultState({ ...state })
 */
export const defaultState = newState => ({
  ...defaultInitialState,
  ...newState,
})

/**
 * @typedef {defaultInitialState} State
 *
 * @typedef {Object} Action
 * @property {String} type
 * @property {String} [key]
 * @property {Object|Array} [data]
 * @property {Error} error
 */

/**
 * Reducer Creator
 * @param {State} state state in store from redux
 * @param {Action} action action action from action creator
 * @param {string} keyID key of item ID
 */
export const reducerCreator = (state, action, keyID) => {
  const key = keyID || action.key

  /**
   * Get Error Message
   * @return {String} response error message is string
   */
  const errorMessage = () => {
    const { error } = action
    return get(error, 'response.error', error.message)
  }

  /**
   * Set State
   * @param {State} newState create new state
   * @return {State} get new state
   */
  const setState = (newState) => ({
    ...state,
    ...newState,
  })

  /**
   * Set State case request
   * @param {State} newState create new state
   * @return {State} get new state
   */
  const setStateRequest = newState => ({
    ...state,
    isFetching: true,
    isReload: false,
    error: '',
    ...newState,
  })

  /**
   * Set State case success
   * @param {State} newState create new state
   * @return {State} get new state
   */
  const setStateSuccess = newState => ({
    ...state,
    isFetching: false,
    isReload: false,
    error: '',
    ...newState,
  })

  /**
   * Set State case failure
   * @param {State} newState create new state
   * @return {State} get new state
   */
  const setStateFailure = newState => ({
    ...state,
    isFetching: false,
    isReload: false,
    error: errorMessage(),
    ...newState,
  })

  /**
   * Set state withKey in Reducer
   * @param {StateWithKey} newState create new state in key object
   * @return {State} get new state in key object
   */
  const setStateWithKey = newState => ({
    ...state,
    keys: {
      ...state.keys,
      [key]: {
        ...state.keys[key],
        ...newState,
      },
    },
  })

  /**
   * Get state withKey in Reducer
   * @return {StateWithKey} getState in key object
   */
  const getStateWithKey = () => state.keys[key]

  /**
   * setState with Key case request
   * @param {StateWithKey} [newState] craete new state
   * @return {State}
   */
  const setStateWithKeyRequest = newState => setStateWithKey({
    isFetching: true,
    isReload: false,
    error: '',
    ...newState,
  })

  /**
   * setState with Key case success
   * @param {StateWithKey} newState craete new state
   * @return {State} new state data
   */
  const setStateWithKeySuccess = newState => setStateWithKey({
    isFetching: false,
    isReload: false,
    error: '',
    ...newState,
  })

  /**
   * setState with Key case failure
   * @param {StateWithKey} [newState] craete new state
   * @return {State} new state data
   */
  const setStateWithKeyFailure = newState => setStateWithKey({
    isFetching: false,
    isReload: false,
    error: errorMessage(),
    ...newState,
  })

  // Exports
  return {
    errorMessage,
    setState,
    setStateRequest,
    setStateSuccess,
    setStateFailure,
    setStateWithKey,
    getStateWithKey,
    setStateWithKeyRequest,
    setStateWithKeySuccess,
    setStateWithKeyFailure,
  }
}
