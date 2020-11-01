import NotFoundPage from 'src/pages/NotFoundPage';
import DashboardPage from 'src/pages/DashboardPage';

import SplashPage from 'src/pages/SplashPage';
import SignInPage from 'src/pages/SignInPage';
import MagicSignInPage from 'src/pages/MagicSignInPage';

import WelcomePage from 'src/pages/welcome/WelcomePage';
import WelcomeChildPage from 'src/pages/welcome/WelcomeChildPage';
import WelcomeReviewPage from 'src/pages/welcome/WelcomeReviewPage';
import WelcomePasswordPage from 'src/pages/welcome/WelcomePasswordPage';

import SurveyNewPage from 'src/pages/SurveyNewPage';
import SurveyThankYouPage from 'src/pages/SurveyThankYouPage';

import { getGlobal } from 'reactn';
import { User } from 'src/models';
import { Router } from 'framework7/modules/router/router';
import MagicSignInAuthPage from './pages/MagicSignInAuthPage';
import { resolvePath } from './util';
import GiphySchedulePage from './pages/GiphySchedulePage';
import UserGreenlightPassPage from './pages/UserGreenlightPassPage';
import DebugPage from './pages/DebugPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import WelcomeSurveyPage from './pages/welcome/WelcomeSurveyPage';
import { isSignedIn } from './initializers/providers';

export const paths = {
  rootPath: '/',
  signInPath: '/sign-in',
  magicSignInPath: '/magic-sign-in',
  magicSignInAuthPath: '/mgk/:token/:remember',
  dashboardPath: '/dashboard',
  welcomePath: '/welcome',
  welcomeReviewPath: '/welcome/review',
  welcomePasswordPath: '/welcome/password',
  welcomeSurveyPath: '/welcome/survey',
  welcomeChildPath: '/welcome/children/:id',
  userSurveysNewPath: '/users/:userId/surveys/new',
  userSeqSurveysNewPath: '/users/seq/surveys/new',
  userGreenlightPassPath: '/users/:userId/greenlight-pass',
  surveysThankYouPath: '/surveys/thank-you',
  // TODO naming
  adminUsersPath: '/admin/locations/:locationId/users',
};

type PathsDynamized = {
  [k in keyof typeof paths]: (substitutions?: any, query?: any) => string
};

const pathsDynamized = {} as PathsDynamized;

Object.keys(paths).forEach((key) => {
  const k = key as keyof typeof paths;
  pathsDynamized[k] = buildDynamicPath(paths[k]);
});

type DynamicPath = (substitutions?: any, query?: any) => string;

/**
 * Builds a callable path that will resolve itslev given substitutions.
 * @param path
 */
export function buildDynamicPath(path: string): DynamicPath {
  return (substitutions?: any, query?: any): string => resolvePath(path, substitutions, query);
}

export const dynamicPaths = {
  currentUserHomePath: () => {
    const user: User | null | undefined = getGlobal().currentUser;
    if (!user) return paths.rootPath;
    if (user.hasCompletedWelcome()) {
      return paths.dashboardPath;
    }
    return paths.welcomePath;
  },
  afterWelcomePasswordPath: () => {
    const user: User | null | undefined = getGlobal().currentUser;
    if (!user) return paths.rootPath;
    if (user.hasChildren()) {
      return dynamicPaths.welcomeChildIndexPath(0);
    }
    return paths.welcomeSurveyPath;
  },
  welcomeChildIndexPath: (index: number): string => {
    const user: User | null | undefined = getGlobal().currentUser;
    if (!user) return paths.rootPath;
    const children = user.sortedChildren();
    if (index < children.length) {
      return dynamicPaths.welcomeChildPath(index);
    }
    return dynamicPaths.welcomeChildIndexPath(0);
  },
  userSurveysNewIndexPath: (index: number) => {
    const user: User | null | undefined = getGlobal().currentUser;
    if (!user) return paths.rootPath;
    const people = [user, ...user.sortedChildren()];
    if (index < people.length) {
      return resolvePath(paths.userSurveysNewPath, [index]);
    }
    return paths.surveysThankYouPath;
  },
  ...pathsDynamized,
};

const beforeEnter = {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  requireSignIn(this: Router.Router, routeTo: Router.Route, routeFrom: Router.Route, resolve: Function, reject: Function) {
    if (isSignedIn()) {
      resolve();
    } else {
      resolve();

      this.navigate(paths.rootPath);
    }
  },
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  redirectHomeIfSignedIn(this: Router.Router, routeTo: Router.Route, routeFrom: Router.Route, resolve: Function, reject: Function) {
    if (isSignedIn()) {
      reject();
      this.navigate(dynamicPaths.currentUserHomePath());
    } else {
      resolve();
    }
  },
};

const routes = [
  {
    path: paths.rootPath,
    component: SplashPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  {
    path: paths.welcomePath,
    component: WelcomePage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.signInPath,
    component: SignInPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  {
    path: paths.magicSignInPath,
    component: MagicSignInPage,
    beforeEnter: beforeEnter.redirectHomeIfSignedIn,
  },
  {
    path: paths.dashboardPath,
    component: DashboardPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.magicSignInAuthPath,
    component: MagicSignInAuthPage,
  },
  {
    path: paths.welcomePath,
    component: WelcomePage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.welcomeReviewPath,
    component: WelcomeReviewPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.welcomePasswordPath,
    component: WelcomePasswordPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.welcomeSurveyPath,
    component: WelcomeSurveyPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.welcomeChildPath,
    component: WelcomeChildPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.userSurveysNewPath,
    component: SurveyNewPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.surveysThankYouPath,
    component: SurveyThankYouPage,
    beforeEnter: beforeEnter.requireSignIn,
  },
  {
    path: paths.userGreenlightPassPath,
    component: UserGreenlightPassPage,
  },
  {
    path: paths.adminUsersPath,
    component: AdminUsersPage,
  },
  {
    path: '/giphy-schedule',
    component: GiphySchedulePage,
  },
  {
    path: '/debug',
    component: DebugPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;