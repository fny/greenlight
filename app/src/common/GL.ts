import { DateTime } from 'luxon'
import { dynamicPaths, paths } from 'src/routes'
import * as api from './api'
import { ModelRegistry } from './models'
import { CUTOFF_TIME } from './models/GreenlightStatus'
import { Dict } from './types'

/**
 * Namespace on which to hang globals
 * for debugging.
 */
const GL: Dict<any> = {}

GL.ModelRegistry = ModelRegistry
GL.api = api
GL.currentUser = api.currentUser

GL.paths = paths
GL.dynamicPaths = dynamicPaths

GL.CUTOFF_TIME = CUTOFF_TIME
GL.DateTime = DateTime


if (process.env.NODE_ENV !== 'production') {
  (window as any).GL = GL
}
export default GL
