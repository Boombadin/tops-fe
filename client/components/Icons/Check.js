import React from 'react'
import { number } from 'prop-types'

const Check = ({ scale }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={scale * 22} height={scale * 22} viewBox="0 0 22 22">
    <g fill="none" fillRule="evenodd">
      <circle cx="11" cy="11" r="11" fill="#7ED321" />
      <path fill="#FFF" d="M8.172 14.243l-2.829-2.829L6.757 10l2.829 2.828 5.657-5.656 1.414 1.414-7.071 7.07-1.414-1.413z"/>
    </g>
  </svg>
)

Check.propTypes = {
  scale: number,
}

Check.defaultProps = {
  scale: 1
}

export default Check
