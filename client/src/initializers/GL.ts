import { dynamicPaths, paths } from 'src/config/routes'
import { DateTime } from 'luxon'
import { currentUser } from 'src/helpers/global'
import * as api from 'src/api'
import { ModelRegistry } from 'src/models'
import { CUTOFF_TIME } from 'src/models/GreenlightStatus'
import { Dict } from 'src/types'
import CookieJar from 'src/helpers/CookieJar'
import { f7ready } from 'framework7-react'
import { getGlobal } from 'reactn'
import Honeybadger from './honeybadger'
/**
 * Namespace on which to hang globals for debugging.
 */
const GL: Dict<any> = {}

GL.ModelRegistry = ModelRegistry
GL.api = api
GL.currentUser = currentUser

GL.CUTOFF_TIME = CUTOFF_TIME
GL.DateTime = DateTime

GL.dynamicPaths = dynamicPaths
GL.paths = paths
GL.Honeybadger = Honeybadger

GL.CookieJar = CookieJar

GL.getGlobal = getGlobal

f7ready((f7) => {
  GL.f7 = f7
})

export default GL;
(window as any).GL = GL
