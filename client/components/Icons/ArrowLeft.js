import React from 'react'
import pt from 'prop-types'

const ArrowLeft = props => (
  <svg {...props} viewBox="0 0 284.935 284.936">
    <path
      stroke={props.stroke}
      fill={props.fill}
      d="M110.488,142.468L222.694,30.264c1.902-1.903,2.854-4.093,2.854-6.567c0-2.474-0.951-4.664-2.854-6.563L208.417,2.857
        C206.513,0.955,204.324,0,201.856,0c-2.475,0-4.664,0.955-6.567,2.857L62.24,135.9c-1.903,1.903-2.852,4.093-2.852,6.567
        c0,2.475,0.949,4.664,2.852,6.567l133.042,133.043c1.906,1.906,4.097,2.857,6.571,2.857c2.471,0,4.66-0.951,6.563-2.857
        l14.277-14.267c1.902-1.903,2.851-4.094,2.851-6.57c0-2.472-0.948-4.661-2.851-6.564L110.488,142.468z"
    />
  </svg>
)

ArrowLeft.propTypes = {
  stroke: pt.string,
  fill: pt.string
}

ArrowLeft.defaultProps = {
  stroke: '#808080',
  fill: '#808080'
}

export default ArrowLeft
