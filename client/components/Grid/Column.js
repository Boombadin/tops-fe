import React from 'react'
import { func, number, element, node, oneOfType, oneOf } from 'prop-types'
import styled from 'styled-components'

export const Column = styled.div`
  flex: ${props => props.flex};
  flex-direction: ${props => props.flexDirection};
`

export const Col = (props) => {
  const { flex, flexDirection, children } = props
  return (
    <Column 
      {...props}
      flexDirection={flexDirection}
      flex={flex}
    >
      {children}
    </Column>
  )
}

Col.propTypes = {
  flex: number,
  flexDirection: oneOf([
    'row',
    'row-reverse',
    'column',
    'column-reverse',
  ]),
  children: oneOfType([
    func,
    element,
    node,
  ])
}

Col.defaultProps = {
  flex: 1,
  flexDirection: 'column',
  children: ''
}

