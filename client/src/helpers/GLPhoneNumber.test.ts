import GLPhoneNumber from './GLPhoneNumber'

describe('GLPhoneNumber', () => {
  describe('#isValid', () => {
    it('validates a US number', () => {
      expect(new GLPhoneNumber('407-333-2729').isValid()).toEqual(true)
    })

    it('validates a PR number', () => {
      expect(new GLPhoneNumber('787-333-2729').isValid()).toEqual(true)
    })

    it('validates a CA number', () => {
      expect(new GLPhoneNumber('367-333-2729').isValid()).toEqual(true)
    })

    it('does not validate a 555 number', () => {
      expect(new GLPhoneNumber('555-333-2729').isValid()).toEqual(false)
    })
  })

  describe('#national', () => {
    it('returns a pretty phone number', () => {
      expect(new GLPhoneNumber('787-333-2729').national()).toEqual('(787) 333-2729')
    })
  })

  describe('#international', () => {
    it('returns an international phone number', () => {
      expect(new GLPhoneNumber('787-333-2729').international()).toEqual('+17873332729')
    })
  })
})
