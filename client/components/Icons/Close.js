import React from 'react'
import pt from 'prop-types'


const Close = props => (
  <svg {...props} viewBox="0 0 224.512 224.512">
    <polygon
      points="224.507,6.997 217.521,0 112.256,105.258 6.998,0 0.005,6.997 105.263,112.254 
      0.005,217.512 6.998,224.512 112.256,119.24 217.521,224.512 224.507,217.512 119.249,112.254"
    />
  </svg>
)

Close.propTypes = {
  stroke: pt.string,
  fill: pt.string
}

Close.defaultProps = {
  stroke: '#808080',
  fill: '#808080'
}

export default Close
