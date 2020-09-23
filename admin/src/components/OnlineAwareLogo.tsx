import React, { useGlobal } from 'reactn'

export default function OnlineAwareLogo() {
  const [isOnline, ] = useGlobal('isOnline')

  if (isOnline) {
    return <span style={{fontWeight: 'bold', fontSize: '20px', color: 'var(--gl-green)'}}>
      Greenlight<span style={{color: 'var(--gl-green-light)'}}>.</span>
    </span>
  } else {
    return <div style={{lineHeight: '1em'}}>
      <span style={{fontWeight: 'bold', fontSize: '15px', color: 'var(--gl-green)'}}>
      Greenlight<span style={{color: 'var(--gl-green-light)'}}>.</span></span>
      <br />
      <span style={{fontWeight: 'bold', fontSize: '10px', color: '#999'}}>Offline.</span>
    </div>
  }
}