import { setGlobal } from 'reactn'
import { Dict, Record, RecordResponse, RecordRelationship, RecordPointer, EntityId } from 'src/types'
import { Model } from 'src/models'
import { deserializeJSONAPI } from 'src/lib/Model'
import { zipTwo } from 'src/helpers/util'
import env from 'src/config/env'
import logger from 'src/helpers/logger'

interface RecordStoreEntry {
  record: Record<any>
  entity?: Model
}

class RecordStore {
  data: Dict<RecordStoreEntry>

  constructor() {
    this.data = {}
  }

  findRecord(id: EntityId): Record<any> | null {
    return this.data[id]?.record
  }

  findRecords(ids: EntityId[]): Record<any>[] {
    const records: Record<any>[] = []
    for (const id of ids) {
      const record = this.findRecord(id)
      if (record !== null) records.push(record)
    }
    return records
  }

  findEntity<T extends Model>(id: EntityId): T | null {
    let entity = this.data[id]?.entity
    if (entity) {
      return entity as T
    }

    const record = this.findRecord(id)
    if (!record) {
      return null
    }
    entity = transformRecord<T>(record)
    this.data[id].entity = entity
    return entity as T
  }

  findEntities<T extends Model>(ids: EntityId[]): T[] {
    const entities: T[] = []
    for (const id of ids) {
      const entity = this.findEntity<T>(id)
      if (entity !== null) entities.push(entity)
    }
    return entities
  }

  private writeRecords(records: Record<any> | Record<any>[]) {
    const recordsParsed = !Array.isArray(records) ? [records] : records
    recordsParsed.forEach((r) => {
      this.data[uuid(r)] = { record: r }
    })
  }

  writeRecordResponse(res: RecordResponse<any>) {
    if (res.included) this.writeRecords(res.included)
    if (res.data) this.writeRecords(res.data)
    this.onStoreUpdated()
  }

  reset() {
    this.data = {}
  }

  private onStoreUpdated() {
    logger.dev(`record store is updated at ${new Date().toString()}`)
    setGlobal((globalStore) => ({
      ...globalStore,
      recordStoreUpdatedAt: new Date(),
    }))
  }
}

export const recordStore = new RecordStore()

export function transformRecordResponse<T extends Model>(res: RecordResponse<T>): T | T[] {
  if (Array.isArray(res.data)) {
    return res.data.map((data) => transformRecord<T>(data))
  }
  return transformRecord<T>(res.data)
}

export function uuid(record: Record<any> | RecordPointer): EntityId {
  return `${record.type}-${record.id}`
}

//
// Helpers
//

/**
 * Transforms a singular resource response from the API into an entity
 *
 * @param record the record to be transformed
 */
function transformRecord<T extends Model>(record: Record<any>): T {
  const entity: T = deserializeJSONAPI<T>(record)
  tranformRelationships(entity, record)
  return entity
}

/**
 * Transforms the relationships on an entity in
 *
 * @param entity the record to be transformed
 */
function tranformRelationships<T extends Model>(entity: T, record: Record<any>) {
  if (!record || !record.relationships) return
  // Store raw relationship data
  entity._relationships = record.relationships

  // Assign the relationships for all relationships defined
  for (const [rel, value] of Object.entries(record.relationships)) {
    transformRelationship<T>(entity, rel, value)
  }
}

/**
 * Transforms a single relationship by linking it with entities that have been included
 *
 * @param entity the entity on which to transform a relationship
 * @param relationshipName the name of the relatinship to transform
 * @param relationship the relationship data as providedby the API
 */
function transformRelationship<T extends Model>(
  entity: T,
  relationshipName: string,
  relationship: RecordRelationship,
): void {
  // Skip if we've already loaded the relationship
  if (entity._included.includes(relationshipName)) return

  if (!entity.hasRelationship(relationshipName)) {
    logger.error(`Relationship ${relationshipName} not found on ${entity.resourceType()} model`)
    return
  }

  if (relationship.data === undefined || relationship.data === null) {
    ;(entity as any)[relationshipName] = null
    return
  }

  if (Array.isArray(relationship.data)) {
    const ids = relationship.data.map((d) => uuid(d))
    const foundEntities = recordStore.findEntities(ids)
    const foundRecords = recordStore.findRecords(ids)
    if (foundRecords.length !== ids.length) {
      throw `Expected ${ids.length} records, but only found ${foundRecords.length} in store.`
    } else {
      entity._included.push(relationshipName)
    }
    // Set relationship for records on the relationship
    zipTwo(foundEntities, foundRecords).forEach(([e, r]) => {
      tranformRelationships(e as Model, r as Record<any>)
    })
    ;(entity as any)[relationshipName] = foundEntities
  } else {
    const foundEntity = recordStore.findEntity(uuid(relationship.data))
    const foundRecord = recordStore.findRecord(uuid(relationship.data))
    if (foundEntity && foundRecord) {
      entity._included.push(relationshipName)
    } else {
      // HACK
      console.error(`Expected to find ${relationship.data.type} with id ${relationship.data.id} in store but didn't.`)
      return
    }

    // Set relationship for records on the relationship
    tranformRelationships<any>(foundEntity, foundRecord)
    ;(entity as any)[relationshipName] = foundEntity
  }
}
