const pets = require('../controllers/pets');
const conexao = require('../infraestrutura/database/conexao')
const uploadDeArquivo = require('../infraestrutura/arquivos/uploadDeArquivos')

class Pet{
    adicioina(pet, res){
        const query = 'INSERT INTO Pets SET?'
        uploadDeArquivo(pet.imagem, pet.nome, (erro, novoCaminho) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                const novoPet = { nome: pet.nome, imagem: novoCaminho }
                conexao.query(query, novoPet, erro =>{
                    if(erro){
                        console.log(erro);
                        res.status(400).json(erro)
                    } else {
                        //console.log(res);
                        res.status(201).json(novoPet)
                    }
                })
                
            }
        })
    }
}

module.exports = new Pet()  