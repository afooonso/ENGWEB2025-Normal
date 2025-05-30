const mongoose = require('mongoose');

var edicaoSchema = new mongoose.Schema({
    _id: String,
    anoEdicao: String,
    organizacao: String,
    vencedor: String
}, {
    versionKey: false  
});

module.exports = mongoose.model('Edicao', edicaoSchema, 'edicoes');
