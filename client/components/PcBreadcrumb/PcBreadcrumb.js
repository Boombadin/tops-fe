import React from 'react'
import { Breadcrumb } from '../../magenta-ui'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { find } from 'lodash'

const PcBreadcrumb = ({ categories, category }) => {
  const breadcrumbs = []

  if (category.level >= 3) {
    // Push parent first
    const parentId = category.parent_id
    const parentCateg = find(categories, categ => categ.id === parentId)

    if (category.level === 4) {
      const mainCateg = find(categories, categ => categ.id === parentCateg.parent_id)

      if (mainCateg) {
        breadcrumbs.push({
          label: mainCateg.name,
          url: `/${mainCateg.url_path}`
        })
      }
    }

    if (parentCateg) {
      breadcrumbs.push({
        label: parentCateg.name,
        url: `/${parentCateg.url_path}`
      })
    }
  }

  // Push current category
  breadcrumbs.push({
    label: category.name,
    url: `/${category.url_path}`,
    isStatic: true
  })

  return (
    <div className="breadcrumb-background">
      <Breadcrumb>
        {breadcrumbs.map(breadcrumb => {
          return breadcrumb.isStatic ? (
            <Breadcrumb.Section active>{breadcrumb.label}</Breadcrumb.Section>
          ) : (
            <React.Fragment>
              <Breadcrumb.Section>
                <Link to={breadcrumb.url}>{breadcrumb.label}</Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider />
            </React.Fragment>
          )
        })}
      </Breadcrumb>
    </div>
  )
}

PcBreadcrumb.propTypes = {
  category: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired
}

export default PcBreadcrumb
