import GL from '../GL'
import axios, { AxiosResponse } from 'axios'
import { ObjectMap, Record, RecordDocument } from '../types'
import { Location, User, Model } from '../models'
import { deserializeJSONAPI } from '../models/model'
import { RecordRelationship } from '@orbit/data'

class RecordStore {
  store: ObjectMap<Record>
  constructor() {
    this.store = {} 
  }

  find(id: string): Record | undefined {
    return this.store[id]
  }

  findAll(ids: string[]) {
    return ids.map(id => this.find(id))
  }
  
  findEntity<T extends Model>(id: string): T | null {
    const found = this.find(id)
    if (!found) { return null }
    return deserializeJSONAPI<T>(found) 
  }

  findEntities<T extends Model>(ids: string[]): T[] {
    const entities: T[] = []
    ids.forEach(id => {
      const entity = this.findEntity<T>(id)
      if (entity !== null) entities.push(entity)
    })
    return entities
  }

  load(records: Record | Record[]) {
    const recordsParsed = !Array.isArray(records) ? [records] : records
    recordsParsed.forEach(r => { this.store[r.id] = r })
  }
}

const recordStore = new RecordStore()
const responseStore: ObjectMap<any> = {}


const axinstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 3000
})


export function transformRelationship<T extends Model>(entity: T, relationshipName: string, relationship: RecordRelationship) {
  if (!entity.hasRelationship(relationshipName)) {
    throw new Error(`Relationship ${relationshipName} not found on ${entity}`)
  }

  if (relationship.data === undefined || relationship.data === null) {
    (entity as any)[relationshipName] = null
    return
  }

  


  if (Array.isArray(relationship.data)) {
    const ids = relationship.data.map(d => d.id)
    const found = recordStore.findEntities(ids)
    if (found.length !== ids.length) {
      console.error(`Expected ${ids.length} records, but only found ${found.length} in store.`)
    } else {
      entity.included.push(relationshipName)
    }
    
    (entity as any)[relationshipName] = found
  } else {
    const found = recordStore.findEntity(relationship.data.id)
    if (found) { 
      entity.included.push(relationshipName)
    } else {
      console.error(`Expected to find ${relationship.data.type} with id ${relationship.data.id} in store but didn't.`)
    }
    (entity as any)[relationshipName] = found
  }
}

function transformRecord<T extends Model>(record: Record) {
  const entity: T = deserializeJSONAPI<T>(record)
  if (record.relationships) {
    entity._relationships = record.relationships
    for (let [rel, value] of Object.entries(record.relationships)) {
      transformRelationship<T>(entity, rel, value)
    }
  }
  return entity
}

export function transformDocument<T extends Model>(doc: RecordDocument) {
  if (!Array.isArray(doc.data)) {
    return transformRecord<T>(doc.data)
  }
  return doc.data.map(data => transformRecord<T>(data))
}


export async function findUsersForLocation(location: string | Location) {
  const locationId = typeof location === 'string' ? location : location.id
  const path = `/locations/${locationId}/users`
  

  const responseTransform = (res: AxiosResponse<any>) => ( transformDocument<User>(res.data) as User[] )  
  if (path in responseStore) {
    return responseTransform(responseStore[path])
  }
  const response = await axinstance.get(path)
  responseStore[path] = response
  if (response.data.data) recordStore.load(response.data.data)
  if (response.data.included) recordStore.load(response.data.included)
  return responseTransform(response)
}

GL.findUsersForLocation = findUsersForLocation
GL.responseStore = responseStore

// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
