import MemorySource from '@orbit/memory'
import JSONAPISource from '@orbit/jsonapi'
import { ModelRegistry } from '../models/index'

const schema = ModelRegistry.orbitSchema()

export const memory = new MemorySource({ schema })

export const remote = new JSONAPISource({
  schema,
  name: "remote",
  host: "http://localhost:8000"
})


export function setAuthorizationToken(token: string) {
  (remote.defaultFetchHeaders as any).Authorization = `Bearer ${token}`
}
