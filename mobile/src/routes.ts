
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import SymptomSurveyPage from './pages/SymptomSurveyPage'
import ThankYouPage from './pages/SymptomSurveyCompletePage'
import SignInPage from './pages/SignInPage'
import MagicSignInPage from './pages/MagicSignInPage'
import SplashPage from './pages/SplashPage'
import RegistrationPage from './pages/RegistrationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PasswordResetPage from './pages/PasswordResetPage'

import WelcomeParentPage from './pages/WelcomeParentPage'
import WelcomeParentReviewChildPage from './pages/WelcomeParent/ReviewChildPage'
import WelcomeParentReviewUserPage from './pages/WelcomeParent/ReviewUserPage'
import WelcomeParentPasswordPage from './pages/WelcomeParent/PasswordPage'

export default [
  {
    path: '/',
    component: SplashPage,
  },
  {
    path: '/sign-in',
    component: SignInPage,
  },
  {
    path: '/magic-sign-in',
    component: MagicSignInPage,
  },
  {
    path: '/join',
    component: RegistrationPage,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
  },
  {
    path: '/password-resets/:token',
    component: PasswordResetPage,
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
  },
  {
    path: '/welcome-parent',
    component: WelcomeParentPage,
  },
  {
    path: '/welcome-parent/review',
    component: WelcomeParentReviewUserPage,
  },
  {
    path: '/welcome-parent/password',
    component: WelcomeParentPasswordPage,
  },
  {
    path: '/welcome-parent/children/:id',
    component: WelcomeParentReviewChildPage,
  },
  {
    path: '/welcome-parent/surveys/children/:id',
    component: SymptomSurveyPage,
  },
  {
    path: '/welcome-parent/thank-you',
    component: ThankYouPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
]
