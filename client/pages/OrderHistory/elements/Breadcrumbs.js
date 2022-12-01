import React from 'react'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import BreadcrumbsComponent from '../../../components/Breadcrumbs'
import { Breadcrumb } from '../../../magenta-ui'

const getBreadcrumbs = translate => [
  {
    label: translate('homepage_text'),
    url: '/'
  },
  // {
  //   label: translate('order_history.my_account'),
  //   url: '/profile'
  // },
  {
    label: translate('order_history.order_history'),
    url: '/order-history',
    isStatic: true
  }
]

const mapStateToProps = state => ({
  translate: getTranslate(state.locale)
})

export const Breadcrumbs = connect(mapStateToProps)(
  ({ translate, breadcrumbs = getBreadcrumbs(translate) }) => (
    <div className="breadcrumb-background">
      <Breadcrumb>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbsComponent
            key={breadcrumb.label}
            label={breadcrumb.label}
            url={breadcrumb.url}
            isStatic={breadcrumb.isStatic}
            hasNext={index < breadcrumbs.length - 1}
          />
        ))}
      </Breadcrumb>
    </div>
  )
)
