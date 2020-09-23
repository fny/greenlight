export type ObjectMap<T> = { [k: string]: T}
export type Dict<T> = { [k: string]: T}
export type NumberOrString = Number | String


export type OnChangeEvent = ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined


//
// Json API Related
//

export interface LinkObject {
    href: string;
    meta?: Dict<any>;
}

export type Link = string | LinkObject;

export interface RecordIdentity {
  type: string;
  id: string;
}

export interface RecordHasOneRelationship {
  data?: RecordIdentity | null;
  links?: Dict<Link>;
  meta?: Dict<any>;
}

export interface RecordHasManyRelationship {
  data?: RecordIdentity[];
  links?: Dict<Link>;
  meta?: Dict<any>;
}

export type RecordRelationship =
  | RecordHasOneRelationship
  | RecordHasManyRelationship;

export interface RecordFields {
  keys?: Dict<string>;
  attributes?: Dict<any>;
  relationships?: Dict<RecordRelationship>;
  links?: Dict<Link>;
  meta?: Dict<any>;
}

export interface Record extends RecordFields, RecordIdentity {}

export interface UninitializedRecord extends RecordFields {
  type: string;
  id?: string;
}
  
export interface LinkObject {
  href: string;
  meta?: Dict<any>;
}

export type Link = string | LinkObject;

export interface RecordIdentity {
  type: string;
  id: string;
}

export interface RecordHasOneRelationship {
  data?: RecordIdentity | null;
  links?: Dict<Link>;
  meta?: Dict<any>;
}

export interface RecordHasManyRelationship {
  data?: RecordIdentity[];
  links?: Dict<Link>;
  meta?: Dict<any>;
}

export type RecordRelationship =
  | RecordHasOneRelationship
  | RecordHasManyRelationship;

export interface RecordFields {
  keys?: Dict<string>;
  attributes?: Dict<any>;
  relationships?: Dict<RecordRelationship>;
  links?: Dict<Link>;
  meta?: Dict<any>;
}

export interface Record extends RecordFields, RecordIdentity {}

export interface UninitializedRecord extends RecordFields {
  type: string;
  id?: string;
}
  
export interface RecordDocument {
  data: Record | Record[];
  included?: Record[];
  links?: ObjectMap<Link>;
  meta?: ObjectMap<any>;
}

export interface JSONAPIError {
  id?: string
  status: string
  code: string
  title: string
  detail: string
}


export interface ErrorDocument {
  errors?: JSONAPIError[]
}

export interface TokenDocument {
  token: string
}
