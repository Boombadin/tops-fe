import { connect } from 'react-redux'
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import { createDeepEqualSelector } from '../selectors'

// Find State in Redux
const findTranslate = (state) => getTranslate(state.locale)
const findLanguage = (state) => getActiveLanguage(state.locale)

// Selectors
export const makeGetTranslate = () => createDeepEqualSelector(
  findTranslate, (translate) => translate
)
export const makeGetLanguage = () => createDeepEqualSelector(
  findLanguage, (lang) => lang
)

// MakeMapStateToProps
const makeMapStateToProps = () => {
  const getTranslator = makeGetTranslate()
  const getLang = makeGetLanguage()
  return (state) => ({
    translate: getTranslator(state),
    lang: getLang(state)
  })
}

// connect react-localize-redux only
export const withTranslate = (WrapperComponent) => connect(makeMapStateToProps, {})(WrapperComponent)