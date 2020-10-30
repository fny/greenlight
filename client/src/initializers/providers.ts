import {
  getGlobal, setGlobal, addReducer,
} from 'reactn';
import { deleteSession, getCurrentUser } from 'src/api';
import { User } from 'src/models';
import { i18n, Locales } from 'src/i18n';
import Cookies from 'js-cookie';
import Honeybadger from './honeybadger';

setGlobal({
  locale: cookieLocale(),
  i18n,
  // This is used for testing reducers
  x: 0,
});

export function isSignedIn() {
  const user = currentUser();
  return user !== null && user !== undefined;
}

export function currentUser() {
  return getGlobal().currentUser;
}

export async function reloadCurrentUser(): Promise<User> {
  const user = await getCurrentUser();
  setGlobal({ currentUser: user });
  return user;
}

export async function signOut() {
  await deleteSession();
  Honeybadger.resetContext();
  setGlobal({ currentUser: null });
  (window.location as any) = '/';
}

export function toggleLocale() {
  const newLocale = cookieLocale() === 'en' ? 'es' : 'en';
  Cookies.set('_gl_locale', newLocale);
  setGlobal({ locale: newLocale });
  i18n.activate(newLocale);
  // window.location.reload();
}

export function cookieLocale(): Locales {
  const locale = Cookies.get('_gl_locale') || 'en';
  return locale as Locales;
}

i18n.activate(cookieLocale());

addReducer('increment', (global, dispatch, i = 0) => ({
  x: global.x + i,
}));

// TODO: This doesn't work
// const d = useDispatch('increment')
