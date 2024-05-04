import {
    IngestionPipeline,
    TitleExtractor,
    QuestionsAnsweredExtractor,
    Document,
    Ollama,
    Settings
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
    const pipeline = new IngestionPipeline({
      llm: ollama,
      transformations: [
        new TitleExtractor({
            llm: ollama
        }),
        new QuestionsAnsweredExtractor({
          questions: 5,
          llm: ollama
        }),
      ],
    });
  
    const nodes = await pipeline.run({
      documents: [
        new Document({ text: "I am 10 years old. John is 20 years old." }),
      ],
    });
  
    for (const node of nodes) {
      console.log(node.metadata);
    }
  }
  
  main().then(() => console.log("done"));