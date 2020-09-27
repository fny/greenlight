import { AxiosResponse } from 'axios'
import { Dict, Record, RecordResponse, RecordRelationship, Entity } from '../types'
import { Model } from '../models'
import { deserializeJSONAPI } from '../models/Model'
import { zip } from 'lodash'

interface RecordStoreEntry {
  record: Record
  entity?: Model
}

class RecordStore {
  data: Dict<RecordStoreEntry>

  constructor() {
    this.data = {}
  }

  findRecord(id: string): Record | null {
    return this.data[id]?.record
  }

  findRecords(ids: string[]): Record[] {
    const records: Record[] = []
    for (const id of ids) {
      const record = this.findRecord(id)
      if (record !== null) records.push(record)
    }
    return records
  }
  
  findEntity<T extends Model>(id: string): T | null {
    let entity = this.data[id]?.entity
    if (entity) { return entity as T }

    const record = this.findRecord(id)
    if (!record) { return null }
    entity = deserializeJSONAPI<T>(record)
    this.data[id].entity = entity
    return entity as T
  }

  findEntities<T extends Model>(ids: string[]): T[] {
    const entities: T[] = []
    for (const id of ids) {
      const entity = this.findEntity<T>(id)
      if (entity !== null) entities.push(entity)
    }
    return entities
  }

  load(records: Record | Record[]) {
    const recordsParsed = !Array.isArray(records) ? [records] : records
    recordsParsed.forEach(r => { this.data[r.id] = { record: r } })
  }

  loadRecordResponse(res: RecordResponse) {
    if (res.included) this.load(res.included)
    if (res.data) this.load(res.data)
  }

  reset() {
    this.data = {} 
  }
}

class ResponseStore {
  data: Dict<AxiosResponse<any>>

  constructor() {
    this.data = {}
  }
  
  has(key: string) {
    return key in this.data
  }

  get(key: string) {
    return this.data[key]
  }
  set(key: string, value: AxiosResponse<any>) {
    this.data[key] = value
  }
  reset() {
    this.data = {} 
  }
}

export const recordStore = new RecordStore()
export const responseStore = new ResponseStore()

// TODO: Drop lodash zip in favor of this
// Waiting on https://github.com/typescript-eslint/typescript-eslint/issues/2600
//
// export function zipTwo<X, Y>(xs: X[], ys: Y[]): [X , Y][] {
//   const zipped: [X, Y][] = []
//   for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
//     zipped.push([xs[i], ys[i]])
//   }
//   return zipped
// }

export function transformRelationship<T extends Model>(entity: T, relationshipName: string, relationship: RecordRelationship) {
  // Skip if we've already loaded the relationship
  if (entity._included.includes(relationshipName)) return 

  if (!entity.hasRelationship(relationshipName)) {
    throw new Error(`Relationship ${relationshipName} not found on ${entity}`)
  }

  if (relationship.data === undefined || relationship.data === null) {
    (entity as any)[relationshipName] = null
    return
  }

  if (Array.isArray(relationship.data)) {
    const ids = relationship.data.map(d => d.id)
    const foundEntities = recordStore.findEntities(ids)
    const foundRecords = recordStore.findRecords(ids)
    if (foundRecords.length !== ids.length) {
      throw `Expected ${ids.length} records, but only found ${foundRecords.length} in store.`
    } else {
      entity._included.push(relationshipName)
    }
    // Set relationship for records on the relationship
    zip(foundEntities, foundRecords).forEach(([e, r]) => {
      tranformRelationships(e as Model, r as Record)
    })

    ;(entity as any)[relationshipName] = foundEntities
  } else {
    const foundEntity = recordStore.findEntity(relationship.data.id)
    const foundRecord = recordStore.findRecord(relationship.data.id)
    if (foundEntity && foundRecord) { 
      entity._included.push(relationshipName)
    } else {
      throw `Expected to find ${relationship.data.type} with id ${relationship.data.id} in store but didn't.`
    }
    
    // Set relationship for records on the relationship
    tranformRelationships<any>(foundEntity, foundRecord)
    ;(entity as any)[relationshipName] = foundEntity
  }

}

function tranformRelationships<T extends Model>(entity: T, record: Record) {
  if (!record.relationships) return
  entity._relationships = record.relationships
  for (const [rel, value] of Object.entries(record.relationships)) {
    transformRelationship<T>(entity, rel, value)
  }
}

/**
 * Transforms records from the API into entities
 * 
 * @param record the record to be transformed
 */
function transformRecord<T extends Model>(record: Record) {
  const entity: T = deserializeJSONAPI<T>(record)
  tranformRelationships(entity, record)
  return entity
}

export function transformRecordResponse<T extends Model>(res: RecordResponse): T | T[] {
  if (!Array.isArray(res.data)) {
    return transformRecord<T>(res.data)
  }
  return res.data.map(data => transformRecord<T>(data))
}
