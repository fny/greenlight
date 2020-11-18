/* eslint-disable @typescript-eslint/ban-types */

import 'reflect-metadata'
import { DateTime } from 'luxon'
import { Dict, EntityId, Record } from '../types'

//
// Attribute Data Types
//

interface DataType {
  name: string
  serialize?: Function
  deserialize?: Function
}

export const STRING: DataType = {
  name: 'string',
}

export const NUMBER: DataType = {
  name: 'number',
}

export const BOOLEAN: DataType = {
  name: 'boolean',
}

export const DATE: DataType = {
  name: 'date',
  serialize: (x: DateTime) => x.toFormat('yyyy-MM-dd'),
  deserialize: (x: string) => DateTime.fromISO(x),
}

export const DATETIME: DataType = {
  name: 'date-time',
  serialize: (x: DateTime) => x.toFormat('yyyy-MM-dd'),
  deserialize: (x: string) => DateTime.fromISO(x),
}

//
// Attributes
//

interface AttributeDefinition {
  source?: string | string[]
  transform?: (x: any) => any
  // e.g. User, [User]
  type: DataType
}

export const ATTR_METADATA_KEY = Symbol('gl:attr')

export function attribute(definiton: AttributeDefinition) {
  const attrDefinition = definiton || {}
  return (target: Object, propertyKey: string) => {
    // `target` is the object/class where the property key resides

    // Pull the existing metadata or create an empty object
    const allMetadata: { [propertyKey: string]: AttributeDefinition } = Reflect.getMetadata(ATTR_METADATA_KEY, target) || {}

    // Ensure allMetadata has propertyKey
    allMetadata[propertyKey] = allMetadata[propertyKey] || {}
    const currAttributes = allMetadata[propertyKey]

    Object.keys(attrDefinition).forEach((key) => {
      (currAttributes as any)[key] = (attrDefinition as any)[key]
    })
    // Update the metadata
    Reflect.defineMetadata(ATTR_METADATA_KEY, allMetadata, target)
  }
}

function getAttributes(model: typeof Model): { [k: string]: AttributeDefinition } {
  return Reflect.getMetadata(ATTR_METADATA_KEY, model.prototype)
}

//
// Relationships
//

interface RelationshipDefinition {
  model: string
  type: 'hasOne' | 'hasMany'
}

export const REL_METADATA_KEY = Symbol('gl:rel')

export function relationship(definiton: RelationshipDefinition) {
  const relDefinition = definiton || {}
  return (target: Object, propertyKey: string) => {
    // `target` is the object/class where the property key resides
    // `propertyKey` is the property

    // Pull the existing metadata or create an empty object
    const allMetadata: { [propertyKey: string]: RelationshipDefinition } = Reflect.getMetadata(REL_METADATA_KEY, target) || {}

    // Ensure allMetadata has propertyKey
    allMetadata[propertyKey] = allMetadata[propertyKey] || {}
    const currAttributes = allMetadata[propertyKey]

    Object.keys(relDefinition).forEach((key) => {
      (currAttributes as any)[key] = (relDefinition as any)[key]
    })
    // Update the metadata
    Reflect.defineMetadata(REL_METADATA_KEY, allMetadata, target)
  }
}

export function hasOne(model: string, definition?: Partial<RelationshipDefinition>) {
  return relationship({ ...definition, model, type: 'hasOne' })
}

export function hasMany(model: string, definition?: Partial<RelationshipDefinition>) {
  return relationship({ ...definition, model, type: 'hasMany' })
}

function getRelationships(model: typeof Model): { [k: string]: AttributeDefinition } {
  return Reflect.getMetadata(REL_METADATA_KEY, model.prototype)
}

//
// Models
//

class Registry {
  models: Dict<typeof Model>

  constructor() {
    this.models = {}
  }

  register(...models: (typeof Model)[]) {
    models.forEach((m) => {
      this.models[lowerCaseFirstLetter(m.name)] = m
    })
  }

  modelFor(name: string) {
    return this.models[lowerCaseFirstLetter(name)] || null
  }
}

export const ModelRegistry = new Registry()

export class Model {
  /** The name of this model */
  static resourceType?: string

  /** All entities must have an id that's a string */
  id = ''

  /** Raw request data */
  _data: any

  /** Raw relationship data */
  _relationships: any

  /** Anything that was included while populatiing the entity */
  _included: string[] = []

  // eslint-disable-next-line
  constructor(_data?: any) {}

  @attribute({ type: DATETIME })
  createdAt: DateTime = DateTime.fromISO('')

  @attribute({ type: DATETIME })
  updatedAt: DateTime = DateTime.fromISO('')

  uuid(): EntityId {
    return `${this.resourceType()}-${this.id}`
  }

  resourceType() {
    const { constructor } = Object.getPrototypeOf(this)
    return constructor.resourceType || lowerCaseFirstLetter(constructor.name)
  }

  attributeMetadata() {
    return getAttributes(Object.getPrototypeOf(this).constructor)
  }

  hasRelationship(name: string) {
    return this.relationshipMetadata()[name] !== undefined
  }

  relationshipMetadata() {
    return getRelationships(Object.getPrototypeOf(this).constructor)
  }

  serialize() {
    const attributes: any = {}

    for (const [property, value] of Object.entries(this.attributeMetadata())) {
      attributes[property] = value.type.serialize
        ? value.type.serialize((this as any)[property])
        : (this as any)[property]
    }

    return {
      id: this.id,
      type: (Object.getPrototypeOf(this) as Model).resourceType(),
      attributes,
    }
  }
}

//
// Deserialization
//

/**
 * Call this function inside of the constructor for an entity to deserlaize
 * a data payload and assign it to the entities attributes.
 *
 * @param record
 * @param data
 *
 * @example
 *
 *   class User extends Model {
 *     constructor(data?: any) {
 *       super()
 *       initialize(this, data)
 *     }
 *   }
 */
export function initialize(entity: Model, data: any) {
  _deserialize(Object.getPrototypeOf(entity).constructor, data, entity)
}

export function deserializeJSONAPI<T extends Model>(record: Record<T>): T {
  const model = ModelRegistry.modelFor(record.type)
  if (model === null) {
    throw new Error(`No model found for type ${record.type}`)
  }

  const data = {
    id: record.id,
    ...record.attributes,
  }

  return _deserialize(model, data) as T
}

function _deserialize(model: typeof Model, data: any, this_?: Model) {
  const record = this_ || new model()
  if (!data) return record
  record._data = data

  const attrMeta = record.attributeMetadata()
  const relMeta = record.relationshipMetadata()

  for (const [property, value] of Object.entries(data)) {
    if (property === 'id') {
      record.id = value as string
      continue
    }

    if (property[0] === '_') {
      continue
    }

    // Cast and assign attributes
    if (attrMeta && property in attrMeta) {
      const attrDef = ((attrMeta as any)[property] as AttributeDefinition);
      (record as any)[property] = attrDef.type.deserialize ? attrDef.type.deserialize(value) : value
      continue
    }

    // Cast and assign relationships
    if (relMeta && property in relMeta) {
      const relDef = ((relMeta as any)[property] as RelationshipDefinition)
      if (relDef.type === 'hasMany') {
        const model = ModelRegistry.modelFor(relDef.model)
        if (model === null) {
          throw new Error(`Couldn't find model for ${relDef.model}`)
        }
        if (!Array.isArray(value)) {
          throw new Error(`Expected Array for hasMany got ${debug(value)}`)
        }
        (record as any)[property] = value.map((v) => new model(v))
      } else {
        const { model } = relDef
        if (!model) {
          throw new Error(`Couldn't find model for ${relDef.model}`)
        }
        if (Array.isArray(value)) {
          throw new Error(`Expected single object for hasOne got ${debug(value)}`)
        }
        (record as any)[property] = new (model as any)(value)
      }
      continue
    }

    throw new Error(`No matching attribute or relationship ${property} on type ${model.name}`)
  }
  return record
}

//
// Helpers
//

function debug(obj: any) {
  return JSON.stringify(obj, (k, v) => (k && v && typeof v !== 'number'
    ? Array.isArray(v)
      ? '[object Array]'
      : `${v}`
    : v))
}

function lowerCaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
