import Honeybadger from './honeybadger'
import { dynamicPaths, paths } from 'src/routes'
import { myI18n } from 'src/i18n'
import { DateTime } from 'luxon'
import { currentUser } from 'src/initializers/providers'
import * as api from 'src/api'
import { ModelRegistry } from 'src/models'
import { CUTOFF_TIME } from 'src/models/GreenlightStatus'
import { Dict } from 'src/types'

/**
 * Namespace on which to hang globals
 * for debugging.
 */
const GL: Dict<any> = {}

GL.ModelRegistry = ModelRegistry
GL.api = api
GL.currentUser = currentUser

GL.CUTOFF_TIME = CUTOFF_TIME
GL.DateTime = DateTime

export default GL


GL.dynamicPaths = dynamicPaths
GL.paths = paths
GL.Honeybadger = Honeybadger

GL.i18n = myI18n


;(window as any).GL = GL
