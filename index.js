import { QdrantVectorStore } from 'llamaindex'
import LoadData from './loadData.js'

const vectorStore = new QdrantVectorStore({ url: 'http://localhost:6333' })

async function main () {
  // 1.Load Data
  const loadData = new LoadData(vectorStore)
  await loadData.fileToDocs()
}

main()
