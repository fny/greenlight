
import NotFoundPage from 'src/pages/NotFoundPage'
import DashboardPage from 'src/pages/DashboardPage'


import SplashPage from 'src/pages/SplashPage'
import SignInPage from 'src/pages/SignInPage'
import MagicSignInPage from 'src/pages/MagicSignInPage'
import PasswordResetPage from 'src/pages/PasswordResetPage'

import WelcomePage from 'src/pages/welcome/WelcomePage'
import WelcomeChildPage from 'src/pages/welcome/WelcomeChildPage'
import WelcomeReviewPage from 'src/pages/welcome/WelcomeReviewPage'
import WelcomePasswordPage from 'src/pages/welcome/WelcomePasswordPage'

// TODO: Rename User survey
import SurveyNewPage from 'src/pages/SurveyNewPage'
import SurveyThankYouPage from 'src/pages/SurveyThankYouPage'


// import { isSignedIn } from 'src/common/api'
import { getGlobal } from 'reactn'
import { User } from 'src/common/models'
import MagicSignInAuthPage from './pages/MagicSignInAuthPage'
import { buildDynamicPath, resolvePath } from './util'
import GiphysPage from './pages/GiphysPage'
import UserGreenlightPassPage from './pages/UserGreenlightPassPage'
import DebugPage from './pages/DebugPage'

export const paths = {
rootPath: '/',
  signInPath: '/sign-in',
  magicSignInPath: '/magic-sign-in',
  magicSignInAuthPath: '/mgk/:token/:remember',
  dashboardPath: '/dashboard',
  passwordResetPath: '/password-resets/:token',
  passwordResetsNewPath: '/password-resets/new',
  welcomePath: '/welcome',
  welcomeReviewPath: '/welcome/review',
  welcomePasswordPath: '/welcome/password',
  welcomeChildPath: '/welcome/children/:id',
  userSurveysNewPath: '/users/:id/surveys/new',
  userGreenlightPassPath: '/users/:userId/greenlight-pass',
  surveysThankYouPath: '/surveys/thank-you/:status'
}

type PathsDynamized = {
  [k in (keyof typeof paths)]: (substitutions?: any, query?: any) => string
}

const pathsDynamized = {} as PathsDynamized

Object.keys(paths).map((key) => {
  const k = key as keyof typeof paths
  pathsDynamized[k] = buildDynamicPath(paths[k])
})

export const dynamicPaths = {
  currentUserHomePath: () => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    if (user.hasCompletedWelcome()) {
      return paths.dashboardPath
    } else {
      return paths.welcomePath
    }
  },
  afterWelcomePasswordPath: () => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    if (user.hasChildren()) {
      return dynamicPaths.welcomeChildIndexPath(0)
    } else {
      return dynamicPaths.userSurveysNewIndexPath(0)
    }
  },
  welcomeChildIndexPath: (index: number): string => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    const children = user.sortedChildren()
    if (index < children.length) {
      return dynamicPaths.welcomeChildPath(index)
    } else {
      return dynamicPaths.welcomeChildIndexPath(0)
    }
  },
  userSurveysNewIndexPath: (index: number) => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    const people = [user, ...user.sortedChildren()]
    if (index < people.length) {
      return resolvePath(paths.userSurveysNewPath, [ index ])
    } else {
      return paths.surveysThankYouPath
    }
  },
  ...pathsDynamized
}

// const beforeEnter = {
//   requireSignIn: function(this: Router.Router, routeTo: Router.Route, routeFrom: Router.Route, resolve: Function, reject: Function) {
//     resolve()
//     return
//     // if (isSignedIn()) {
//     //   resolve()
//     // } else {
//     //   reject()
//     //   this.navigate(paths.rootPath)
//     // }
//   },
//   redirectHomeIfSignedIn: function(this: Router.Router, routeTo: Router.Route, routeFrom: Router.Route, resolve: Function, reject: Function) {
//     resolve()
//     return
//     // if (isSignedIn()) {
//     //   reject()
//     //   this.navigate(dynamicPaths.userHomePath())
//     // } else {
//     //   resolve()
//     // }
//   }
// }


const routes = [
  {
    path: paths.rootPath,
    component: SplashPage,
    // beforeEnter: beforeEnter.redirectHomeIfSignedIn
  },
  {
    path: paths.welcomePath,
    component: WelcomePage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.signInPath,
    component: SignInPage,
    // beforeEnter: beforeEnter.redirectHomeIfSignedIn
  },
  {
    path: paths.magicSignInPath,
    component: MagicSignInPage,
    // beforeEnter: beforeEnter.redirectHomeIfSignedIn
  },
  {
    path: paths.dashboardPath,
    component: DashboardPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.passwordResetsNewPath,
    component: PasswordResetPage
  },
  {
    path: paths.magicSignInAuthPath,
    component: MagicSignInAuthPage
  },
  {
    path: paths.welcomePath,
    component: WelcomePage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.welcomeReviewPath,
    component: WelcomeReviewPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.welcomePasswordPath,
    component: WelcomePasswordPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.welcomeChildPath,
    component: WelcomeChildPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.userSurveysNewPath,
    component: SurveyNewPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.surveysThankYouPath,
    component: SurveyThankYouPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.userGreenlightPassPath,
    component: UserGreenlightPassPage
  },
  {
    path: '/giphys-on-deck',
    component: GiphysPage
  },
  {
    path: '/debug',
    component: DebugPage
  },
  {
    path: '(.*)',
    component: NotFoundPage
  },
]

export default routes
