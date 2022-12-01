import React from 'react'
import { func, object } from 'prop-types'
import { withTranslate, getMeta } from '../../utils/translate'
import NewYearBusketPage from './NewYearBusketPage'
import { ROUTE_NEW_YEAR_BUSKET } from '../../config/promotions'

const NewYearBusketPageTab1 = (props) => {
  const { lang, location, translate } = props
  const path = location.pathname.slice(1)
  const locate = lang.code
  const metaData = getMeta(locate, path)
  const seo = {
    title: translate('nyb.breadcrumb_tab1'),
    url: ROUTE_NEW_YEAR_BUSKET,
    metaTitle: metaData.meta_title,
    metaDescription: metaData.meta_description,
    metaKeywords: metaData.meta_keywords,
    tabActive: path,
  }
  return (
    <NewYearBusketPage {...seo} {...props} />
  )
}

NewYearBusketPageTab1.propTypes = {
  lang: object.isRequired,
  location: object.isRequired,
  translate: func.isRequired,
}

export default withTranslate(NewYearBusketPageTab1)
