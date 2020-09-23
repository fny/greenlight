import { ModelRegistry } from "./models";
/**
 * Namespace on which to hang globals
 */

import { ObjectMap } from "./types";

const GL: ObjectMap<any> = {}

GL.locationId = '4b67c6e0-e07a-4fce-b72b-eecf82f5d697'
GL.ModelRegistry = ModelRegistry

if (process.env.NODE_ENV !== "production") {
  ;(window as any).GL = GL
}

export default GL