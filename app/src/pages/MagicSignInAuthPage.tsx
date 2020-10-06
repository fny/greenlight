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

import { Trans, t } from '@lingui/macro'
import { i18n } from 'src/i18n'

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
      // TODO: i18n
      // this.$f7.dialog.alert('Magic sign in is invalid', 'Sign In Failed')
    }
  }

  componentDidMount() {
    this.authorize()
  }

  render() {
    return (
      <Page className="MagicSignInAuthPage" noToolbar noSwipeback loginScreen>
        <Navbar title={i18n._(t('MagicSignInAuthPage.title')`Magic Sign In`)} backLink="Back"></Navbar>

        <Block>
          <Case test={this.state.hasReceivedResponse && !this.state.isSuccess}>
            <When value={true}>
              That magic sign in link didn't work. It may have expired.
              <Link href={paths.rootPath}>Try again?</Link>
            </When>
            <When value={false}>
              Signing in...
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
