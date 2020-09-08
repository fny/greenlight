import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

class Fixture {
  _data: any
  type: string
  id: string

  constructor(type: string, data: any) {
    this._data = data
    this.type = type
    this.id = data.id
  }

  attributes() {
    const attributes: any = {}

    for (let [key, value] of Object.entries(this._data)) {
      if (key === 'id' || key === 'relationships') continue
      attributes[key] = value
    }
    return attributes
  }

  relationships() {
    if (!this._data.relationships) return null
    const relationships: any = {}
    for (let [relationshipName, value] of Object.entries(this._data.relationships)) {
      let type: string = relationshipName, record: any = value

      // There is more information about the type
      if (typeof record === 'object' && !Array.isArray(record)) {
        type = Object.keys(record)[0]
        record = record[type]
      }

      // hasMany
      if (Array.isArray(record)) {
        relationships[relationshipName] = {
          data: record.map(id => { return { type, id } })
        }
      } else {
        relationships[relationshipName] = { data: { type, id: (record as any ).id } }
      }
    }
    return relationships
  }

  data(include: string[] = []) {
    const record: any = {}
    record.id = this._data.id
    record.type = this.type
    const attributes = this.attributes()
    if (attributes) {
      record.attributes = attributes
    }
    if (include.length > 0) {
      const relationships: any = {}
      const availableRelationships = this.relationships()
      include.forEach(rel => {
        if (rel in availableRelationships) {
          relationships[rel] = availableRelationships[rel]
        } else {
          throw new Error(`Relationship ${rel} does not exist`)
        }
      })
      record.relationships = relationships
    }

    return record
  }

  dataComplete() {
    const record: any = {}
    record.id = this._data.id
    record.type = this.type
    const attributes = this.attributes()
    if (attributes) {
      record.attributes = attributes
    }
    const relationships = this.relationships()
    if (relationships) {
      record.relationships = relationships
    }
    return record
  }
}

export const fixtures: any = {}

const filenames = fs.readdirSync(path.join(__dirname)).filter(f => f.includes('.yml'))

filenames.forEach(filename => {
  const model = filename.split('.')[0]
  const parsed = yaml.safeLoad(fs.readFileSync(path.join(__dirname, filename)).toString()) as any

  fixtures[model] = parsed.map((f: any) => new Fixture(model, f))
})


export function all(model: string): Fixture[] {
  const f = fixtures[model]
  if (!f) {
    throw new Error(`Fixtures not found for model ${model}`)
  }
  return f
}

export function find(model: string, id: string): Fixture {
  const records = fixtures[model].filter((x: any) => x.id === id)
  if (records.length === 0) {
    throw new Error(`Fixture not found for model ${model} with id ${id}`)
  }
  return records[0]
}

export function findRelationships(data: any) {
  const records = []
  for (let [relationshipName, value] of Object.entries(data.relationships)) {
    const d = data.relationships[relationshipName].data
    if (Array.isArray(d)) {
      d.forEach(x => records.push(find(x.type, x.id).data()))
    } else {
      records.push(find(d.type, d.id).data())
    }
  }
  return records
}
