import GL from '../GL'
import axios, { AxiosResponse } from 'axios'
import { ObjectMap, Record, RecordDocument, RecordRelationship } from '../types'
import { Location, User, Model } from '../models'
import { deserializeJSONAPI } from '../models/Model'

class RecordStore {
  data: ObjectMap<Record>
  constructor() {
    this.data = {} 
  }

  find(id: string): Record | undefined {
    return this.data[id]
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
    recordsParsed.forEach(r => { this.data[r.id] = r })
  }

  loadRecordDocument(document: RecordDocument) {
    if (document.data) this.load(document.data)
    if (document.included) this.load(document.included)
  }

  reset() {
    this.data = {} 
  }
}

class ResponseStore {
  data: ObjectMap<AxiosResponse<any>>

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
      entity._included.push(relationshipName)
    }
    
    (entity as any)[relationshipName] = found
  } else {
    const found = recordStore.findEntity(relationship.data.id)
    if (found) { 
      entity._included.push(relationshipName)
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

export function transformRecordDocument<T extends Model>(doc: RecordDocument) {
  if (!Array.isArray(doc.data)) {
    return transformRecord<T>(doc.data)
  }
  return doc.data.map(data => transformRecord<T>(data))
}