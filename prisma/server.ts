import fastify from 'fastify'

import prismaPlugin from './plugins/prisma'


const app = fastify()


app.register(prismaPlugin)


await app.listen(3000, '0.0.0.0')