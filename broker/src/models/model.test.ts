import MemorySource from '@orbit/memory'
import 'reflect-metadata'
import { Model, ModelRegistry, attribute, relationship, initialize, STRING, DATETIME, NUMBER, BOOLEAN } from './model'
import moment from 'moment'

class Teacher extends Model {
  static singular = 'teacher'
  static plural = 'teachers'

  @attribute({ type: STRING })
  name: string = ''

  @relationship({
    type: 'hasOne',
    model: 'school',
    inverse: 'teachers'
  })
  school?: School

  constructor(data: any) {
    super()
    initialize(this, data)
  }
}

class Principal extends Model {
  static singular = 'principal'
  static plural = 'principals'

  @attribute({ type: STRING })
  name: string = ''

  @relationship({
    type: 'hasOne',
    model: 'school',
    inverse: 'principal'
  })
  school?: School

  constructor(data: any) {
    super()
    initialize(this, data)
  }
}

class Student extends Model {
  static singular = 'student'
  static plural = 'students'

  @attribute({ type: STRING })
  name: string = ''

  @relationship({
    type: 'hasMany',
    model: 'school',
    inverse: 'students'
  })
  schools: School[] = []

  constructor(data: any) {
    super()
    initialize(this, data)
  }
}

class School extends Model {
  static singular = 'school'
  static plural = 'schools'

  @attribute({ type: STRING })
  name: string = ''

  @attribute({ type: BOOLEAN })
  isOpen: boolean = false

  @attribute({ type: NUMBER })
  population: number = 0

  @attribute({ type: DATETIME })
  createdAt: moment.Moment = moment(null)

  @relationship({
    type: 'hasMany',
    model: 'teacher',
    inverse: 'school'
  })
  teachers: Teacher[] = []

  @relationship({
    type: 'hasMany',
    model: 'student',
    inverse: 'school'
  })
  students: Student[] = []

  @relationship({
    type: 'hasOne',
    model: 'principal',
    inverse: 'school'
  })
  principal?: Principal

  constructor(data: any) {
    super()
    initialize(this, data)
  }
}

ModelRegistry.register(School, Teacher, Student, Principal)

const schema = ModelRegistry.orbitSchema()
const memory = new MemorySource({ schema })


test('Model#new properly deserializes attributes', () => {
  const name = 'Greenwood Lakes Middle School'
  const createdAt = '2020-09-05T15:50:15.081'
  const isOpen = false
  const population = 100
  const data = {
    name,
    isOpen,
    population,
    createdAt
  }
  const s = new School(data)
  expect(s._data).toEqual(data)
  expect(s.name).toEqual(name)
  expect(s.isOpen).toEqual(isOpen)
  expect(s.createdAt).toEqual(moment(createdAt))
})

test('Model#new properly deseriaizes relationships', () => {
  const students = [{
    name: 'Abby'
  }, {
    name: 'Bobby'
  }]

  const teachers = [{
    name: 'Mr. Cole'
  }, {
    name: 'Mrs. Cooper'
  }]

  const principal = {
    name: 'Mr. Gadreau'
  }

  const school = new School({ students, teachers, principal })
  expect(school.students[0]?.modelName()).toEqual('student')
  expect(school.students.map(s => s.name)).toEqual(['Abby', 'Bobby'])
  expect(school.teachers[0]?.modelName()).toEqual('teacher')
  expect(school.teachers.map(s => s.name)).toEqual(['Mr. Cole', 'Mrs. Cooper'])
  expect(school.principal?.modelName()).toEqual('principal')
  expect(school.principal?.name).toEqual('Mr. Gadreau')
})

test('Model#new throws error for unknown attributes and relationships', () => {
  expect(() => {
    new School({ nonsense: 1 })
  }).toThrow('No matching attribute or relationship: nonsense')
})

test.todo('Model#serialize serializes the model into JSON API format')


test('Model is writeable to orbit store', async () => {
  const name = 'Greenwood Lakes Middle School'
  const createdAt = '2020-09-05T15:50:15.081'
  const isOpen = false
  const population = 100
  const data = {
    name,
    isOpen,
    population,
    createdAt
  }
  const record = new School(data)
  const savedRecord = await memory.update(t => t.addRecord(record.serialize()))


  const result = await memory.query(q => q.findRecord({ type: 'school', id: savedRecord.id }))
  console.log(result)
})
