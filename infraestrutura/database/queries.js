const conexao = require('./conexao')
//executa a query
const executaQuery = (query, parametros = '') => {
    //cria o evento de retorno usando a função promise, desta forma todo o codigo será executado em paralelo estamos usando o metodo resolve para positivo e reject para negativo
    return new Promise ((resolve, reject) => {
        conexao.query(query, parametros, (erros, resultados, campos) => {
            if (erros) {
                reject(erros)
            } else {
                resolve(resultados)
            }
        })
        
    })
}
module.exports = executaQuery