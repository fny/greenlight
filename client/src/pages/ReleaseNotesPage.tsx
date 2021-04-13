import React from 'react'
import { Navbar, Page, Block } from 'framework7-react'
import releases, { ReleaseData } from 'src/assets/data/releases'
import { getGlobal } from 'reactn'
import { DateTime } from 'luxon'
import { GLLocales } from 'src/i18n'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { tr } from 'src/components/Tr'

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
    const version = tr({ en: 'Version', es: 'Version' })
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
        title={tr({ en: 'Greenlight Release Notes', es: 'Notas de Lanzamiento' })}
        sliding
        backLink
      />
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
                    <Tr en="What's New" es="Qué Hay de Nuevo" />
                  </p>
                  {release.whatsNewList()}
                </>
              )}
              {release.hasBugFixes() && (
                <>
                  <p style={{ fontWeight: 'bold' }}><Tr en="Bug Fixes" es="Corrección de errores" /></p>
                  {release.bugFixesList()}
                </>
              )}
            </div>
          ))}
      </Block>
    </Page>
  )
}
