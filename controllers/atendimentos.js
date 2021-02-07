const Atendimento = require('../models/atendimentos')

module.exports = app =>  {
    app.get('/atendimentos', (req, res) => {
        Atendimento.lista()
            .then(resultados => res.status(200).json(resultados))
            .catch(erros => res.status(400).json(erros))
    })

    app.get('/atendimentos/:id', (req, res) => {
        //converte id em inteiro
        const id = parseInt(req.params.id)
        //console.log(req.params)
        Atendimento.buscaPorId(id, res)
        //res.send('Ok')
    })

    app.post('/atendimentos', (req, res) => {
        //recupera body
        const atendimento = req.body
        console.log(atendimento);
        Atendimento.adiciona(atendimento)
            .then(atendimentoCadastrado => 
            res.status(201).json(atendimentoCadastrado)
            )
            .catch(erros =>  res.status(400).json(erros))
        //console.log(req.body)
        //res.send('Enviando dados')
    })

    app.patch('/atendimentos/:id', (req, res) =>{
        const id = parseInt(req.params.id)
        const valores = req.body
        Atendimento.altera(id, valores, res)
        //console.log('ok');
    })

    app.delete('/atendimentos/:id',(req, res) =>{
        const id = parseInt(req.params.id)
        Atendimento.deleta(id, res)
    })
}
