var express = require('express')
var router = express.Router()
var Edicao = require('../models/edicao')
var Musica = require('../models/musica')

// GET /edicoes
router.get('/edicoes', function (req, res) {
    const filtro = {}
    if (req.query.org) filtro.organizacao = req.query.org

    Edicao.find(filtro, { _id: 1, anoEdicao: 1, organizacao: 1, vencedor: 1 })
        .then(edicoes => res.send(edicoes))
        .catch(err => res.status(500).send(err))
})


// GET /edicoes/musicas (todas as músicas)
router.get('/edicoes/musicas', async function (req, res) {
    try {
        const musicas = await Musica.find({})
        res.send(musicas)
    } catch (err) {
        res.status(500).send(err)
    }
})


// GET /paises?papel=org ou papel=venc
router.get('/paises', async function (req, res) {
    try {
        const papel = req.query.papel
        if (papel === 'org') {
            const orgs = await Edicao.aggregate([
                { $match: { organizacao: { $ne: "" } } },
                {
                    $group: {
                        _id: "$organizacao",
                        anos: { $push: "$anoEdicao" }
                    }
                },
                { $sort: { _id: 1 } }
            ])
            res.send(orgs.map(o => ({ pais: o._id, anos: o.anos })))
        } else if (papel === 'venc') {
            const vencedores = await Edicao.aggregate([
                { $match: { vencedor: { $ne: "" } } },
                {
                    $group: {
                        _id: "$vencedor",
                        anos: { $push: "$anoEdicao" }
                    }
                },
                { $sort: { _id: 1 } }
            ])
            res.send(vencedores.map(v => ({ pais: v._id, anos: v.anos })))
        } else {
            res.status(400).send({ erro: "Parâmetro 'papel' inválido" })
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

// GET /interpretes
router.get('/interpretes', async function (req, res) {
    try {
        const resultado = await Musica.aggregate([
            {
                $group: {
                    _id: { nome: "$interprete", pais: "$pais" }
                }
            },
            {
                $sort: { "_id.nome": 1 }
            }
        ])
        res.send(resultado.map(r => ({ nome: r._id.nome, pais: r._id.pais })))
    } catch (err) {
        res.status(500).send(err)
    }
})

// GET /edicoes/:id (com músicas)
router.get('/edicoes/:id', async function (req, res) {
    try {
        const edicao = await Edicao.findById(req.params.id)
        if (!edicao) return res.status(404).send()

        const musicas = await Musica.find({ edicao: req.params.id })

        const edicaoCompleta = edicao.toObject()
        edicaoCompleta.musicas = musicas

        res.send(edicaoCompleta)
    } catch (err) {
        res.status(500).send(err)
    }
})

// POST /edicoes (com músicas incluídas no body)
router.post('/edicoes', async function (req, res) {
    try {
        const { musicas, ...dadosEdicao } = req.body

        const novaEdicao = await Edicao.create(dadosEdicao)

        if (Array.isArray(musicas)) {
            const musicasComEdicao = musicas.map(m => ({ ...m, edicao: novaEdicao._id }))
            await Musica.insertMany(musicasComEdicao)
        }

        res.send(novaEdicao)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.put('/edicoes/:id', async function (req, res) {
    try {
        const { musicas, ...dadosEdicao } = req.body

        const edicaoAtualizada = await Edicao.findByIdAndUpdate(
            req.params.id,
            dadosEdicao,
            { new: true }
        )

        if (!edicaoAtualizada) return res.status(404).send()

        if (Array.isArray(musicas)) {
            // Apagar músicas antigas associadas à edição
            await Musica.deleteMany({ edicao: req.params.id })

            // Inserir novas músicas com o ID da edição atualizado
            const novasMusicas = musicas.map(m => ({ ...m, edicao: req.params.id }))
            await Musica.insertMany(novasMusicas)
        }

        res.send(edicaoAtualizada)
    } catch (err) {
        res.status(500).send(err)
    }
})


// DELETE /edicoes/:id
// DELETE /edicoes/:id (também apaga músicas associadas)
router.delete('/edicoes/:id', async function (req, res) {
    try {
        const edicaoRemovida = await Edicao.findByIdAndDelete(req.params.id)
        if (!edicaoRemovida) return res.status(404).send()

        await Musica.deleteMany({ edicao: req.params.id })

        res.send(edicaoRemovida)
    } catch (err) {
        res.status(500).send(err)
    }
})



module.exports = router
