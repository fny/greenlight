import 'reflect-metadata'
import moment from 'moment'
import uuid from 'uuid'
import { Schema, SchemaSettings } from '@orbit/data'
import { ObjectMap, Record } from '../types'

interface DataType {
  serialize?: Function,
  deserialize?: Function,
  orbitType: string
}

interface AttributeDefinition {
  source?: string | string[]
  transform?: (x: any) => any
  // e.g. User, [User]
  type: DataType
}

interface RelationshipDefinition {
  type: 'hasOne' | 'hasMany'
  model: string
  // Name of inverse model to keep in sync
  inverse?: string
}

function debug(obj: any) {
  return JSON.stringify(obj, function (k, v) {
    return k && v && typeof v !== 'number'
      ? Array.isArray(v)
        ? '[object Array]'
        : '' + v
      : v
  })
}

export const ATTR_METADATA_KEY = Symbol('gl:attr')
export const REL_METADATA_KEY = Symbol('gl:rel')

export const STRING: DataType = {
  orbitType: 'string'
}

export const NUMBER: DataType = {
  orbitType: 'number'
}

export const BOOLEAN: DataType = {
  orbitType: 'boolean'
}

// TODO: Date type

export const DATETIME: DataType = {
  serialize: (x: moment.Moment) => x.format(),
  deserialize: moment,
  orbitType: 'date-time'
}

class Registry {
  models: typeof Model[]
  inflections: { [k: string]: string }

  constructor() {
    this.models = []
    this.inflections = {}
  }

  register(...models: (typeof Model)[]) {
    models.forEach(m => {
      this.models.push(m)
      this.inflections[m.singular] = m.singular
      this.inflections[m.plural] = m.singular
    })
  }

  modelFor(singularOrPlural: string) {
    for (let model of this.models) {
      if (model.singular === singularOrPlural || model.plural === singularOrPlural) {
        return model
      }
    }
    return null
  }
  orbitSchema() {
    return buildOrbitSchema(this.models, true)
  }
}

export const ModelRegistry = new Registry()

export class Model {
  /** The singular name for this model */
  static singular: string

  /** The plural name for this model */
  static plural: string
  
  /** All entities must have a UUID */
  id: string

  /** Raw request data */
  _data: any

  /** Raw relationship data */
  _relationships: any

  /** Anything that was included while populatiing the entity */
  included: string[] = []

  /** Raw user data */

  constructor(data?: any) {
    this.id = ''
  }

  setId() {
    this.id = uuid.v4()
  }

  modelName() {
    return Object.getPrototypeOf(this).constructor.singular
  }

  modelNamePlural() {
    return Object.getPrototypeOf(this).constructor.plural
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
      attributes[property] = value.type.serialize ?
        value.type.serialize((this as any)[property]) :
        (this as any)[property]
    }

    return {
      id: this.id,
      type: Object.getPrototypeOf(this).constructor.singular,
      attributes
    }
  }
}

export function initialize(record: Model,  data: any)  {
  _deserialize(Object.getPrototypeOf(record).constructor, data, record)
}

export function deserializeJSONAPI<T extends Model>(record: Record): T {
  const model = ModelRegistry.modelFor(record.type)
  if (model === null) {
    throw new Error(`No model found for type ${record.type}`)
  }

  const data = {
    id: record.id,
    ...record.attributes
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

    if (['_data'].includes(property)) {
      continue
    }

    // Cast and assign attributes
    if (attrMeta && property in attrMeta) {
      const attrDef = ((attrMeta as any)[property] as AttributeDefinition)
        ; (record as any)[property] =
          attrDef.type.deserialize ? attrDef.type.deserialize(value) : value
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
        ; (record as any)[property] = value.map(v => new model(v))
      } else {
        const model = ModelRegistry.modelFor(relDef.model)
        if (!model) {
          throw new Error(`Couldn't find model for ${relDef.model}`)
        }
        if (Array.isArray(value)) {
          throw new Error(`Expected single object for hasOne got ${debug(value)}`)
        }
        ; (record as any)[property] = new (model as any)(value)
      }
      continue
    }

    throw new Error(`No matching attribute or relationship: ${property}`)
  }
  return record
}

export function attribute(definiton: AttributeDefinition) {
  const attrDefinition = definiton || {}
  return (target: Object, propertyKey: string) => {
    // `target` is the object/class where the property key resides

    // Pull the existing metadata or create an empty object
    const allMetadata: { [propertyKey: string]: AttributeDefinition } =
      Reflect.getMetadata(ATTR_METADATA_KEY, target) || {}

    // Ensure allMetadata has propertyKey
    allMetadata[propertyKey] = allMetadata[propertyKey] || {}
    const currAttributes = allMetadata[propertyKey]

    Object.keys(attrDefinition).forEach(key => {
      (currAttributes as any)[key] = (attrDefinition as any)[key]
    })
    // Update the metadata
    Reflect.defineMetadata(ATTR_METADATA_KEY, allMetadata, target)
  }
}

export function relationship(definiton: RelationshipDefinition) {
  const attrDefinition = definiton || {}
  return (target: Object, propertyKey: string) => {
    // `target` is the object/class where the property key resides

    // Pull the existing metadata or create an empty object
    const allMetadata: { [propertyKey: string]: RelationshipDefinition } =
      Reflect.getMetadata(REL_METADATA_KEY, target) || {}

    // Ensure allMetadata has propertyKey
    allMetadata[propertyKey] = allMetadata[propertyKey] || {}
    const currAttributes = allMetadata[propertyKey]

    Object.keys(attrDefinition).forEach(key => {
      (currAttributes as any)[key] = (attrDefinition as any)[key]
    })
    // Update the metadata
    Reflect.defineMetadata(REL_METADATA_KEY, allMetadata, target);
  }
}

function getAttributes(model: typeof Model): { [k: string]: AttributeDefinition } {
  return Reflect.getMetadata(ATTR_METADATA_KEY, model.prototype)
}

function getRelationships(model: typeof Model): { [k: string]: AttributeDefinition } {
  return Reflect.getMetadata(REL_METADATA_KEY, model.prototype)
}

function buildOrbitSchema(models: (typeof Model[]), overrideInflections?: boolean) {


  const schemaData: SchemaSettings = { models: {} }
  if (overrideInflections) {
    const singularInflections: ObjectMap<string> = {}
    const pluralInflections: ObjectMap<string> = {}
    for (let model  of models) {
      singularInflections[model.plural] = model.singular
      singularInflections[model.singular] = model.singular
      pluralInflections[model.singular] = model.plural
      pluralInflections[model.plural] = model.plural
    }

    schemaData.pluralize = (word: string) => pluralInflections[word]
    schemaData.singularize = (word: string) => singularInflections[word]
  }

  models.forEach(model => {
    const attributes = {}
    const relationships = {}

    const attrDefinitions = getAttributes(model)
    if (attrDefinitions) {
      Object.keys(attrDefinitions).forEach(propertyKey => {
        const definition = ((attrDefinitions as any)[propertyKey] as AttributeDefinition)
          ; (attributes as any)[propertyKey] = { type: definition.type.orbitType }
      })
    }

    const relDefinitions = getRelationships(model)

    if (relDefinitions) {

      Object.keys(relDefinitions).forEach(relationshipName => {
        const rel = ((relDefinitions as any)[relationshipName] as RelationshipDefinition)
          ; (relationships as any)[relationshipName] = {
            type: rel.type,
            model: rel.model
          }
        if (rel.inverse) {
          (relationships as any)[relationshipName]['inverse'] = rel.inverse
        }

      })
    }
    if (!schemaData.models) return //  To make TS shut up
    schemaData.models[model.singular] = {
      attributes,
      relationships
    }
  })
  return new Schema(schemaData)
}
