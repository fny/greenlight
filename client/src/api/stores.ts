import {
  Dict, Record, RecordResponse, RecordRelationship, RecordPointer, EntityId,
} from 'src/types';
import { Model } from 'src/models';
import { deserializeJSONAPI } from 'src/models/Model';
import { zipTwo } from 'src/util';

interface RecordStoreEntry {
  record: Record<any>
  entity?: Model
}

class RecordStore {
  data: Dict<RecordStoreEntry>;

  constructor() {
    this.data = {};
  }

  findRecord(id: EntityId): Record<any> | null {
    return this.data[id]?.record;
  }

  findRecords(ids: EntityId[]): Record<any>[] {
    const records: Record<any>[] = [];
    for (const id of ids) {
      const record = this.findRecord(id);
      if (record !== null) records.push(record);
    }
    return records;
  }

  findEntity<T extends Model>(id: EntityId): T | null {
    let entity = this.data[id]?.entity;
    if (entity) { return entity as T; }

    const record = this.findRecord(id);
    if (!record) { return null; }
    entity = deserializeJSONAPI<T>(record);
    this.data[id].entity = entity;
    return entity as T;
  }

  findEntities<T extends Model>(ids: EntityId[]): T[] {
    const entities: T[] = [];
    for (const id of ids) {
      const entity = this.findEntity<T>(id);
      if (entity !== null) entities.push(entity);
    }
    return entities;
  }

  writeRecords(records: Record<any> | Record<any>[]) {
    const recordsParsed = !Array.isArray(records) ? [records] : records;
    recordsParsed.forEach((r) => { this.data[uuid(r)] = { record: r }; });
  }

  writeRecordResponse(res: RecordResponse<any>) {
    if (res.included) this.writeRecords(res.included);
    if (res.data) this.writeRecords(res.data);
  }

  reset() {
    this.data = {};
  }
}

export const recordStore = new RecordStore();

export function transformRelationship<T extends Model>(entity: T, relationshipName: string, relationship: RecordRelationship) {
  // Skip if we've already loaded the relationship
  if (entity._included.includes(relationshipName)) return;

  if (!entity.hasRelationship(relationshipName)) {
    throw new Error(`Relationship ${relationshipName} not found on ${entity}`);
  }

  if (relationship.data === undefined || relationship.data === null) {
    (entity as any)[relationshipName] = null;
    return;
  }

  if (Array.isArray(relationship.data)) {
    const ids = relationship.data.map((d) => uuid(d));
    const foundEntities = recordStore.findEntities(ids);
    const foundRecords = recordStore.findRecords(ids);
    if (foundRecords.length !== ids.length) {
      throw `Expected ${ids.length} records, but only found ${foundRecords.length} in store.`;
    } else {
      entity._included.push(relationshipName);
    }
    // Set relationship for records on the relationship
    zipTwo(foundEntities, foundRecords).forEach(([e, r]) => {
      tranformRelationships(e as Model, r as Record<any>);
    });
    (entity as any)[relationshipName] = foundEntities;
  } else {
    const foundEntity = recordStore.findEntity(uuid(relationship.data));
    const foundRecord = recordStore.findRecord(uuid(relationship.data));
    if (foundEntity && foundRecord) {
      entity._included.push(relationshipName);
    } else {
      throw `Expected to find ${relationship.data.type} with id ${relationship.data.id} in store but didn't.`;
    }

    // Set relationship for records on the relationship
    tranformRelationships<any>(foundEntity, foundRecord);
    (entity as any)[relationshipName] = foundEntity;
  }
}

function tranformRelationships<T extends Model>(entity: T, record: Record<any>) {
  if (!record.relationships) return;
  entity._relationships = record.relationships;
  for (const [rel, value] of Object.entries(record.relationships)) {
    transformRelationship<T>(entity, rel, value);
  }
}

/**
 * Transforms records from the API into entities
 *
 * @param record the record to be transformed
 */
function transformRecord<T extends Model>(record: Record<any>) {
  const entity: T = deserializeJSONAPI<T>(record);
  tranformRelationships(entity, record);
  return entity;
}

export function transformRecordResponse<T extends Model>(res: RecordResponse<T>): T | T[] {
  if (!Array.isArray(res.data)) {
    return transformRecord<T>(res.data);
  }
  return res.data.map((data) => transformRecord<T>(data));
}

export function uuid(record: Record<any> | RecordPointer): EntityId {
  return `${record.type}-${record.id}`;
}
