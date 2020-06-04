import express from 'express';
import { promises } from 'fs'; // file system para trabalhar com arquivos
import winston from 'winston'; // trabalhar com logs
import accountsRouter from './routes/accounts.js';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

const app = express();

global.fileName = './dados/accounts.json'; // caminho do Json (registros)

// Definindo o formato do log
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly', // nivel do log
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/my-bank-api.log' }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

app.use(express.json()); // utilizando objetos JSON
app.use('/account', accountsRouter);

// Iniciando a API na porta 3000 *** Utilizando Promise agora
app.listen(3000, async () => {
  try {
    await readFile(global.fileName, 'utf8');
    logger.info('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.fileName, JSON.stringify(initialJson)).catch((err) => {
      logger.error(err);
    });
  }
});
