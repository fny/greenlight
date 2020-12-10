import React from 'react'
import releaseData from 'src/assets/data/releases'
import Version from 'src/helpers/Version'
import { Icon, Link } from 'framework7-react'
import './ReleaseCard.css'
import { useReducer } from 'reactn'
import { Trans } from '@lingui/macro'
import { paths } from 'src/config/routes'
import CookieJar, { Cookie } from 'src/helpers/CookieJar'

function setLastVersionCookie() {
  CookieJar.set(Cookie.LAST_VERSION, releaseData[0].version)
}

function showNewRelease(): boolean {
  const rawLastVersion = CookieJar.get(Cookie.LAST_VERSION)
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
            <Trans id="ReleaseCard.title">You're updated to v{releaseData[0].version}!</Trans>
          </div>
          <div
            style={{
              width: '50%',
              display: 'inline-block',
              textAlign: 'right',
            }}
          >
            <div
              className="ReleaseCard-close"
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
              <Link href={paths.releasesPath}>
                <Trans id="ReleaseCard.action">See What's New 🎉</Trans>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (<></>)
}
