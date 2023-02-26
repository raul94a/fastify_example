const fastify = require('fastify')({ logger: true })





fastify.register(require('@fastify/mysql'), {
    user:'fastify',
    port:3306,
    host: '172.18.45.11', 
    database:'FASTIFY_TEST',
    password:'********'
  })

  

fastify.get('/users', (req,reply)=>{
    fastify.mysql.query(
        'select * from users',
        function onResult(err,result){
            reply.send(err || result)
        }
    )
});

fastify.route({
  method: 'GET',
  url: '/',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      name: { type: 'string' }
    },
    // the response needs to be an object with a `hello` property of type 'string'
    response: {
      200: {
        type: 'object',
        properties: {
          hola: { type: 'string' }
        }
      }
    }
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    return { hola: 'world' }
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()