import { SimpleNodeParser, TitleExtractor, Document,
  Ollama,
  Settings,
 } from "llamaindex";

const ollama = new Ollama({
  model: 'mistral',
  temperature: 0.75,
  baseURL: 'http://localhost:11434',
  embedModel: 'nomic-embed-text'
})

Settings.llm = ollama
Settings.embedModel = ollama

console.log('ollama - ', ollama)

async function main() {
  let nodes = new SimpleNodeParser().getNodesFromDocuments([
    new Document({ text: "I am 10 years old. John is 20 years old." }),
  ]);

  const titleExtractor = new TitleExtractor({
    llm: ollama,
  });

  nodes = await titleExtractor.transform(nodes);

  for (const node of nodes) {
    console.log(node);
    console.log(node.getContent());
    // console.log(node.getContent(MetadataMode.NONE));
  }
}

main().catch(console.error);