import * as fixtures from './fixtures'
import { fastify } from 'fastify'
import dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

dotenv.config({ path: '../.env' })


const host = 'localhost'
const port = 8000

if (process.env.JWT_PRIVATE_KEY === undefined) {
  throw new Error("Now JWT Private Key Found")
}

const server = fastify({ logger: true })

if (process.env.JWT_SECRET === undefined || process.env.JWT_SECRET.length !== 64) {
  throw new Error("Missing or invalid JWT secret")
}


function tokenResponse(user: fixtures.Fixture) {
  return {
    token: jwt.sign(user._data.authToken, process.env.JWT_SECRET, { algorithm: 'HS256' })
  }
}

server.post('/api/v1/auth/sign-in', async (req, res) => {
  const emailOrMobile = (req.body as any).emailOrMobile

  if (emailOrMobile.includes('@')) {
    const user = fixtures.findWhere("users",  { email: emailOrMobile })
    return tokenResponse(user)
  }

  const parsedPhone = parsePhoneNumberFromString(emailOrMobile, 'US')

  if (!parsedPhone || parsedPhone.country !== 'US' || !parsedPhone.isValid()) {
    throw new Error("Not a valid email or phone number")
  }

  const user = fixtures.findWhere('users', { mobileNumber: parsedPhone.number })

  return tokenResponse(user)
})

server.get('/api/v1/users', async (req, res) => {
  res.type('application/json').code(200)
  const queryParams: any = req.query
  const include = queryParams['include'] ? queryParams['include'].split(',') : []

  return fixtures.all('users').map(f => f.data(include))
})

server.get('/api/v1/users/me', async (req, res) => {
  res.type('application/json').code(200)
  const queryParams: any = req.query
  const include = queryParams['include'] ? queryParams['include'].split(',') : []

  return fixtures.all('users').map(f => f.data(include))
})


server.listen(port, (err, address) => {
  if (err) throw err
  server.log.info(`server listening on ${address}`)
})
