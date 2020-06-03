let express = require('express');
let fs = require('fs'); // file system para trabalhar com arquivos

let app = express();
app.use(express.json()); // utilizando objetos JSON

// Metodo POST
app.post('/account', (req, res) => {
  let params = req.body; // recebemento os parametros passados no POST

  // Primeiro passo fazer a leitura dos registros existentes
  fs.readFile('./dados/accounts.json', 'utf-8', (err, data) => {
    console.log(err);

    try {
      // Convertendo String para JSON
      let json = JSON.parse(data);
      res.send('post');
      console.log(json);
    } catch (error) {
      res.send();
    }
  });

  //gravando o arquivo
  // JSON.stringify(params) - convertendo o params que é um JSON para String
  // fs.writeFile - substitui o registro existente pelo novo
  // fs.appendFile - inclui um novo registro, mantendo o existente

  /*
  fs.appendFile('./dados/accounts.json', JSON.stringify(params), (err) => {
    console.log(err);
  });
*/
});

// Iniciando a API na porta 3000
app.listen(3000, function () {
  // Ao iniciar a Aplicação, vamos verificar se o arquivo de registro existe
  try {
    fs.readFile('./data/accounts.json', 'utf-8', (err, data) => {
      // Se der erro é porque ele não existe ainda.
      if (err) {
        //Caso não exista, será criado agora
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        fs.writeFile(
          './dados/accounts.json',
          JSON.stringify(initialJson),
          (err) => {
            console.log(err);
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }

  console.log('API Started!');
});
