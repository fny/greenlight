import { t } from '@lingui/macro'
import {
  Block,
  Link,
  Navbar,
  Page,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import quarantineTableImage from 'src/assets/images/resources/quarantine-table.png'

export default function PositiveResourcesPage(): JSX.Element {
  return (
    <Page>
      <Navbar title="Handling a Positive Case">
        <NavbarHomeLink slot="left" />
      </Navbar>

      <Block>
        <p>
          While handling a symptomatic or positive case might seem stressful, the protocols are actually quite simple to follow.
          There is only one question you need to ask.
        </p>

        <p style={{ fontWeight: 'bold' }}>
          Has the suspected or confirmed individual been present 48 hours before symptom onset or positive test result?
        </p>

        <p>
          <span>No →</span><br />
          <ul>
            <li>Individual should undergo testing and isolate at home.</li>
            <li>No additional testing or quarantine required for other individuals.</li>
            <li>Spaces used by the individual should be <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/organizations/cleaning-disinfection.html" target="_blank">disinfected per CDC guidance.</a></li>
          </ul>
        </p>

        <p>
          <span>Yes →</span><br />
          <ul>
            <li>Individual should undergo testing and isolate at home</li>
            <li>
              Identify close contacts (defined as distance &lt;6 feet for &gt;15 minutes). For schools, be sure to include close contacts on buses and during extracurricular activities. Siblings are also considered close contacts.
            </li>
          </ul>
        </p>

        <p style={{ fontWeight: 'bold' }}>Quarantine Protocol</p>
        <p>
          Depending on whether the the individual has symptoms or has had a test,
          the quarantine protocol differs. Use the table below to determine the proper
          course of action.
        </p>
        <p>
          <img src={quarantineTableImage} alt="Protocols" width="100%" />
        </p>

      </Block>
    </Page>
  )
}
