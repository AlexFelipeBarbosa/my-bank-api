let express = require('express');
let fs = require('fs'); // file system para trabalhar com arquivos
const dataLink = './dados/account.json'; // caminho do Json (registros)

let app = express();
app.use(express.json()); // utilizando objetos JSON

// Metodo POST
app.post('/account', (req, res) => {
  let account = req.body; // recebemento os parametros passados no POST
  // Primeiro passo fazer a leitura dos registros existentes
  fs.readFile(dataLink, 'utf-8', (err, data) => {
    if (!err) {
      try {
        // Convertendo String para JSON
        let json = JSON.parse(data);
        account = { id: json.nextId, ...account }; // ... pega toda a estrutura do account
        json.nextId++; // incrementando o ID
        json.accounts.push(account); // inserindo o novo account

        //Escrevendo no account
        fs.writeFile(dataLink, JSON.stringify(json), (err) => {
          if (err) {
            res.status(400).send({ error: err.message });
          } else {
            res.end();
          }
        });
      } catch (error) {
        res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: err.message });
    }
  });

  //gravando o arquivo
  // JSON.stringify(params) - convertendo o params que é um JSON para String
  // fs.writeFile - substitui o registro existente pelo novo
  // fs.appendFile - inclui um novo registro, mantendo o existente

  /*
  fs.appendFile(dataLink, JSON.stringify(params), (err) => {
    console.log(err);
  });
*/
});

// Metodo GET
// Retornando todos os registros.
app.get('/account', (_, res) => {
  // ler o arquivo accounts.json
  fs.readFile(dataLink, 'utf8', (err, data) => {
    if (!err) {
      let dataJson = JSON.parse(data);
      delete dataJson.nextId; // retirando o nextId, ou seja o nextId não será retornado no GET
      res.send(dataJson);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

// Iniciando a API na porta 3000
app.listen(3000, function () {
  // Ao iniciar a Aplicação, vamos verificar se o arquivo de registro existe
  try {
    fs.readFile(dataLink, 'utf8', (err, data) => {
      // Se der erro é porque ele não existe ainda.
      if (err) {
        //Caso não exista, será criado agora
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        fs.writeFile(dataLink, JSON.stringify(initialJson), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  console.log('API Started!');
});
