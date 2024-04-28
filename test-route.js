// async function routes (fastify, options) {
//   fastify.get('/', async (request, reply) => {
//     return { hello: 'world' }
//   })
// }

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
async function routes (fastify, options) {
  // const collection = fastify.mysql.db.collection('user')

  const tableName = 'user';
  
  fastify.get('/letest-invoices', async (request, reply) => {
    const result = await prisma.invoice.findMany({
      select: {
        amount: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
        id: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });
    if (result.length === 0) {
      throw new Error('No documents found')
    }
    return result
  })

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/users', async (request, reply) => {
    const result = await prisma.user.findMany()
    if (result.length === 0) {
      throw new Error('No documents found')
    }
    return result
  })

  fastify.get('/user/:id', async (request, reply) => {
    // const result = await collection.findOne({ animal: request.params.animal })
    console.log(request.params.id)
    const result = await prisma.user.findFirst({where:{id:request.params.id}})
    if (!result) {
      throw new Error('Invalid value')
    }
    return result
  })

  const userBodyJsonSchema = {
    type: 'object',
    required: ['id', 'name', 'email', 'password'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },  
      password: { type: 'string' }
    },
  }

  const schema = {
    body: userBodyJsonSchema,
  }

  fastify.post('/user', { schema }, async (request, reply) => {
    
    try {
      // console.log(request)
      // console.log(request.body)
      // console.log(request.body.name)

      // we can use the `request.body` object to get the data sent by the client
      const result = await prisma.user.create({ data: request.body })
      // console.log(result)
      // return result
      return reply.code(200).send({ success: 'User Crearted Successfully', message: result })

    }catch (error) {
      // console.log(error)
      // Handle database errors or other unexpected errors
      return reply.code(500).send({ error: 'Internal Server Error', message: error })
    }
  })
}

//ESM
export default routes;