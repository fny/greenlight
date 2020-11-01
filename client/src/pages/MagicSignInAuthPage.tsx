import React from 'reactn'
import {
  Page,
  Navbar,
  Block,
  Link,
} from 'framework7-react'

import { Case, When } from 'src/components/Case'

import { defineMessage, Trans } from '@lingui/macro'

import { Dict } from 'src/types'
import { getCurrentUser, magicSignIn } from 'src/api'
import { dynamicPaths, paths } from 'src/routes'
import logger from 'src/logger'

interface State {
  hasReceivedResponse: boolean
  isSuccess: boolean
}

export default class MagicSignInAuthPage extends React.Component<Dict<any>, State> {
  state = {
    hasReceivedResponse: true,
    isSuccess: false,
  }

  async authorize() {
    const { token } = this.$f7route.params
    const rememberMe = this.$f7route.params.remember === 'y'

    if (!token) return

    this.$f7.dialog.preloader('Signing in...')

    try {
      await magicSignIn(token, rememberMe)
      const user = await getCurrentUser()
      this.setState({ hasReceivedResponse: true, isSuccess: true })
      this.$f7.dialog.close()
      this.setGlobal({ currentUser: user })
      this.$f7router.navigate(dynamicPaths.currentUserHomePath())
    } catch (error) {
      logger.error(error)
      this.setState({ hasReceivedResponse: true, isSuccess: false })
      this.$f7.dialog.close()
    }
  }

  componentDidMount() {
    this.authorize()
  }

  render() {
    return (
      <Page className="MagicSignInAuthPage" noToolbar noSwipeback loginScreen>
        <Navbar title={this.global.i18n._(defineMessage({ id: 'MagicSignInAuthPage.title', message: 'Magic Sign In' }))} backLink="Back" />

        <Block>
          <Case test={this.state.hasReceivedResponse && !this.state.isSuccess}>
            <When value>
              <Trans id="SignInAuthPage.magic_link_failed">
                That magic sign in link didn't work. It may have expired.
              </Trans>
              <Link href={paths.rootPath}>
                <Trans id="SignInAuthPage.try_again">
                  Try again?
                </Trans>
              </Link>
            </When>
            <When value={false}>
              <Trans id="SignInAuthPage.signing_in">
                Signing in...
              </Trans>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
