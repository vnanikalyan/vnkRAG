import {
  Ollama,
  Document,
  PDFReader,
  VectorStoreIndex,
  Settings,
  SimpleDirectoryReader,
  DocxReader,
  HTMLReader,
  ImageReader
} from 'llamaindex'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ollama = new Ollama({
  model: 'mistral',
  temperature: 0.75,
  baseURL: 'http://localhost:11434',
  embedModel: 'nomic-embed-text'
})

Settings.llm = ollama
Settings.embedModel = ollama

console.log('ollama - ', ollama)    

class LoadData {
  constructor (vectorStore) {
    this.vectorStore = vectorStore
  }

  async fileToDocs () {
    const filePath = path.join(__dirname, 'CREATININE_07-12-2022-19_36_51.pdf')
    const ext = path.extname(filePath)
    console.log('file Extension - ', ext)

    let document
    let readData
    switch (ext) {
      case '.txt':
        readData = await fs.readFile(filePath, 'utf-8')
        document = new Document({ text: readData, id_: 'essay' })
        break
      case '.pdf':
        const pdfReader = new PDFReader()
        readData = await pdfReader.loadData(filePath)
        document = new Document({ text: readData, id_: 'pdf' })
        break
      case '.docx':
        const docxReader = new DocxReader()
        readData = await docxReader.loadData(filePath)
        document = new Document({ text: readData, id_: 'docx' })
        break
      case '.html':
        const htmlReader = new HTMLReader()
        readData = await htmlReader.loadData(filePath)
        document = new Document({ text: readData, id_: 'html' })
        break
      case '.png':
        const imageReader = new ImageReader()
        readData = await imageReader.loadData(filePath)
        document = new Document({ text: readData, id_: 'image' })
        break
      default:
        return 'Unsupported file extension.'
    }

    try {
        // Store the document in the vector store
        await VectorStoreIndex.fromDocuments([document], {
            vectorStore: this.vectorStore
        })
        console.log('Document stored in vector store.', document)
    } catch(err) {
        console.log('Error storing document in vector store.', err)
    }
  }
}

export default LoadData
