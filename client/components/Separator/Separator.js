import React from 'react'
import styled from 'styled-components'
import { Row, Col } from '../Grid'

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: #d8d8d8;
  margin: 20px;
`

export const Separator = () => (
  <Row>
    <Col />
    <Col flex={3}>
      <Line />
    </Col>
    <Col />
  </Row>
)
