const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
    }),
);
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', routes);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
