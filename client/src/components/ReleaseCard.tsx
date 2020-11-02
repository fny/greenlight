import React from 'react'
import Cookies from 'js-cookie'
import releaseData from 'src/data/releases'
import Version from 'src/misc/Version'
import colors from 'src/misc/colors'
import { Icon, Link } from 'framework7-react'
import './ReleaseCard.css'
import { useReducer } from 'reactn'

const LAST_VERSION_COOKIE = '_gl_last_version_seen'

function setLastVersionCookie() {
  Cookies.set(LAST_VERSION_COOKIE, releaseData[0].version)
}

function showNewRelease(): boolean {
  const rawLastVersion = Cookies.get('_gl_last_version_seen')
  if (!rawLastVersion) {
    return true
  }

  const lastVersion = new Version(rawLastVersion)
  const latestVersion = new Version(releaseData[0].version)
  if (releaseData[0].date.diffNow('days').days > 5) {
    return false
  }
  return latestVersion > lastVersion
}

export default function ReleaseCard(): JSX.Element {
  const [,forceUpdate] = useReducer((x) => x + 1, 0)

  if (showNewRelease()) {
    return (
      <div className="ReleaseCard">
        <div className="ReleaseCard-title">

          <div style={{ width: '50%', display: 'inline-block' }}>
            You're updated to v{releaseData[0].version}!
          </div>
          <div
            style={{
              width: '50%',
              display: 'inline-block',
              textAlign: 'right',
            }}
          >
            <div
              onClick={() => {
                setLastVersionCookie()
                forceUpdate()
              }}
            >
              <Icon f7="xmark" style={{ fontSize: '1em' }} />
            </div>
          </div>
        </div>
        <div className="ReleaseCard-action">
          <div className="ReleaseCard-action">
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Link href="/releases">
                See What's New 🎉
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (<></>)
}
