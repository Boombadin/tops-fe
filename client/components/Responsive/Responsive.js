import React from 'react'
import Responsive from 'react-responsive'

const Desktop = props => <Responsive {...props} minWidth={991} />
const Tablet = props => <Responsive {...props} maxWidth={990} />;
const Mobile = props => <Responsive {...props} maxWidth={490} />;

export {
  Desktop,
  Tablet,
  Mobile
}
