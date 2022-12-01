import React from 'react'
import { string, oneOfType, node, func, element, number, bool } from 'prop-types'
import styled from 'styled-components'

export const CardPlate = styled.div`
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 15px;
  width: ${props => props.width ? `${props.width}px` : 'auto'};
  box-shadow: '0px 5px 10px rgba(0,0,0,0.2)';
`

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.color ? '#fff' : '#333'};
`

export const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 15px 10px 15px;
  border-radius: 5px 5px 0 0;
  border-bottom-color: ${props => props.color || '#999'};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  background-color: ${props => props.color || 'transparent'};
  box-shadow: '0px 5px 10px rgba(0,0,0,0.2)';
`

export const CardBody = styled.div`
  border: ${props => props.isBorder ? 1 : 0}px solid #ccc;
  width: auto;
  border-top: 0px;
  border-radius: 0 0 5px 5px;
  box-shadow: '0px 5px 10px rgba(0,0,0,0.2)';
`

export const Body = styled.div`
  padding: 5px;
  width: auto;
  @media (min-width: 991px) {
    padding: 15px;
  }
`

export const CardFooter = styled.div`
  border-top: 1px solid #ccc;
  box-shadow: '0px 5px 10px rgba(0,0,0,0.2)';
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CardTitleActions = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
  padding: ${props => props.padding ? `${props.padding}px` : '0'};
`

export const Flex = styled.div`
  flex: 1;
`

const Card = (props) => {
  const { title, children, color, actions, width, footer, isBorder } = props
  return (
    <CardPlate color={color} width={width}>
      {
        title && (
          <CardHeader color={color}>
            <CardTitle color={color}>{title}</CardTitle>
            <Flex />
            <CardTitleActions>
              {actions()}
            </CardTitleActions>
          </CardHeader> 
        )
      }
      <CardBody isBorder={isBorder}>
        <Body>
          {children}
        </Body>
        {
          footer && (
            <CardFooter isBorder={isBorder}>
              {footer()}
            </CardFooter>  
          )
        }
      </CardBody>
      
    </CardPlate>
  )
}

Card.propTypes = {
  title: oneOfType([
    string,
    node,
    func,
    element,
  ]),
  children: oneOfType([
    node,
    func,
    element,
  ]),
  color: string,
  actions: func,
  width: number,
  footer: func,
  isBorder: bool,
}

Card.defaultProps = {
  title: '',
  children: null,
  color: '',
  actions: () => null,
  width: 0,
  footer: null,
  isBorder: true,
}

export default Card
