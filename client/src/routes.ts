import NotFoundPage from 'src/pages/NotFoundPage'
import DashboardPage from 'src/pages/DashboardPage'

import SplashPage from 'src/pages/SplashPage'
import SignInPage from 'src/pages/SignInPage'
import MagicSignInPage from 'src/pages/MagicSignInPage'

import WelcomePage from 'src/pages/welcome/WelcomePage'
import WelcomeChildPage from 'src/pages/welcome/WelcomeChildPage'
import WelcomeReviewPage from 'src/pages/welcome/WelcomeReviewPage'
import WelcomePasswordPage from 'src/pages/welcome/WelcomePasswordPage'

import SurveyNewPage from 'src/pages/SurveyNewPage'
import SurveyThankYouPage from 'src/pages/SurveyThankYouPage'

import { getGlobal } from 'reactn'
import { User } from 'src/models'
import { Router } from 'framework7/modules/router/router'
import MagicSignInAuthPage from './pages/MagicSignInAuthPage'
import { resolvePath } from './util'
import GiphySchedulePage from './pages/GiphySchedulePage'
import UserGreenlightPassPage from './pages/UserGreenlightPassPage'
import DebugPage from './pages/DebugPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import WelcomeSurveyPage from './pages/welcome/WelcomeSurveyPage'
import { isSignedIn } from './initializers/providers'
import ReleaseNotesPage from './pages/ReleaseNotesPage'
import SettingsPage from './pages/SettingsPage'
// import MapPage from './pages/MapPage'
import AboutPage from './pages/AboutPage'
import EditUserPage from './pages/EditUserPage'

const beforeEnter = {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  requireSignIn(
    this: Router.Router,
    routeTo: Router.Route,
    routeFrom: Router.Route,
    resolve: Function,
    reject: Function,
  ) {
    if (isSignedIn()) {
      resolve()
    } else {
      resolve()

      this.navigate(paths.rootPath)
    }
  },
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  redirectHomeIfSignedIn(
    this: Router.Router,
    routeTo: Router.Route,
    routeFrom: Router.Route,
    resolve: Function,
    reject: Function,
  ) {
    if (isSignedIn()) {
      reject()
      this.navigate(dynamicPaths.currentUserHomePath())
    } else {
      resolve()
    }
  },
}

const routeMap = {
  rootPath: {
    path: '/',
    component: SplashPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  signInPath: {
    path: '/sign-in',
    component: SignInPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  magicSignInPath: {
    path: '/magic-sign-in',
    component: MagicSignInPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  magicSignInAuthPath: {
    path: '/mgk/:token/:remember',
    component: MagicSignInAuthPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  dashboardPath: {
    path: '/dashboard',
    component: DashboardPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  settingsPath: {
    path: '/settings',
    component: SettingsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  aboutPAth: {
    path: '/about',
    component: AboutPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  welcomePath: {
    path: '/welcome',
    component: WelcomePage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  welcomeReviewPath: {
    path: '/welcome/review',
    component: WelcomeReviewPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  welcomePasswordPath: {
    path: '/welcome/password',
    component: WelcomePasswordPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  welcomeSurveyPath: {
    path: '/welcome/survey',
    component: WelcomeSurveyPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  welcomeChildPath: {
    path: '/welcome/children/:id',
    component: WelcomeChildPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  userSurveysNewPath: {
    path: '/users/:userId/surveys/new',
    component: SurveyNewPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  userSeqSurveysNewPath: {
    path: '/users/seq/surveys/new',
    component: SurveyNewPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  surveysThankYouPath: {
    path: '/surveys/thank-you',
    component: SurveyThankYouPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  userGreenlightPassPath: {
    path: '/users/:userId/greenlight-pass',
    component: UserGreenlightPassPage,
  },
  adminUsersPath: {
    path: '/admin/locations/:locationId/users',
    component: AdminUsersPage,
  },
  giphySchedulePath: {
    path: '/giphy-schedule',
    component: GiphySchedulePage,
  },
  debugPath: {
    path: '/debug',
    component: DebugPage,
  },
  releasesPath: {
    path: '/releases',
    component: ReleaseNotesPage,
  },
  // mapPath: {
  //   path: '/map',
  //   component: MapPage,
  // },
  editUserPath: {
    path: '/users/:userId/edit',
    component: EditUserPage,
  },
  editChildrenPath: {
    path: '/users/:userId/children/:childId',
    component: EditUserPage,
  },
  notFoundPath: {
    path: '(.*)',
    component: NotFoundPage,
  },
}

type DynamicPath = (substitutions?: any, query?: any) => string

/**
 * Builds a callable path that will resolve itslev given substitutions.
 * @param path
 */
export function buildDynamicPath(path: string): DynamicPath {
  return (substitutions?: any, query?: any): string => resolvePath(path, substitutions, query)
}

export const paths = {} as { [k in keyof typeof routeMap]: string }
type PathsDynamized = {
  [k in keyof typeof routeMap]: (substitutions?: any, query?: any) => string
}
const pathsDynamized = {} as PathsDynamized

Object.keys(routeMap).forEach((key) => {
  const k = key as keyof typeof routeMap
  paths[k] = routeMap[k].path
  pathsDynamized[k] = buildDynamicPath(paths[k])
})

export const dynamicPaths = {
  currentUserHomePath: () => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    if (user.hasCompletedWelcome()) {
      return paths.dashboardPath
    }
    return paths.welcomePath
  },
  afterWelcomePasswordPath: () => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    if (user.hasChildren()) {
      return dynamicPaths.welcomeChildIndexPath(0)
    }
    return paths.welcomeSurveyPath
  },
  welcomeChildIndexPath: (index: number): string => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    const children = user.sortedChildren()
    if (index < children.length) {
      return dynamicPaths.welcomeChildPath(index)
    }
    return dynamicPaths.welcomeChildIndexPath(0)
  },
  userSurveysNewIndexPath: (index: number) => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    const people = [user, ...user.sortedChildren()]
    if (index < people.length) {
      return resolvePath(paths.userSurveysNewPath, [index])
    }
    return paths.surveysThankYouPath
  },
  ...pathsDynamized,
}

export default Object.values(routeMap)
