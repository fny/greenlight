import { remote } from './stores/sources'
import * as fetch from 'node-fetch'
import Orbit from '@orbit/data';

(Orbit as any).fetch = fetch

// remote.query(q => q.findRecord({ type: 'user', id: 'marge' }), {
//   label: "Find all contacts",
//   sources: {
//     remote: {
//       include: ["parents", "children", "locations"]
//     }
//   }
// }).then(console.log).catch(console.error)

import * as fixtures from './fixtures'

const marge = fixtures.find('users', 'marge').data(['children', 'parents'])

debug(fixtures.findRelationships(marge))


function get(model: string, id: string, include: string[] = []) {
  const data = fixtures.find(model, id).data(include)
  const included = fixtures.findRelationships(data)
  return {
    data,
    included
  }
}

function getAll(model: string, include: string[] = []) {
  const data = fixtures.all(model).map(f => f.data(include))
  const included = data.map(d => fixtures.findRelationships(d)).flat()
  return {
    data,
    included
  }
}

function debug(data: any) {
  console.log(JSON.stringify(data, null, '  '))
}

debug(get('users', 'marge', ['children', 'parents']))

debug(getAll('users', ['children', 'parents']))
