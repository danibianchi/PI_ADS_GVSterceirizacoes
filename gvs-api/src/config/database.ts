import mongoose from 'mongoose';

// Esta função conecta nossa API ao banco de dados MongoDB
// Ela é "async" porque conectar ao banco leva um tempo (operação de rede)
const connectDB = async (): Promise<void> => {
  try {
    // process.env.MONGODB_URI lê a variável do arquivo .env
    const uri = process.env.MONGODB_URI as string;
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    // Se deu erro (senha errada, sem internet, etc), mostra o problema e encerra
    console.error('❌ Erro ao conectar no MongoDB:', error);
    process.exit(1); // Encerra o processo com código de erro
  }
};

export default connectDB;