const express = require('express');
const cors = require('cors');
const app = express();

const router = require('./router');
require('./services/db');

app.use(cors());
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT || 3000, () => {
  console.log('App listening on port ' + PORT);
});