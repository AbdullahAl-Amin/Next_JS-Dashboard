// ESM
import Fastify from 'fastify'
import routes from './test-route.js'
import dbConnector from './db-connector.js'

const fastify = Fastify({
  logger: true
})

fastify.register(dbConnector)
fastify.register(routes)

// Declare a route
// fastify.get('/', function (request, reply) {
//   reply.send({ hello: 'world' })
// })

// fastify.get('/', async (request, reply) => {
//   return { hello: 'world' }
// })

// Run the server!
// fastify.listen({ port: 3000 }, function (err, address) {
//   if (err) {
//     fastify.log.error(err)
//     process.exit(1)
//   }
//   // Server is now listening on ${address}
// })

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()