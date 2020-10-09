import { Model } from "./models"

export type Dict<T> = { [k: string]: T}

export type OnChangeEvent = ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined

//
// Json API Related
//

export interface Record extends RecordFields, RecordPointer {}

export interface UninitializedRecord extends RecordFields {
  type: string
  id?: string
}

export interface LinkObject {
  href: string
  meta?: Dict<any>
}

export type Link = string | LinkObject;

export interface RecordPointer {
  type: string
  id: string
}

export interface RecordHasOneRelationship {
  data?: RecordPointer | null
  links?: Dict<Link>
  meta?: Dict<any>
}

export interface RecordHasManyRelationship {
  data?: RecordPointer[]
  links?: Dict<Link>
  meta?: Dict<any>
}

export type RecordRelationship =
  | RecordHasOneRelationship
  | RecordHasManyRelationship;

export interface RecordFields<T> {
  keys?: Dict<string>
  attributes?: Partial<T>
  relationships?: Dict<RecordRelationship>
  links?: Dict<Link>
  meta?: Dict<any>
}

export interface Record<T> extends RecordFields<T>, RecordPointer {}

export interface UninitializedRecord extends RecordFields {
  type: string
  id?: string
}

export interface RecordResponse<T> {
  data: Record<T> | Record<T>[]
  included?: Record[]
  links?: Dict<Link>
  meta?: Dict<any>
}

export interface JSONAPIError {
  id?: string
  status: string
  code: string
  title: string
  detail: string
}


export interface ErrorReponse {
  errors?: JSONAPIError[]
}

export interface TokenResponse {
  token: string
}

export type Entity<T extends Model> = new() => T

type EntityId = string
