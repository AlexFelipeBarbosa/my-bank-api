let express = require('express');
let fs = require('fs'); // file system para trabalhar com arquivos
var router = express.Router();

// Metodo POST
router.post('/', (req, res) => {
  let account = req.body; // recebemento os parametros passados no POST
  // Primeiro passo fazer a leitura dos registros existentes
  fs.readFile(global.fileName, 'utf-8', (err, data) => {
    if (!err) {
      try {
        // Convertendo String para JSON
        let json = JSON.parse(data);
        account = { id: json.nextId, ...account }; // ... pega toda a estrutura do account
        json.nextId++; // incrementando o ID
        json.accounts.push(account); // inserindo o novo account

        //Escrevendo no account
        fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
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
  fs.appendFile(global.fileName, JSON.stringify(params), (err) => {
    console.log(err);
  });
*/
});

// Metodo GET
// Retornando todos os registros.
router.get('/', (_, res) => {
  // ler o arquivo accounts.json
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    if (!err) {
      let dataJson = JSON.parse(data);
      delete dataJson.nextId; // retirando o nextId, ou seja o nextId não será retornado no GET
      res.send(dataJson);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

// Metodo GET - por ID
router.get('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      const account = json.accounts.find(
        (account) => account.id === parseInt(req.params.id)
      );
      if (account) {
        res.send(account);
      } else {
        res.end();
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

// Metodo DELETE
router.delete('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      // deletando o ID
      let accounts = json.accounts.filter(
        (account) => account.id !== parseInt(req.params.id)
      );
      json.accounts = accounts;
      //Escrevendo no account, ja desconsirando o ID que foi retirado.
      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

// Metodo PUT
router.put('/', (req, res) => {
  let newAccount = req.body;
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let oldIndex = json.accounts.findIndex(
        (account) => account.id === newAccount.id
      );

      //json.accounts[oldIndex] = newAccount;
      json.accounts[oldIndex].name = newAccount.name;
      json.accounts[oldIndex].balance = newAccount.balance;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

// Metodo para Depositar ou Sacar
router.post('/transaction', (req, res) => {
  let params = req.body;
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let index = json.accounts.findIndex(
        (account) => account.id === params.id
      );

      if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
        throw new Error('Não possui saldo suficiente!');
      }

      json.accounts[index].balance += parseInt(params.value);

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.send(json.accounts[index]);
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;
