import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 
});

async function run() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    console.log(`Importando: ${title} - ${description}`);

    try {
      const response = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        })
      });

      if (!response.ok) {
        console.error(`❌ Falha ao importar ${title}: ${response.status}`);
      } else {
        console.log(`✅ ${title} importada com sucesso`);
      }

    } catch (error) {
      console.error(`❌ Erro ao importar ${title}:`, error);
    }
    await wait(100);
  }

  console.log('✅ Importação concluída');
}

run();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
