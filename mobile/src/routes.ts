
import NotFoundPage from 'src/pages/NotFoundPage'
// import DashboardPage from 'src/pages/DashboardPage'
import SymptomSurveyPage from 'src/pages/SymptomSurveyPage'
import ThankYouPage from 'src/pages/SymptomSurveyCompletePage'
import SignInPage from 'src/pages/SignInPage'
import MagicSignInPage from 'src/pages/MagicSignInPage'
import SplashPage from 'src/pages/SplashPage'
import PasswordResetPage from 'src/pages/PasswordResetPage'

import WelcomePage from 'src/pages/welcome/WelcomePage'
import WelcomeChildPage from 'src/pages/welcome/WelcomeChildPage'
import WelcomeReviewPage from 'src/pages/welcome/WelcomeReviewPage'
import WelcomePasswordPage from 'src/pages/welcome/WelcomePasswordPage'
import { Router } from 'framework7/modules/router/router'

// import { isSignedIn } from 'src/common/api'
// import { getGlobal } from 'reactn'
// import { User } from 'src/common/models'

export const paths = {
  rootPath: '/',
  signInPath: '/sign-in',
  magicSignInPath: '/magic-sign-in',
  dashboardPath: '/dashboard',
  passwordResetPath: '/password-resets/:token',
  passwordResetsNewPath: '/password-resets/new',
  welcomePath: '/welcome',
  welcomeReviewPath: '/welcome/review',
  welcomePasswordPath: '/welcome/password',
  welcomeChildPath: '/welcome/children/:id',
  userSurveysNewPath: '/users/:id/surveys/new',
  surveyThankYouPath: '/surveys/thank-you'
}

// export const dynamicPaths = {
//   userHomePath: () => {
//     const user: User | null | undefined = getGlobal().currentUser
//     if (user === null || user === undefined) return paths.rootPath
//     if (user.hasCompletedWelcome()) {
//       return paths.dashboardPath
//     } else {
//       return paths.welcomePath
//     }
//   }
// }

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
  // {
  //   path: paths.dashboardPath,
  //   component: DashboardPage,
  //   // beforeEnter: beforeEnter.requireSignIn
  // },
  {
    path: paths.passwordResetsNewPath,
    component: PasswordResetPage
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
    component: SymptomSurveyPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: paths.surveyThankYouPath,
    component: ThankYouPage,
    // beforeEnter: beforeEnter.requireSignIn
  },
  {
    path: '(.*)',
    component: NotFoundPage
  },
]

export default routes
