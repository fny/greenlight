import { Location, User } from "../models";
import { SortSpecifier, FilterSpecifier, PageSpecifier } from '@orbit/data'

import { store } from './sources'
import { deserializeJSONAPI } from "../models/model";
import { JSONAPIDocument, Resource } from "@orbit/jsonapi";

interface Query {
  sort?: SortSpecifier[];
  filter?: FilterSpecifier[];
  page?: PageSpecifier;
}


//
// Location
//

export function findLocation(id: string) {
  return store.query(q => q.findRecord({ type: 'location', id }))
}

export function updateLocation(location: Location) {
  return store.update(t => t.updateRecord(location.serialize()))
}

// export async function findUsersForLocation(location: string | Location, query?: Query) {
//   const records = await store.query(q =>
//     q.findRelatedRecords({ type: "location", id: typeof location === 'string' ? location : location.id }, 'users'),
//     { 
//       sources: {
//         remote: { include: ['locationAccounts'] }
//       }
//     }
//   )
//   const users: User[] = records.map((r: Resource) => deserializeJSONAPI(r))
//   return users
// }

//
// Users
//

export function createUser(user: User) {
  return store.update(t => t.addRecord(user.serialize()))
}

export function updateUser(user: User) {
  return store.update(t => t.updateRecord(user.serialize()))
}

export function deleteUser(user: User) {
  return store.update(t => t.removeRecord(user.serialize()))
}

export function findUser(id: string) {
  return store.query(q => q.findRecord({ type: 'user', id }))
}

export function findParentsForUser(user: User) {
  store.query(q =>
    q.findRelatedRecords({ type: "user", id: user.id }, 'parents')
  )
}

export function findGreenlightStatusesForUser(user: User) {
  store.query(q =>
    q.findRelatedRecords({ type: "user", id: user.id }, 'greenlightStatsuses')
  )
}

export function findLocationAccountsForUser(user: User) {
  store.query(q =>
    q.findRelatedRecords({ type: 'user', id: user.id }, 'locationAccounts')
  )
}

// https://www.bignerdranch.com/blog/react-data-layer-part-8-where-to-go-from-here/
