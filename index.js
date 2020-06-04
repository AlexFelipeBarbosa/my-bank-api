let express = require('express');
let fs = require('fs').promises; // file system para trabalhar com arquivos
global.fileName = './dados/accounts.json'; // caminho do Json (registros)

let app = express();
let accountsRouter = require('./routes/accounts.js');

app.use(express.json()); // utilizando objetos JSON
app.use('/account', accountsRouter);

// Iniciando a API na porta 3000
/*
app.listen(3000, function () {
  // Ao iniciar a Aplicação, vamos verificar se o arquivo de registro existe
  try {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
      // Se der erro é porque ele não existe ainda.
      if (err) {
        //Caso não exista, será criado agora
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        fs.writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
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
*/
// Iniciando a API na porta 3000 *** Utilizando Promise agora
app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName, 'utf8');
    console.log('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    fs.writeFile(globa.fileName, JSON.stringify(initialJson)).catch((err) => {
      console.log(err);
    });
  }
});
