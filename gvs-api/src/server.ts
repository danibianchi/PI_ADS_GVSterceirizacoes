import 'dotenv/config'; // Carrega as variáveis do .env ANTES de tudo
import app from './app';
import connectDB from './config/database';

// Lê a porta do .env, ou usa 3000 como padrão caso não esteja definida
const PORT = process.env.PORT || 3000;

// Função principal que inicia tudo
const startServer = async () => {
  // Primeiro conecta no banco...
  await connectDB();
  
  // ...depois liga o servidor na porta definida
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
};

startServer();