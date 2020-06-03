var express = require('express');
var fs = require('fs'); // file system para trabalhar com arquivos

var app = express();
app.use(express.json()); // utilizando objetos JSON

app.get('/', function (req, res) {
  res.send('Hello Word');
});

// Metodo POST
app.post('/account', (req, res) => {
  let params = req.body; // recebemento os parametros passados no POST

  //gravando o arquivo
  // JSON.stringify(params) - convertendo o params que é um JSON para String
  // fs.writeFile - substitui o registro existente pelo novo
  // fs.appendFile - inclui um novo registro, mantendo o existente
  fs.appendFile('./dados/accounts.json', JSON.stringify(params), (err) => {
    console.log(err);
  });

  res.send('post');
});

app.listen(3000, function () {
  console.log('API Started!');
});
