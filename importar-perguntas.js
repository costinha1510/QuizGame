
require("dotenv").config();

const fs = require("fs");
const Parse = require("parse/node");

async function importarPerguntas() {
  // Verifica se as chaves estão configuradas
  if (
    !process.env.APP_ID ||
    !process.env.JAVASCRIPT_KEY ||
    !process.env.MASTER_KEY
  ) {
    throw new Error("Verifique as chaves no arquivo .env");
  }

  // Conecta ao Back4App
  Parse.initialize(
    process.env.APP_ID,
    process.env.JAVASCRIPT_KEY,
    process.env.MASTER_KEY
  );

  Parse.serverURL = "https://parseapi.back4app.com/";

  // Lê o arquivo JSON
  const dados = JSON.parse(
    fs.readFileSync("./perguntas_cloudquiz.json", "utf8")
  );

  const perguntas = dados.results;

  if (!Array.isArray(perguntas) || perguntas.length !== 100) {
    throw new Error("Esperadas 100 questões no arquivo.");
  }

  // Confere se já existem questões na classe
  const consulta = new Parse.Query("Question");
  const quantidade = await consulta.count({ useMasterKey: true });

  if (quantidade > 0) {
    throw new Error(
      `A classe Question já possui ${quantidade} registros. Importação cancelada para evitar duplicações.`
    );
  }

  // Divide em lotes de 50
  for (let i = 0; i < perguntas.length; i += 50) {
    const lote = perguntas.slice(i, i + 50);

    const objetos = lote.map((pergunta) => {
      const Questao = Parse.Object.extend("Question");
      const objeto = new Questao();

      objeto.set("text", pergunta.text);
      objeto.set("options", pergunta.options);
      objeto.set("correctIndex", pergunta.correctIndex);
      objeto.set("category", pergunta.category);

      return objeto;
    });

    await Parse.Object.saveAll(objetos, { useMasterKey: true });

    console.log(`Importadas ${Math.min(i + 50, perguntas.length)} de 100`);
  }

  console.log("Importação concluída com sucesso!");
}

importarPerguntas().catch((erro) => {
  console.error("Erro na importação:", erro.message);
  process.exitCode = 1;
});
