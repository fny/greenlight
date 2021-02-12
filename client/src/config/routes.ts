import { getGlobal } from 'reactn'
import { isRegisteringLocation, isSignedIn } from 'src/helpers/global'
import { resolvePath } from 'src/helpers/util'
import { Router } from 'framework7/modules/router/router'
import { User } from 'src/models'
import AboutPage from 'src/pages/AboutPage'
import AdminUserPermissionsPage from 'src/pages/admin/AdminUserPermissionsPage'
import AdminUsersPage from 'src/pages/admin/AdminUsersPage'
import CHWRequestPage from 'src/pages/resources/CHWRequestPage'
import CovidCountyMapPage from 'src/pages/resources/CovidCountyMapPage'
import DashboardPage from 'src/pages/DashboardPage'
import DebugPage from 'src/pages/util/DebugPage'
import DukeScheduleTestPage from 'src/pages/resources/DukeScheduleTestPage'
import GiphySchedulePage from 'src/pages/util/GiphySchedulePage'
import LocationPage from 'src/pages/locations/LocationPage'
import MagicSignInAuthPage from 'src/pages/sessions/MagicSignInAuthPage'
import MagicSignInPage from 'src/pages/sessions/MagicSignInPage'
import MobileVerificationPage from 'src/pages/MobileVerificationPage'
import NCStatewideStatsPage from 'src/pages/resources/NCStatewideStatsPage'
import CastlightTestSearchPage from 'src/pages/resources/CastlightTestSearchPage'
import NotFoundPage from 'src/pages/util/NotFoundPage'
import NotificationsPage from 'src/pages/users/NotificationsPage'
import OpenSourceLicensesPage from 'src/pages/OpenSourceLicensesPage'
import PasswordResetPage from 'src/pages/sessions/PasswordResetPage'
import PasswordResetRequestPage from 'src/pages/sessions/PasswordResetRequestPage'
import RegisterLocationConfirmationPage from 'src/pages/register-location/RegisterLocationConfirmationPage'
import RegisterLocationDetailsPage from 'src/pages/register-location/RegisterLocationDetailsPage'
import RegisterLocationMessagePage from 'src/pages/register-location/RegisterLocationMessagePage'
import RegisterLocationOwnerPage from 'src/pages/register-location/RegisterLocationOwnerPage'
import RegisterLocationWelcomePage from 'src/pages/register-location/RegisterLocationWelcomePage'
import ReleaseNotesPage from 'src/pages/ReleaseNotesPage'
import SettingsPage from 'src/pages/users/SettingsPage'
import SignInPage from 'src/pages/sessions/SignInPage'
import SplashPage from 'src/pages/SplashPage'
import SurveyNewPage from 'src/pages/surveys/SurveyNewPage'
import SurveyThankYouPage from 'src/pages/surveys/SurveyThankYouPage'
import UserEditPage from 'src/pages/users/UserEditPage'
import UserGreenlightPassPage from 'src/pages/users/UserGreenlightPassPage'
import UserLocationPage from 'src/pages/user-locations/UserLocationPage'
import RegisterUserPage from 'src/pages/register-user/RegisterUserPage'
import WelcomeChildPage from 'src/pages/welcome/WelcomeChildPage'
import WelcomePage from 'src/pages/welcome/WelcomePage'
import WelcomePasswordPage from 'src/pages/welcome/WelcomePasswordPage'
import WelcomeReviewPage from 'src/pages/welcome/WelcomeReviewPage'
import WelcomeSurveyPage from 'src/pages/welcome/WelcomeSurveyPage'
import BrevardResourcesPage from 'src/pages/resources/BrevardResourcesPage'
import AdminUserPage from 'src/pages/admin/AdminUserPage'
import HelpScoutPage from 'src/pages/resources/HelpScoutPage'
import PositiveResourcesPage from 'src/pages/resources/PositiveResourcesPage'
import AdminDashboardPage from 'src/pages/admin/AdminDashboardPage'
import SchoolScoreCardPage from 'src/pages/resources/SchoolScoreCardPage'
import LocationLookupPage from 'src/pages/locations/LocationLookupPage'

import RegisterLocationIntroductionPage from 'src/pages/register-location/RegisterLocationIntroductionPage'
import PageWithRequest from 'src/pages/util/PageWithRequest'
import RegisterChildrenPage from 'src/pages/register-user/RegisterChildrenPage'
import LocationLookupAccountPage from 'src/pages/locations/LocationLookupAccountPage'
import LocationLookupRegistrationCodePage from 'src/pages/locations/LocationLookupRegistrationCodePage'
import LocationCheckRegistrationCodePage from 'src/pages/locations/LocationCheckRegistrationCodePage'
import MentalHealthResourcesPage from 'src/pages/resources/MentalHealthResourcesPage'
import AdminEditGreenlightPassPage from 'src/pages/admin/AdminEditGreenlightPassPage'
import { before } from 'lodash'
import ParentsPage from 'src/pages/admin/ParentsPage'
import EditParentPage from 'src/pages/admin/EditParentPage'
import OtherParentsPage from 'src/pages/users/OtherParentsPage'
import EditOtherParentPage from 'src/pages/users/EditOtherParentPage'

const beforeEnter = {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  requireSignIn(
    this: Router.Router,
    routeTo: Router.Route,
    routeFrom: Router.Route,
    resolve: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (isRegisteringLocation()) {
      resolve()
    } else if (isSignedIn()) {
      reject()
      this.navigate(dynamicPaths.currentUserHomePath())
    } else {
      resolve()
    }
  },

  /**
   * Makes a beforeEnter function that redirects to a provided path if the user
   * @param path the path to redirect to
   */
  ifSignedInRedirectTo(path: string) {
    // eslint-disable-next-line func-names
    return function (
      this: Router.Router,
      routeTo: Router.Route,
      routeFrom: Router.Route,
      resolve: Function,
      reject: Function,
    ) {
      if (isSignedIn()) {
        reject()
        this.navigate(path)
      } else {
        resolve()
      }
    }
  },
}

// TODO: These are paths that are used in a self referential fashion. For example,
// they might show up in the routeMap but then they're also used in a beforeEnter
// callback. We use keep this here to maintain some type safety. However,
// we need to figure out how to eliminate these.
const circularPaths = {
  registerLocationDetailsPath: '/register/location/details',
}

const registrationRoutes = {
  registerLocationWelcomePath: {
    path: '/register/location/welcome',
    component: RegisterLocationWelcomePage,
  },
  registerLocationIntroductionPath: {
    path: '/register/location/introduction',
    component: RegisterLocationIntroductionPage,
  },
  registerLocationMessagePath: {
    path: '/register/location/message',
    component: RegisterLocationMessagePage,
  },
  registerLocationOwnerPath: {
    path: '/register/location/owner',
    component: RegisterLocationOwnerPage,
  },
  registerLocationDetailsPath: {
    path: circularPaths.registerLocationDetailsPath,
    component: RegisterLocationDetailsPage,
  },
  registerLocationConfirmationPath: {
    path: '/register/location/:locationId/confirmation',
    component: RegisterLocationConfirmationPage,
  },
  durhamRegistationPath: {
    path: '/durham',
    component: RegisterLocationWelcomePage,
  },
}

const welcomeRoutes = {
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
}

const sessionRoutes = {
  signInPath: {
    path: '/sign-in',
    component: SignInPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  passwordResetRequestPath: {
    path: '/forgot-password',
    component: PasswordResetRequestPage,
  },
  passwordResetPath: {
    path: '/pwdrst/:token',
    component: PasswordResetPage,
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
}

const resourcesRoutes = {
  dukeScheduleTestPath: {
    path: '/resources/duke-testing',
    component: DukeScheduleTestPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  brevardPath: {
    path: '/resources/brevard',
    component: BrevardResourcesPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  ncStatewideStatsPath: {
    path: '/nc-statewide-stats',
    component: NCStatewideStatsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  testSearchPath: {
    path: '/resources/test-search',
    component: CastlightTestSearchPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  helpScoutPath: {
    path: '/support',
    component: HelpScoutPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  chwRequestPath: {
    path: '/resources/chw-request',
    component: CHWRequestPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  mapPath: {
    path: '/covid-county-map',
    component: CovidCountyMapPage,
  },
  positiveResourcesPath: {
    path: '/resources/positive-help',
    component: PositiveResourcesPage,
  },
  schoolScoreCardPath: {
    path: '/resources/score-card',
    component: SchoolScoreCardPage,
  },
  mentalHealthPath: {
    path: '/resources/mental-health',
    component: MentalHealthResourcesPage,
  },
}

const adminRoutes = {
  adminUsersPath: {
    path: '/admin/locations/:locationId/users',
    component: AdminUsersPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  adminUserPath: {
    path: '/admin/locations/:locationId/users/:userId',
    component: AdminUserPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  adminDashboardPath: {
    path: '/admin/locations/:locationId/dashboard',
    component: AdminDashboardPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  adminEditGreenlightPassPath: {
    path: '/admin/users/:userId/greenlight-pass/edit',
    component: AdminEditGreenlightPassPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
}

const locationRoutes = {
  locationPath: {
    path: '/go/:locationId',
    component: LocationPage,
  },
  oldLocationPath: {
    path: '/l/:locationId',
    component: LocationPage,
  },
  locationLookupPath: {
    path: '/location/lookup',
    component: LocationLookupPage,
  },
  locationLookupAccountPath: {
    path: '/go/:locationId/lookup-account',
    component: LocationLookupAccountPage,
  },
  locationLookupRegistrationCodePath: {
    path: '/go/:locationId/registration-code',
    component: LocationLookupRegistrationCodePage,
  },
  // !TODO: need to make this link to go to another page where we check registration code and redirect to RegisterUserPage if it's valid.
  locationCheckRegistrationCodePath: {
    path: '/go/:locationId/code/:registrationCode',
    component: LocationCheckRegistrationCodePage,
  },
  registerUserPath: {
    path: '/go/:locationId/register/user',
    component: RegisterUserPage,
  },
  registerChildrenPath: {
    path: '/go/:locationId/register/children',
    component: RegisterChildrenPage,
  },
}

const surveyRoutes = {
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
}

const userRoutes = {
  userGreenlightPassPath: {
    path: '/users/:userId/greenlight-pass',
    component: UserGreenlightPassPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  userLocationPath: {
    path: '/users/:userId/locations/:locationId',
    component: UserLocationPage,
    beforeEnter: beforeEnter.requireSignIn,
  },

  editUserPath: {
    path: '/users/:userId/edit',
    component: UserEditPage,
  },
  editChildrenPath: {
    path: '/users/:userId/children/:childId',
    component: UserEditPage,
  },
}

const parentRoutes = {
  // edit other parents for a parent
  otherParents: {
    path: '/users/:userId/other-parents',
    component: OtherParentsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  editOtherParent: {
    path: '/users/:userId/other-parents/:parentId',
    component: EditOtherParentPage,
    beforeEnter: beforeEnter.requireSignIn,
  },

  // edit Parent
  parents: {
    path: '/users/:userId/parents',
    component: ParentsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  editParent: {
    path: '/users/:userId/parents/:parentId',
    component: EditParentPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
}

const routeMap = {
  rootPath: {
    path: '/',
    component: SplashPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  ...sessionRoutes,
  ...welcomeRoutes,
  ...resourcesRoutes,
  ...registrationRoutes,
  ...adminRoutes,
  ...locationRoutes,
  ...surveyRoutes,
  ...userRoutes,
  ...parentRoutes,
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
  aboutPath: {
    path: '/about',
    component: AboutPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  notificationsPath: {
    path: '/notifications',
    component: NotificationsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  splashPath: {
    path: '/splash',
    component: SplashPage,
  },
  mobileVerificationPath: {
    path: '/mobile-verifications',
    component: MobileVerificationPage,
  },
  debugPath: {
    path: '/debug',
    component: DebugPage,
  },
  giphySchedulePath: {
    path: '/giphy-schedule',
    component: GiphySchedulePage,
  },
  releasesPath: {
    path: '/releases',
    component: ReleaseNotesPage,
  },
  openSourcePath: {
    path: '/open-source',
    component: OpenSourceLicensesPage,
  },
  userLocationPermissionsPath: {
    path: '/admin/locations/:locationId/users/:userId/permissions',
    component: AdminUserPermissionsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  testPath: {
    path: '/test',
    component: PageWithRequest,
  },
  notFoundPath: {
    path: '/not-found',
    component: NotFoundPage,
  },
  catchAllPath: {
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
  currentUserHomePath: (): string => {
    const user: User | null | undefined = getGlobal().currentUser
    if (!user) return paths.rootPath
    if (user.hasCompletedWelcome()) {
      return paths.dashboardPath
    }
    return paths.welcomePath
  },
  afterWelcomePasswordPath: (): string => {
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
  userSurveysNewIndexPath: (index: number): string => {
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
