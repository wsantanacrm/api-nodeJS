const moment = require('moment')
const axios = require('axios')
//const atendimentos = require('../controllers/atendimentos')
const conexao = require('../infraestrutura/database/conexao')
const repositorio = require('../repositorios/atendimentos')

class Atendimento {
    constructor(){
        //valida se a data é maior que a data de criação
        this.dataValida = ({data, dataCriacao}) => moment(data).isSameOrAfter(dataCriacao)
        //valida se a propridade cliente é maior que 5  
        this.clienteEhValido = ({tamanho}) => tamanho > 5
        this.valida = parametros => 
        this.validacoes.filter(campo => {
            const { nome } = campo
            const parametro = parametros[nome]

            return !campo.valido(parametro)
        })
        //objeto de validação
        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataValida,
                mensagem: 'Data de agendamento é maior que a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]
        
    }
    adiciona(atendimento){
        
        //valida formato da data com a biblioteca moment
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM')
        
        //objeto de validação  do campo data e cliente
        const parametros ={
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }
        
        //filtra se existem erros
        //const erros = validacoes.filter(campo => !campo.valido)
        //valida tamanho do erro
        const erros = this.valida(parametros)
        const existemErros = erros.length
        //const teste = atendimento.cliente.length
        //console.log(teste);
        //valida se existem erros e direciona para erro ou sucesso 
        if(existemErros){
            //crio o promessa de envio do erro, como neste eventou estou tratando apenas o que foi recusado, não escrevi o resolve no objeto, quem vai devolver o erro para o client é a classe controller
            return new Promise((resolve, reject) => reject(erros))
            //res.status(400).json(erros)
        } else {
        const atendimentoDatado = {...atendimento, dataCriacao, data}
        //chama a função de promise adiciona e passa o parametro do atendimentoDatado
        return repositorio.adiciona(atendimentoDatado)
            .then(resultados => {
                const id = resultados.insertId
                return ({...atendimentoDatado, id} )

            })
       /* processo de conexão manual foi eliminado e agora utilizamos o metodo de promessa 
       conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                const id = resultados.insertId
                res.status(201).json({...atendimentoDatado, id}  )
            }   
        })*/
        }
    }

    lista(){
 /*       foi removido o parametro res da função, pois agora será retornado através de uma promessa
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
        */
       return repositorio.lista()
    }
    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`
        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0]
            const cpf = atendimento.cliente
            if(erro){
                //console.log(erro);
                res.status(400).json(erro)

            } else {
                //console.log(resultados);
                //verifica cliente em outra API
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data
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