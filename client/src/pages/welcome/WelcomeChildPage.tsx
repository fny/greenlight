import {
  Page, Navbar, Block, List, ListItem, Button
} from 'framework7-react'

import { updateUser } from 'src/api'
import { dynamicPaths, paths } from 'src/config/routes'
import { deleteBlanks } from 'src/helpers/util'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import logger from 'src/helpers/logger'
import { User } from '../../models/User'
import { Case, When } from '../../components/Case'
import Tr, { En, Es, tr } from 'src/components/Tr'
import { plural } from 'src/i18n'
import React from 'react'

interface State {
  physicianName: string
  physicianPhoneNumber: string
  needsPhysician: boolean
  currentUser: User
}

export default class extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props)
    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.state = {
      physicianName: '',
      physicianPhoneNumber: '',
      needsPhysician: false,
      currentUser: this.global.currentUser,
    }
  }

  childIndex() {
    const rawId = this.$f7route.params.id
    if (!rawId) throw new Error('Child id missing')
    return parseInt(rawId, 10)
  }

  child(): User {
    return this.state.currentUser.sortedChildren()[this.childIndex()]
  }

  hasNextChild() {
    return this.childIndex() < this.state.currentUser.children.length - 1
  }

  nextChild() {
    if (!this.hasNextChild()) {
      return null
    }
    return this.state.currentUser.children[this.childIndex() + 1]
  }

  childCount() {
    return this.state.currentUser.children.length
  }

  childrenNames() {
    const { children } = this.state.currentUser
    let names = ''
    for (let i = 0; i < children.length; i += 1) {
      names += children[i].firstName
      if (i === children.length - 2) {
        names += this.global.locale === 'en' ? ', and ' : ' y '
      }
      if (i < children.length - 2) {
        names += ', '
      }
    }
    return names
  }

  async submit() {
    // TODO: Move delete blanks into update user
    const attrs = deleteBlanks({
      physicianName: this.state.physicianName,
      physicianPhoneNumber: this.state.physicianPhoneNumber,
      needsPhysician: this.state.needsPhysician,
    })

    this.$f7.dialog.preloader(
      tr({ es: 'WelcomeChildPage.submitting_changes', en: 'Submitting changes...' }),
    )
    try {
      const user = await updateUser(this.child(), attrs as Partial<User>)
      this.$f7.dialog.close()

      if (this.hasNextChild()) {
        this.$f7router.navigate(dynamicPaths.welcomeChildIndexPath(this.childIndex() + 1))
      } else {
        this.$f7router.navigate(paths.welcomeSurveyPath)
      }
    } catch (error) {
      this.$f7.dialog.close()
      logger.error(error)
      this.$f7.dialog.alert(
        tr({ es: 'Algo salio mal', en: 'Something went wrong' }),
        tr({ es: 'Cambio fallido', en: 'Update Failed' }),
      )
    }
  }

  render() {
    const user = this.state.currentUser
    const child = this.child()

    return (
      <Page>
        <Navbar
          title={tr({ es: `Revisar ${child.firstName}'s Info`, en: `Review ${child.firstName}'s Info` })}
        />
        <Case test>
          {/* First Child */}
          <When value={user.sortedChildren()[0] === child}>
            <Block>
              <Tr>
                <En>
                  We've found {plural(user.children.length, { one: '# child', other: '# children' })}
                  associated with you: {this.childrenNames()}. Let's take a moment to review their information.
                </En>
                <Es>
                Hemos encontrado {plural(user.children.length, { one: '# niño', other: '# niños' })}
                asociados con usted: {this.childrenNames()}. Toma un momento para revisar su información.
                </Es>

              </Tr>
              <br />
            </Block>
          </When>
          {/* Last Child */}
          <When value={user.sortedChildren()[user.children.length - 1] === child}>
            <Block>
              <Tr>
                <En>
                  Finally, take a moment to review {child.firstName}'s information.
                </En>
                <Es>
                  Por último, dedique un momento a revisar la información de {child.firstName}
                </Es>
              </Tr>
            </Block>
          </When>
          <When value>
            <Block>
              <Tr>
                <En>
                  Take a moment to review {child.firstName}'s information.
                </En>
                <Es>
                  Tómate un momento para revisar la información de {child.firstName}.
                </Es>
              </Tr>
            </Block>
          </When>
        </Case>

        <List noHairlines>
          <ListItem
            footer={tr({
              es: `Revisa las escuelas a las que asistirá ${child.firstName}.`,
              en: `Review the schools ${child.firstName} will be attending.`,
            })}
          >
            <div slot="title">
              <b>
                <Tr>
                  <En>
                  {child.firstName}
                  's Schools and Places
                  </En>

                  <Es>
                    Escuelas y lugares de {child.firstName}
                  </Es>
                </Tr>
              </b>
            </div>
          </ListItem>
          {child.locations__HACK().map((location) => (
            <ListItem key={location.id} title={location.name || ''} />
          ))}
        </List>

        <Block>
          <Case test={this.hasNextChild()}>
            <When value>
              {/* TODO: FIXME DELAYED EVALUATION BUG */}
              {this.hasNextChild() && (
                <Button onClick={() => this.submit()} fill>
                  <Tr>
                    <En>
                      Continue to {this.nextChild()?.firstName}
                    </En>
                    <Es>
                      Continua a {this.nextChild()?.firstName}
                    </Es>
                  </Tr>
                </Button>
              )}
            </When>
            <When value={false}>
              <Button fill onClick={() => this.submit()}>
                <Tr en="Continue" es="Continuar" />
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
