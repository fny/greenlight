import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
  ListItem, Link
} from 'framework7-react'

import { Case, When } from 'src/components/Case'

import { Trans, t, defineMessage } from '@lingui/macro'
import { i18n, MyTrans } from 'src/i18n'

import { Dict } from 'src/common/types'
import { magicSignIn } from 'src/common/api'
import { dynamicPaths, paths } from 'src/routes'

interface State {
  hasReceivedResponse: boolean
  isSuccess: boolean
}

export default class MagicSignInAuthPage extends React.Component<Dict<any>, State> {
  state = {
    hasReceivedResponse: true,
    isSuccess: false
  }

  async authorize() {
    const token = this.$f7route.params['token']
    const rememberMe = this.$f7route.params['remember'] === 'y'

    if (!token) return

    this.$f7.dialog.preloader('Signing in...')

    try {
      const user = await magicSignIn(token, rememberMe)
      this.setState({hasReceivedResponse: true, isSuccess: true})
      this.$f7.dialog.close()
      this.setGlobal({ currentUser: user })
      this.$f7router.navigate(dynamicPaths.currentUserHomePath())

    } catch (error) {
      console.error(error)
      this.setState({hasReceivedResponse: true, isSuccess: false})
      this.$f7.dialog.close()
    }
  }

  componentDidMount() {
    this.authorize()
  }

  render() {
    return (
      <Page className="MagicSignInAuthPage" noToolbar noSwipeback loginScreen>
        <Navbar title={this.global.i18n._(defineMessage({id: 'MagicSignInAuthPage.title', message: `Magic Sign In`}))} backLink="Back"></Navbar>

        <Block>
          <Case test={this.state.hasReceivedResponse && !this.state.isSuccess}>
            <When value={true}>
              <MyTrans id="SignInAuthPage.magic_link_failed">
                That magic sign in link didn't work. It may have expired.
              </MyTrans>
              <Link href={paths.rootPath}>
                <MyTrans id="SignInAuthPage.try_again">
                  Try again?
                </MyTrans>
              </Link>
            </When>
            <When value={false}>
              <MyTrans id="SignInAuthPage.signing_in">
                Signing in...
              </MyTrans>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
