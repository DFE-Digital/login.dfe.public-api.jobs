const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const listifyObject = (obj, title) => {
  const list = obj ? Object.keys(obj).map(name => {
    const value = obj[name];
    return `\n    * ${name}: ${value}`
  }).join('') : '';
  return `  ${title}:${list}`;
};

const handler = (req, res) => {
  const headers = listifyObject(req.headers, 'Headers');
  const body = listifyObject(req.body, 'Body');
  console.log(`Received a ${req.method} request to ${req.url}\n${headers}\n${body}`);
  res.send();
};

app.use(bodyParser.json());

app.post('/error/server-error', (req, res) => {
  res.status(500).send();
});

app.get('*', handler);
app.post('*', handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
