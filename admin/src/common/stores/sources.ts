import JSONAPISource from '@orbit/jsonapi'

import { ModelRegistry } from '../models/index'

const schema = ModelRegistry.orbitSchema()

const remote = new JSONAPISource({
  schema,
  name: "remote",
  host: "http://localhost:3000/api/v1"
})

export const store = remote