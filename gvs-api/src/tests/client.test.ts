import request from 'supertest';
import app from '../app';
import { connectDBForTesting, clearDBForTesting, disconnectDBForTesting } from './setup';
import { beforeAll, afterAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.setTimeout(60000); // 60 segundos para dar tempo do banco em memória ligar

let token: string;

beforeAll(async () => {
  await connectDBForTesting();

  // Cria um usuário e faz login para obter o token para os testes
  await request(app).post('/api/auth/register').send({
    nome: 'Admin Teste Clientes',
    email: 'admin.clientes@teste.com',
    senha: 'senha123'
  });

  const resLogin = await request(app).post('/api/auth/login').send({
    email: 'admin.clientes@teste.com',
    senha: 'senha123'
  });

  token = resLogin.body.token;
});

afterEach(async () => {
  await clearDBForTesting();
});

afterAll(async () => {
  await disconnectDBForTesting();
});

describe('👥 Clientes da API', () => {

  it('Deve bloquear o acesso se não enviar o Token (Status 401)', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.status).toBe(401);
    expect(res.body.erro).toBe('Token de autenticação não fornecido');
  });

  it('Deve criar um cliente com sucesso (Status 201)', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        razao_social: 'Empresa Teste LTDA',
        cnpj: '11.222.333/0001-44',
        email: 'contato@empresateste.com.br',
        telefone: '(11) 99999-8888',
        status: 'ativo'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.razao_social).toBe('Empresa Teste LTDA');
  });

  it('Não deve criar cliente se faltar campo obrigatório do Zod (Status 400)', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        // Faltam campos obrigatórios
        razao_social: 'Empresa Incompleta'
      });

    expect(res.status).toBe(400);
    // O Zod vai reclamar do CNPJ faltando no array de "detalhes"
    expect(res.body).toHaveProperty('detalhes');
  });
});
