import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

import { QdrantVectorStore } from 'llamaindex'
import LoadData from './loadData.js'
import 'dotenv/config'

const vectorStore = new QdrantVectorStore({ url: process.env.vector_database_url})

async function main () {
  // 1.Load Data
  const loadData = new LoadData(vectorStore)
  // await loadData.fileToDocs()
  await loadData.vnk()
}

main()

// Run the server!
try {
  await fastify.listen({ port: process.env.fastify_port })
  console.log('Server listening at port - ', process.env.fastify_port)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}