var mongoose = require('mongoose');

var musicaSchema = new mongoose.Schema({
    _id: String,
    titulo: String,
    pais: String,
    compositor: String,
    interprete: String,
    letra: String,
    link: String,
    edicao: String
}, { versionKey: false });

module.exports = mongoose.model('Musica', musicaSchema, 'musicas'); 
