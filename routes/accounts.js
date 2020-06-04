let express = require('express');
let router = express.Router();
let fs = require('fs').promises; // file system para trabalhar com arquivos

// Metodo POST
router.post('/', async (req, res) => {
  let account = req.body;
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };
    json.accounts.push(account);
    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.end();

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST / account - Erro: ${err.message}`);
  }
});

// Metodo GET
// Retornando todos os registros.
router.get('/', async (_, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
    logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET / account - Erro: ${err.message}`);
  }
});

// Metodo GET - por ID
router.get('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const account = json.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    if (account) {
      res.send(account);
      logger.info(`GET /account/id - ${JSON.stringify(account)}`);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET / account/id - Erro: ${err.message}`);
  }
});

// Metodo DELETE
router.delete('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    // deletando o ID
    let accounts = json.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    json.accounts = accounts;
    //Escrevendo no account, ja desconsirando o ID que foi retirado.
    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.end();
    logger.info(`DELETE /account/id - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE / account/id - Erro: ${err.message}`);
  }
});

// Metodo PUT
router.put('/', async (req, res) => {
  try {
    let newAccount = req.body;
    let data = await fs.readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);
    let oldIndex = json.accounts.findIndex(
      (account) => account.id === newAccount.id
    );

    //json.accounts[oldIndex] = newAccount;
    json.accounts[oldIndex].name = newAccount.name;
    json.accounts[oldIndex].balance = newAccount.balance;

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.end();
    logger.info(`PUT /account - ${JSON.stringify(newAccount)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /account - Erro: ${err.message}`);
  }
});

// Metodo para Depositar ou Sacar
router.post('/transaction', async (req, res) => {
  try {
    let params = req.body;
    let data = await fs.readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);
    let index = json.accounts.findIndex((account) => account.id === params.id);

    if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
      throw new Error('Não possui saldo suficiente!');
    }

    json.accounts[index].balance += parseInt(params.value);

    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.send(json.accounts[index]);
    logger.info(`POST /transaction - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /transaction - Erro: ${err.message}`);
  }
});

module.exports = router;
