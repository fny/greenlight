import React from 'react'
import { Navbar, Page, Block } from 'framework7-react'
import releases, { ReleaseData } from 'src/data/releases'
import { defineMessage, Trans } from '@lingui/macro'
import { getGlobal } from 'reactn'
import { DateTime } from 'luxon'
import { GLLocales } from 'src/i18n'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

class Release {
  releaseData: ReleaseData

  locale: GLLocales

  whatsNew: string[]

  bugFixes: string[]

  notes: string

  constructor(releaseData: ReleaseData) {
    this.releaseData = releaseData
    this.locale = getGlobal().locale
    this.whatsNew = this.locale === 'en' ? this.releaseData.whatsNewEn : this.releaseData.whatsNewEs
    this.bugFixes = this.locale === 'en' ? this.releaseData.bugFixesEn : this.releaseData.bugFixesEs
    this.notes = this.locale === 'en' ? this.releaseData.notesEn : this.releaseData.notesEs
  }

  title() {
    const version = getGlobal().i18n._(defineMessage({ id: 'Common.version', message: 'Version' }))
    return `${version} ${this.releaseData.version}`
  }

  hasNotes() {
    return this.notes.length > 0
  }

  hasWhatsNew() {
    return this.whatsNew.length > 0
  }

  hasBugFixes() {
    return this.bugFixes.length > 0
  }

  whatsNewList() {
    return (
      <ul>
        {this.whatsNew.map((item) => (
          <li dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )
  }

  bugFixesList() {
    return (
      <ul>
        {this.bugFixes.map((item) => (
          <li dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )
  }
}

export default function ReleaseNotesPage() {
  return (
    <Page className="ReleaseNotesPage" noToolbar>
      <Navbar
        title={getGlobal().i18n._(defineMessage({ id: 'ReleaseNotesPage.title', message: 'Greenlight Release Notes' }))}
        sliding
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        {releases
          .map((releaseData: ReleaseData) => new Release(releaseData))
          .map((release: Release) => (
            <div>
              <h2>{release.title()}</h2>
              <p style={{ fontWeight: 'bold' }}>
                {release.releaseData.date.setLocale(getGlobal().locale).toLocaleString(DateTime.DATE_FULL)}
              </p>
              {release.hasNotes() && <p dangerouslySetInnerHTML={{ __html: release.notes }} />}
              {release.hasWhatsNew() && (
                <>
                  <p style={{ fontWeight: 'bold' }}>
                    <Trans id="ReleaseNotesPage.whats_new">What's New</Trans>
                  </p>
                  {release.whatsNewList()}
                </>
              )}
              {release.hasBugFixes() && (
                <>
                  <p style={{ fontWeight: 'bold' }}><Trans id="ReleaseNotesPage.bug_fixes">Bug Fixes</Trans></p>
                  {release.bugFixesList()}
                </>
              )}
            </div>
          ))}
      </Block>
    </Page>
  )
}
