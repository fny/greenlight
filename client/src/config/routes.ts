import NotFoundPage from 'src/pages/util/NotFoundPage'
import DashboardPage from 'src/pages/DashboardPage'

import SplashPage from 'src/pages/SplashPage'
import SignInPage from 'src/pages/sessions/SignInPage'
import MagicSignInPage from 'src/pages/sessions/MagicSignInPage'

import WelcomePage from 'src/pages/welcome/WelcomePage'
import WelcomeChildPage from 'src/pages/welcome/WelcomeChildPage'
import WelcomeReviewPage from 'src/pages/welcome/WelcomeReviewPage'
import WelcomePasswordPage from 'src/pages/welcome/WelcomePasswordPage'

import SurveyNewPage from 'src/pages/surveys/SurveyNewPage'
import SurveyThankYouPage from 'src/pages/surveys/SurveyThankYouPage'

import { getGlobal } from 'reactn'
import { User } from 'src/models'
import { Router } from 'framework7/modules/router/router'
import MagicSignInAuthPage from 'src/pages/sessions/MagicSignInAuthPage'
import { resolvePath } from 'src/helpers/util'
import GiphySchedulePage from 'src/pages/util/GiphySchedulePage'
import UserGreenlightPassPage from 'src/pages/users/UserGreenlightPassPage'
import DebugPage from 'src/pages/util/DebugPage'
import AdminUsersPage from 'src/pages/admin/AdminUsersPage'
import WelcomeSurveyPage from 'src/pages/welcome/WelcomeSurveyPage'
import { isSignedIn } from 'src/initializers/providers'
import ReleaseNotesPage from 'src/pages/ReleaseNotesPage'
import SettingsPage from 'src/pages/users/SettingsPage'
import CovidCountyMapPage from 'src/pages/resources/CovidCountyMapPage'
import AboutPage from 'src/pages/AboutPage'
import UserEditPage from 'src/pages/users/UserEditPage'
import DukeScheduleTestPage from 'src/pages/resources/DukeScheduleTestPage'
import OpenSourceLicensesPage from 'src/pages/OpenSourceLicensesPage'
import NotificationsPage from 'src/pages/users/NotificationsPage'
import LocationPage from 'src/pages/locations/LocationPage'
import NCTestLocationsPage from 'src/pages/resources/NCTestLocationsPage'
import MobileVerificationPage from 'src/pages/MobileVerificationPage'
import NCStatewideStatsPage from 'src/pages/resources/NCStatewideStatsPage'
import LocationsNewPage from 'src/pages/registration/RegisterBusinessPage'
import UsersNewPage from 'src/pages/registration/RegisterUserPage'
import CHWRequestPage from 'src/pages/resources/CHWRequestPage'
import AdminUserPermissionsPage from 'src/pages/admin/AdminUserPermissionsPage'
import RegisterSchoolPage from 'src/pages/registration/RegisterSchoolPage'
import RegisterParentPage from 'src/pages/registration/RegisterUserPage'
import RegisterLocationWelcomePage from 'src/pages/registration/RegisterLocationWelcomePage'

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
    if (isSignedIn()) {
      reject()
      this.navigate(dynamicPaths.currentUserHomePath())
    } else {
      resolve()
    }
  },
}

const registrationRoutes = {
  registerLocationWelcomePath: {
    path: '/register/location-welcome',
    component: RegisterLocationWelcomePage,
  },
  durhamRegistationPath: {
    path: '/durham',
    component: LocationsNewPage,
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
    path: '/schedule-test-at-duke',
    component: DukeScheduleTestPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  ncStatewideStatsPath: {
    path: '/nc-statewide-stats',
    component: NCStatewideStatsPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  ncTestingLocationsPath: {
    path: '/nc-test-locations',
    component: NCTestLocationsPage,
    // beforeEnter: beforeEnter.requireSignIn,
  },
  chwRequestPath: {
    path: '/chw-request',
    component: CHWRequestPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  mapPath: {
    path: '/covid-county-map',
    component: CovidCountyMapPage,
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
    beforeEnter: beforeEnter.requireSignIn,
  },
  locationPath: {
    path: '/l/:locationId',
    component: LocationPage,
  },
  mobileVerificationPath: {
    path: '/mobile-verifications',
    component: MobileVerificationPage,
  },
  adminUsersPath: {
    path: '/admin/locations/:locationId/users',
    component: AdminUsersPage,
    beforeEnter: beforeEnter.requireSignIn,
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
  newUserPath: {
    path: '/users/new',
    component: UsersNewPage,
  },
  newLocationUserPath: {
    path: '/l/:permalink/code/:registrationCode',
    component: UsersNewPage,
  },
  userLocationPermissionsPath: {
    path: '/admin/locations/:locationId/users/:userId/permissions',
    component: AdminUserPermissionsPage,
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
