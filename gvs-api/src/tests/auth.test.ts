import request from 'supertest';
import app from '../app';
import { connectDBForTesting, clearDBForTesting, disconnectDBForTesting } from './setup';
import { beforeAll, afterAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.setTimeout(60000); // 60 segundos para dar tempo do banco em memória ligar

// Hook do Jest rodar as funções de setup do Banco em Memória
beforeAll(async () => {
  await connectDBForTesting();
});

afterEach(async () => {
  await clearDBForTesting();
});

afterAll(async () => {
  await disconnectDBForTesting();
});

describe('🔐 Autenticação da API (Auth)', () => {
  
  it('Deve registrar um novo usuário com sucesso (Status 201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Usuario Teste',
        email: 'teste@email.com',
        senha: 'senha-super-segura'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Usuario Teste');
    expect(res.body.email).toBe('teste@email.com');
  });

  it('Não deve registrar usuário se o email já estiver em uso (Status 400)', async () => {
    // Primeiro cria um usuário
    await request(app).post('/api/auth/register').send({
      nome: 'Usuario Um',
      email: 'duplicado@email.com',
      senha: 'senha1'
    });

    // Tenta criar outro com mesmo email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Usuario Dois',
        email: 'duplicado@email.com',
        senha: 'senha2'
      });

    expect(res.status).toBe(409); // O Controller lança Conflict (409) para emails duplicados
    expect(res.body.erro).toBe('E-mail já cadastrado');
  });

  it('Deve fazer login e retornar um token JWT válido (Status 200)', async () => {
    // Primeiro cria o usuário para ter com quem logar
    await request(app).post('/api/auth/register').send({
      nome: 'Usuario Login',
      email: 'login@email.com',
      senha: 'minha-senha'
    });

    // Tenta logar
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@email.com',
        senha: 'minha-senha'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.nome).toBe('Usuario Login');
  });

  it('Não deve fazer login com senha incorreta (Status 401)', async () => {
    // Primeiro cria o usuário
    await request(app).post('/api/auth/register').send({
      nome: 'Usuario Erro',
      email: 'erro@email.com',
      senha: 'senha-certa'
    });

    // Tenta logar com senha errada
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'erro@email.com',
        senha: 'senha-errada'
      });

    expect(res.status).toBe(401);
    expect(res.body.erro).toBe('E-mail ou senha inválidos');
  });
});
