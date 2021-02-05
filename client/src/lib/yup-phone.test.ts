// eslint-disable-next-line import/no-unresolved

// Taken from https://github.com/abhisekp/yup-phone/blob/master/src/yup-phone.test.ts

import * as Yup from 'yup'
import './yup-phone'

describe('yup-phone validation', () => {
  it('validates types of phone numbers', () => {
    const phoneSchema = Yup.string()
      .phone()
      .required()
    expect(phoneSchema.isValidSync('4073218876')).toBe(true)
    expect(phoneSchema.isValidSync('7873218876')).toBe(true)
  })

  // it('blocks 555 numbers', () => {
  //   const phoneSchema = Yup.string()
  //     .phone()
  //     .required()
  //   expect(phoneSchema.isValidSync('3215556789')).toBe(false)
  // })
})
