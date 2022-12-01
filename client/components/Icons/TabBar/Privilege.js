import React from 'react'
import pt from 'prop-types'

const Privilege = props => (
  <svg {...props} width="21" height="16" viewBox="0 0 21 16">
    <path 
      fill={props.fill}
      fillRule="evenodd" 
      d="M16.907 12.746h-6.531v-.996h6.399l2.45-9.05-5.316 4.105a.818.818 0 0 1-.701.147.818.818 0 0 1-.551-.459l-2.293-5.055-2.338 5.061a.824.824 0 0 1-1.254.303L1.526 2.711l2.448 9.039h6.399v.996H3.842a.825.825 0 0 1-.795-.608L.429 2.471a.821.821 0 0 1 1.3-.864l5.484 4.276L9.619.678A.814.814 0 0 1 10.365.2h.004a.812.812 0 0 1 .746.483l2.359 5.2 5.55-4.286a.814.814 0 0 1 .96-.034c.299.2.432.553.338.9L17.7 12.138a.823.823 0 0 1-.794.608zm.205 2.364H3.498a.498.498 0 0 1 0-.996h13.614a.498.498 0 0 1 0 .996z"
    />
  </svg>
)

Privilege.propTypes = {
  fill: pt.string
}

Privilege.defaultProps = {
  fill: '#333'
}

export default Privilege
