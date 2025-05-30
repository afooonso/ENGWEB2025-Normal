var express = require('express');
var router = express.Router();
var axios = require('axios');

const apiDados = "http://backend:25000";

// Página principal: lista de edições ordenada por ano
router.get('/', function (req, res) {
  axios.get(apiDados + "/edicoes").then((response) => {
    const edicoesOrdenadas = response.data.sort((a, b) => a.anoEdicao.localeCompare(b.anoEdicao))
    res.render('index', { edicoes: edicoesOrdenadas });
  }).catch((error) => {
    res.render('error', { error: error });
  });
});

// Página de uma edição específica (com músicas)
router.get('/:id', function (req, res) {
  axios.get(`${apiDados}/edicoes/${req.params.id}`).then((response) => {
    res.render('edicao', { edicao: response.data });
  }).catch((error) => {
    res.render('error', { error: error });
  });
});

// Página de um país (edições organizadas e participações)
router.get('/paises/:nome', async function (req, res) {
  try {
    const nome = req.params.nome;

    const [org, venc, musicas] = await Promise.all([
      axios.get(apiDados + "/paises?papel=org"),
      axios.get(apiDados + "/paises?papel=venc"),
      axios.get(apiDados + "/edicoes/musicas")
    ])

    const orgData = org.data.find(p => p.pais === nome);
    const vencData = venc.data.find(p => p.pais === nome);

    const musicasPais = musicas.data.filter(m => m.pais === nome)
    const participou = musicasPais.map(m => ({
      edicao: m.edicao,
      titulo: m.titulo,
      interprete: m.interprete,
      venceu: vencData ? vencData.anos.includes(m.edicao.replace('ed', '')) : false
    }))

    const organizou = (orgData ? orgData.anos : []).map(ano => ({
      id: 'ed' + ano,
      ano: ano
    }))

    res.render('pais', {
      nome: nome,
      organizou: organizou,
      participou: participou
    });
  } catch (error) {
    res.render('error', { error: error });
  }
});

module.exports = router;
