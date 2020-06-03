let express = require('express');
let app = express();

app.get('/', function (req, res) {
  res.send('Hello Word');
});

// Metodo POST
app.post('/account', (req, res) => {
  console.log('post');
});

app.listen(3000, function () {
  console.log('API Started!');
});
