import React from 'react'
import pt from 'prop-types'

const ArrowRight = props => (
  <svg {...props} viewBox="0 0 284.935 284.936">
    <path
      stroke={props.stroke}
      fill={props.fill}
      d="M222.701,135.9L89.652,2.857C87.748,0.955,85.557,0,83.084,0c-2.474,0-4.664,0.955-6.567,2.857L62.244,17.133
        c-1.906,1.903-2.855,4.089-2.855,6.567c0,2.478,0.949,4.664,2.855,6.567l112.204,112.204L62.244,254.677
        c-1.906,1.903-2.855,4.093-2.855,6.564c0,2.477,0.949,4.667,2.855,6.57l14.274,14.271c1.903,1.905,4.093,2.854,6.567,2.854
        c2.473,0,4.663-0.951,6.567-2.854l133.042-133.044c1.902-1.902,2.854-4.093,2.854-6.567S224.603,137.807,222.701,135.9z"
    />
  </svg>
)

ArrowRight.propTypes = {
  stroke: pt.string,
  fill: pt.string
}

ArrowRight.defaultProps = {
  stroke: '#808080',
  fill: '#808080'
}

export default ArrowRight
