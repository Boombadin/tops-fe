import React, { Fragment } from 'react'
import { Tabs as TabDesktop } from './Tabs'
import { TabMoblie } from './TabsMoblie'
import './nyb.scss'

const Tabs = (props) => (
  <Fragment>
    <div className="hide-mobile">
      <TabDesktop {...props} />
    </div>
    <div className="hide-desktop">
      <TabMoblie {...props} />
    </div>
  </Fragment>
)

// Export
export { Tabs }
export { ModalNYB } from './ModalNYB'
export { TextPromotion } from './TextPromotion'
