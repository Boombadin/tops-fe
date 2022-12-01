import React from 'react'
import { func, element, node, oneOfType, bool } from 'prop-types'
import styled from 'styled-components'

export const RowStyle = styled.div`
  display: flex;
  flex-direction: ${props => props.responsive ? 'column' : 'row'};
  @media (min-width: 991px) {
    flex-direction: row;
  }
`

export const RowStyleReverse = styled.div`
  display: flex;
  flex-direction: row;
  @media (min-width: 991px) {
    flex-direction: column;
  }
`

export const Row = (props) => props.reverse ? (
  <RowStyleReverse {...props}>{props.children}</RowStyleReverse>
) : (
  <RowStyle {...props}>{props.children}</RowStyle>
)

Row.propTypes = {
  reverse: bool,
  responsive: bool,
  children: oneOfType([
    func,
    element,
    node,
  ])
}

Row.defaultProps = {
  reverse: false,
  responsive: true,
  children: ''
}
