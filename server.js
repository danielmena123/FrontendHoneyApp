//install express server
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/front-end'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/front-end/'}),
);

app.listen(process.env.PORT || 8080);