import { DateTime } from 'luxon'
import { currentUser } from 'src/initializers/providers'
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
GL.currentUser = currentUser

GL.CUTOFF_TIME = CUTOFF_TIME
GL.DateTime = DateTime

export default GL
