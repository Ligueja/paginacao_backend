import express from 'express';
const cors = require('cors');
import { v4 as uuidv4 } from "uuid";
import { usuarios } from './usuariosCadastrados';


const app = express();
app.use(express.json());
app.use(cors());




app.get('/', (req, res) => {    
return res.json('OK, servidor rodando normalmente!');
});


app.listen(3030, () => console.log("Servidor iniciado, porta 3030"));




// CADASTRAR USUÁRIOS
app.post("/usuarios", async (req, res) => {
    const body = req.body;
  
    if (body.nome === undefined) {
      return res.status(400).json("Nome não informado!");
    }
  
    if (body.email === undefined) {
      return res.status(400).json("E-mail não informado!");
    }
  
    if (body.senha === undefined) {
      return res.status(400).json("Senha não informada!");
    }
  
    const verificarEmail = usuarios.find((usuario) => {
      return usuario.email === body.email;
    });
  
    if (verificarEmail !== undefined) {
      return res.status(400).json("E-mail já cadastrado!");
    }
  
    const usuario = {
    id: uuidv4(),
    nome: body.nome,
    email: body.email,
    senha: body.senha,
    recados: [],
    };
  
        usuarios.push(usuario);
  
        console.log(usuario);
    
        return res.status(201).json("Usuário criado com sucesso!");
})


// CADASTRAR RECADOS ATRAVÉS DO ID DO USUÁRIOS
app.post("/usuarios/:id/recados", async (req, res) => {
    const body = req.body;
    const usuarioId = req.params.id;
  
    const usuario = usuarios.find((user) => user.id === usuarioId);
  
    if (!usuario) {
      return res.status(404).json("Usuário não encontrado!");
    }
  
    const novoRecado = {
      id: uuidv4(),
      titulo: body.titulo,
      descricao: body.descricao,
    };
  
    usuario.recados.push(novoRecado);
    recados.push(novoRecado);
  
    return res.status(201).json("Recado criado com sucesso!");
  });


//VISUALIZAAR USUÁRIOS CADASRTADOS
app.get("/usuarios", (req, res) => {
    
    let pagina = 1;
    const quantidadeUsuarioPorPagina = 3;

    if (req.query.pagina) {
        pagina = req.query.pagina
      }
    
    
    if (usuarios.length < 1) {
      return res.status(404).json("Nenhum usuário cadastrado!");
    }
  
   const quantiaPaginas = Math.ceil(usuarios.length / quantidadeUsuarioPorPagina);
   
   const usuariosComPaginacao = usuarios.slice(quantidadeUsuarioPorPagina * (pagina - 1), quantidadeUsuarioPorPagina * pagina)

   console.log(usuariosComPaginacao, "usuários")

   return res.json({
   usuarios: usuariosComPaginacao,
   quantiaPaginas
    })

  });
