import { createDeepEqualSelector } from '../../../utils/selectors'

export const findDeeplink = (state) => state.deeplink

// Selectors
export const makeGetDeeplink = () => createDeepEqualSelector(
  findDeeplink, (deeplink) => deeplink
)
