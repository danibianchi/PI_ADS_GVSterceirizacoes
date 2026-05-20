import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Cria a instância principal da aplicação Express
const app = express();

// MIDDLEWARES — são funções que processam TODA requisição antes de chegar nas rotas
// helmet() adiciona cabeçalhos de segurança HTTP automaticamente
app.use(helmet());

// cors() permite que o front-end (rodando em outro endereço) acesse nossa API
app.use(cors());

// express.json() ensina o Express a entender requisições com corpo em JSON
// Sem isso, req.body seria undefined em POST e PUT
app.use(express.json());

// Rota de teste — só pra confirmar que a API está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API GVS Terceirizações funcionando! 🚀' });
});

export default app;