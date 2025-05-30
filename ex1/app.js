var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var edicoesRouter = require('./routes/edicoes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://mongodb/eurovisao', );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o banco de dados:'));
db.once('open', function () {
    console.log('Conexão com o banco de dados realizada com sucesso!');
});

app.use('/', edicoesRouter);

module.exports = app;
