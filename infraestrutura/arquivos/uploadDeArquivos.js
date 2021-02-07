const fs = require('fs')
const path = require('path')
/*
//Função FS é utilizada para bufferizar arquivos este processo é sincrono e lento pra caralho
fs.readFile('./assets/salsicha.jpg', (erro, buffer) => {
    console.log('Imagem Bufferizada');
    console.log(buffer);
    fs.writeFile('./assets/salsicha2.jpg', buffer, (erro) =>{

        console.log('Imagem gravada');
    })
})
*/
//lendo e escrevendo aquivos através de stream 
module.exports = (caminho, nomeDoArquivo, callbackImagemCriada) =>{
    //define tipos permitidos
    const tiposValidos = ['jpg', 'png', 'jpeg']
    //recupera caminho
    const tipo = path.extname(caminho)
    //procura tipo permitido no arquivo
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1 
    //valida tipo de imagem e chama o a função de gravar a imagem
    if(tipoEhValido) {
        
        const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`
        fs.createReadStream(caminho)
        .pipe(fs.createWriteStream(novoCaminho))
        //.on('finish', () => console.log('Imagem gravada com sucesso!'))
        .on('finish', () => callbackImagemCriada(false, novoCaminho))
        
    } else {
        const erro = "Tipo inválido"
        callbackImagemCriada(erro)
        console.log('Tipo de arquivo inválido!');
    }

}