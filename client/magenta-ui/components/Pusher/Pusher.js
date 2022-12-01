import React from 'react'
import './Pusher.scss'

const Pusher = ({ open, width, children, className, pusherHeader, pusherFooter, onBackdropClicked }) => (
  <div id="mt-pusher" className={`mt-pusher ${className} ${open ? 'active' : ''}`}>
    <div className="pusher-continer" style={{ width: width }}>
      <div className="pusher-header">{pusherHeader}</div>
      <div className="pusher-body">{children}</div>
      <div className="pusher-footer">{pusherFooter}</div>
    </div>

    <div className="pusher-backdrop" onClick={onBackdropClicked} />
  </div>
)

export default Pusher
