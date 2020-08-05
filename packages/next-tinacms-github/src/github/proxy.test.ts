import { apiProxy } from './proxy'

describe('apiProxy', () => {
  describe('without a signing key', () => {
    it('responds with status 500', async () => {
      // @ts-ignore That's the point of the test.
      const handler = apiProxy(undefined)
      const req = {}
      const res = new ResStub()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })
    it('sends JSON response', async () => {
      // @ts-ignore That's the point of the test.
      const handler = apiProxy(undefined)
      const req = {}
      const res = new ResStub()

      await handler(req, res)

      expect(res.json).toHaveBeenCalled()
    })
  })
})

class ResStub {
  status = jest.fn(() => this)
  json = jest.fn()
}
