import "reflect-metadata"

export const MODEL_METADATA_KEY = Symbol('gl:model')
export const ATTR_METADATA_KEY = Symbol('gl:attr')

interface ModelDefinition {
  plural: string
  singular: string
}

interface AttributeDefinition {
  source?: string | string[]
  transform?: (x: any) => any
  // e.g. User, [User]
  type?: Constructable | Constructable[] | string | string[]
}

export function attribute(updates?: AttributeDefinition) {
  updates = updates || {}
  return (target: any, propertyKey: string | symbol) => {
    // Pull the existing metadata or create an empty object
    const allMetadata = Reflect.getMetadata(ATTR_METADATA_KEY, target) || {}
    // Ensure allMetadata has propertyKey
    allMetadata[propertyKey] = allMetadata[propertyKey] || {}
    for (let key in updates) {
      allMetadata[propertyKey][key] = (updates as any)[key];
    }
    // Update the metadata
    Reflect.defineMetadata(ATTR_METADATA_KEY, allMetadata, target);
  }
}

type Constructable = { new(...args: any[]): any }


type ValueOrArray<T> = T | Array<ValueOrArray<T>>

function debug(obj: any) {
  return JSON.stringify(obj, function (k, v) {
    return k && v && typeof v !== 'number'
      ? Array.isArray(v)
        ? '[object Array]'
        : '' + v
      : v
  })
}

function coerceType<T>(
  data: any,
  typecast: Constructable | Constructable[]
): ValueOrArray<T> {
  if (Array.isArray(typecast) && Array.isArray(data)) {
    return data.map((x) => coerceType(x, typecast))
  }
  if (!Array.isArray(typecast) && !Array.isArray(data)) {
    if (typeof typecast === 'string') {
      typecast = eval(typecast)
    }
    return new (typecast as Constructable)(data)
  }
  throw new Error(`Type mismatch ${debug(data)} ${debug(typecast)}`)
}

export function Model(modelDef: ModelDefinition) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(MODEL_METADATA_KEY, modelDef, constructor);
    return class extends constructor {

      constructor(...args: any[]) {
        super()

        const inputData = args[0]

        // For the given attribute loop over the meta data
        const allMetadata = Reflect.getMetadata(ATTR_METADATA_KEY, constructor.prototype)

        for (let propertyName in allMetadata) {
          const metadata = allMetadata[propertyName] as AttributeDefinition
          let source: string = ''

          if (metadata.source == null) {
            source = propertyName
          } else if (!Array.isArray(metadata.source)) {
            source = metadata.source
          } else {
            for (let s of metadata.source) {
              if (s in inputData) {
                source = s
                break
              }
            }
          }

          const providedValue = inputData[source]
          if (providedValue == undefined) {
            continue
            // TODO: we need an erro if the value is not found
            // throw new Error(`No value given for ${source}`)
          }
          if (metadata.transform) {
            (this as any)[propertyName] = metadata.transform(providedValue)
          } else if (metadata.type) {
            ;;(this as any)[propertyName] = coerceType(
              providedValue,
              typeof metadata.type === 'string'
                ? eval(metadata.type)
                : metadata.type
            )
          } else {
            (this as any)[propertyName] = providedValue
          }
        }
      }
    }
  }
}

// To assuage the TypeScript compiler
export class Base {
 constructor(...args: any[]) {
   // This will be overriden
 }
}
