import React from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import { Page, Navbar, Block, Button, BlockTitle } from 'framework7-react'
import { GiphyForToday } from 'src/components/Giphy'
import { Trans, t, defineMessage } from '@lingui/macro'
import { NoCurrentUserError } from 'src/common/errors'
import { User } from 'src/common/models'
import { paths } from 'src/routes'
import { MyTrans } from 'src/i18n'
import { reasonMessage, reasonTitle } from 'src/misc/reasons'


export default class SurveyThankYouPage extends ReactNComponent<any, any> {
  currentUser: User
  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.currentUser = this.global.currentUser
  }


  anyMissing() {
    return this.currentUser.usersExpectedToSubmit().map(x => x.greenlightStatus()).some(x => x.isUnknown())
  }

  allCleared() {
    return this.currentUser.areUsersCleared()
  }

  renderAllCleared() {
    return (
      <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'SurveyThankYouPage.cleared_title', message: "All Clear!" }))}
        >
        </Navbar>

        <Block>
          <p>
            <MyTrans id="SurveyThankYouPage.thank_you">
              Thanks for submitting your survey! Here's something we hope will make you smile. 😃
            </MyTrans>
          </p>
          <GiphyForToday />
          <Button large fill href={paths.dashboardPath}>
            <MyTrans id="SurveyThankYouPage.back_home">
              Back Home
            </MyTrans>
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatusBreakdownNotSubmitted() {
    // TODO: This needs to be improved
    return <Page>
       <Navbar
         title="More to Submit"
       >
       </Navbar>
       <Block>
         <p style={{fontWeight: "bold"}}>
           You still have more surveys to submit.
         </p>
         <ul>
           {
             this.currentUser.usersExpectedToSubmit().map(u => (
                 <li>{u.fullName()}: {u.greenlightStatus().title()}</li>
             ))
           }
           </ul>
           <br />
           <p>
         <img alt="Doctors" src="/images/doctors.svg" />
       </p>
         <Button large fill href={paths.dashboardPath}>
           <MyTrans id="SurveyThankYouPage.back_home">
             Back Home
           </MyTrans>
         </Button>
       </Block>
     </Page>
   }



  renderStatusBreakdown() {
   // TODO: This needs to be improved
   return <Page>
      <Navbar
        title="Please Take Care"
      >
      </Navbar>
      <Block>
        <p style={{fontWeight: "bold"}}>
          Not everyone was cleared.
        </p>
        <p>
          Your surveys indicates that someone should stay home and seek attention.
          For details and resources, please see your home page.
        </p>
          {
            this.currentUser.usersExpectedToSubmit().map(u => (
              <>
                <p style={{fontWeight: 'bold'}}>{u.fullName()}: {u.greenlightStatus().title()}</p>

                <p>{reasonMessage(u, this.currentUser)}</p>
              </>
            ))
          }
          <p>
        <img alt="Doctors" src="/images/doctors.svg" />
      </p>
        <Button large fill href={paths.dashboardPath}>
          <MyTrans id="SurveyThankYouPage.back_home">
            Back Home
          </MyTrans>
        </Button>
      </Block>
    </Page>
  }

  renderStatus() {
    const title = reasonTitle(this.currentUser, this.currentUser)
    const message = reasonMessage(this.currentUser, this.currentUser)
    // TODO: This needs to be improved
    return <Page>
    <Navbar
      title={title}
    >
    </Navbar>
    <BlockTitle>Status: {this.currentUser.greenlightStatus().title()}</BlockTitle>
    <Block>
      <p>
        {message}
      </p>
      <br />
      <p>
        <img alt="Doctors" src="/images/doctors.svg" />
      </p>
      <br />
      <Button large fill href={paths.dashboardPath}>
        <MyTrans id="SurveyThankYouPage.back_home">
          Back Home
        </MyTrans>
      </Button>
    </Block>
  </Page>
  }

  render() {
    if (this.anyMissing()) {
      return this.renderStatusBreakdownNotSubmitted()
    }
    if (this.allCleared()) {
      return this.renderAllCleared()
    }

    if (this.currentUser.hasChildren()) {
      return this.renderStatusBreakdown()
    } else {
      return this.renderStatus()
    }

  }
}
