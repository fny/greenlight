
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import SymptomSurveyPage from './pages/SymptomSurveyPage'
import ThankYouPage from './pages/SymptomSurveyCompletePage'
import SignInPage from './pages/SignInPage'
import MagicSignInPage from './pages/MagicSignInPage'
import RootPage from './pages/RootPage'
import RegistrationPage from './pages/RegistrationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PasswordResetPage from './pages/PasswordResetPage'

import WelcomeParentPage from './pages/WelcomeParentPage'
import WelcomeParentReviewChildPage from './pages/WelcomeParent/ReviewChildPage'
import WelcomeParentReviewUserPage from './pages/WelcomeParent/ReviewUserPage'
import WelcomeParentPasswordPage from './pages/WelcomeParent/PasswordPage'
import { Router } from 'framework7/modules/router/router'


import { session } from './common/api'
import { resolve } from 'dns'

type GLRoute = Router.RouteParameters & {
  unauthenticated?: boolean
}

export const paths = {
  rootPath: '/',
  signInPath: '/sign-in',
  magicSignInPath: '/magic-sign-in',
  registrationPath: '/join',
  dashboardPath: '/dashboard',
  passwordResetsPath: '/password-resets/:token',
  forgotPasswordPath: '/forgot-password',
  welcomePath: '/welcome',
  welcomeReviewPath: '/welcome/review',
  welcomePasswordPath: '/welcome/password',
  welcomeChildrenReviewPath: '/welcome/review/children/:id',
  userSurveysPath: '/users/:id/surveys/new',
  surveyThankYouPath: '/surveys/thank-you'
}

const routes: GLRoute[] = [
  {
    path: paths.rootPath,
    component: RootPage,
    unauthenticated: true
  },
  {
    path: paths.welcomePath,
    component: RootPage,
    unauthenticated: true
  },
  {
    path: paths.signInPath,
    component: SignInPage,
    unauthenticated: true
  },
  {
    path: paths.magicSignInPath,
    component: MagicSignInPage,
    unauthenticated: true
  },
  {
    path: paths.registrationPath,
    component: RegistrationPage,
  },
  {
    path: paths.dashboardPath,
    component: DashboardPage,
  },
  {
    path: paths.passwordResetsPath,
    component: PasswordResetPage,
  },
  {
    path: paths.forgotPasswordPath,
    component: ForgotPasswordPage,
  },
  {
    path: paths.welcomePath,
    component: WelcomeParentPage,
  },
  {
    path: paths.welcomeReviewPath,
    component: WelcomeParentReviewUserPage,
  },
  {
    path: paths.welcomePasswordPath,
    component: WelcomeParentPasswordPage,
  },
  {
    path: paths.welcomeChildrenReviewPath,
    component: WelcomeParentReviewChildPage,
  },
  {
    path: paths.userSurveysPath,
    component: SymptomSurveyPage,
  },
  {
    path: paths.surveyThankYouPath,
    component: ThankYouPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
    unauthenticated: true
  },
]

const f7routes = routes.map(route => {
    if (route.unauthenticated) {
      return route as Router.RouteParameters
    }
    route.on = {
      pageBeforeIn: (event, page) => {
        page.router.navigate(paths.signInPath)
      }
    }
    return route
})

export default f7routes
