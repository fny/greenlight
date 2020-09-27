import { dynamicPaths, paths } from "src/routes"
import * as api from "./api"
import { ModelRegistry } from "./models"
/**
 * Namespace on which to hang globals
 */

import { Dict } from "./types"

const GL: Dict<any> = {}

GL.locationId = '4b67c6e0-e07a-4fce-b72b-eecf82f5d697'
GL.ModelRegistry = ModelRegistry
GL.api = api
if (process.env.NODE_ENV !== "production") {
  (window as any).GL = GL
}

GL.paths = paths
GL.dynamicPaths = dynamicPaths



export default GL
