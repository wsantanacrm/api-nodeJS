const moment = require('moment')
const atendimentos = require('../controllers/atendimentos')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res){
        //valida formato da data com a biblioteca moment
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        //valida se a data é maior que a data de criação
        const dataValida = moment(data).isSameOrAfter(dataCriacao)
        //valida se a propridade cliente é maior que 5  
        const clienteValido = atendimento.cliente.length >=5

        //objeto de validação
        const validacoes = [
            {
                nome: 'data',
                valido: dataValida,
                mensagem: 'Data de agendamento é maior que a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                mensagem: 'Cliente deve ter mais que 5 caracteres'
            }
        ]
        //filtra se existem erros
        const erros = validacoes.filter(campo => !campo.valido)
        //valida tamanho do erro
        const existemErros = erros.length

        //valida se existem erros e direciona para erro ou sucesso 
        if(existemErros){
            res.status(400).json(erros)
        } else {
        const atendimentoDatado = {...atendimento, dataCriacao, data}
        const sql = `INSERT INTO atendimentos SET ?`
        conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                res.status(201).json(resultados)
            }   
        })}
    }

    lista(res){
        const sql =`SELECT * FROM Atendimentos`
        conexao.query(sql, (erro, resultados) => {
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                res.status(201).json(resultados)
            }   
        })
    }
    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`
        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                res.status(200).json(atendimento)
            }   
        })
    }

    altera(id, valores, res){
        if (valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`
        conexao.query(sql,[valores, id], (erro, resultados) => {
        //const retorno = [id, valores]
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                res.status(201).json({...valores, id})
            }  
        })
    }
    deleta(id, res){
        const sql = `DELETE FROM Atendimentos WHERE id=${id}`
        conexao.query(sql, (erro, resultados) => {
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                res.status(201).json({id})
            }   
        })
    }
}

module.exports = new Atendimento