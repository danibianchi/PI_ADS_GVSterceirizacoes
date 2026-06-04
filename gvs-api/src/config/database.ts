import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;

    console.log('Iniciando conexão com MongoDB...');
    console.log('URI existe?', !!uri);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;