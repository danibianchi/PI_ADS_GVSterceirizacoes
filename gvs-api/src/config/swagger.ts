import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GVS Terceirizações — API',
      version: '1.0.0',
      description: 'API RESTful do sistema de gestão de Clientes, Prestadores e Ordens de Serviço da GVS Terceirizações.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor Local' },
      { url: 'https://gvs-api.onrender.com', description: 'Servidor de Produção (Render)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login. Exemplo: Bearer eyJhbG...',
        },
      },
      schemas: {
        Login: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', example: 'admin@gvs.com' },
            senha: { type: 'string', example: 'Admin@123' },
          },
        },
        Register: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Novo Usuario' },
            email: { type: 'string', example: 'novo@gvs.com' },
            senha: { type: 'string', example: 'Senha@123' },
          },
        },
        Cliente: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nomeFantasia: { type: 'string', example: 'Empresa ABC' },
            razaoSocial: { type: 'string', example: 'Empresa ABC LTDA' },
            cnpj: { type: 'string', example: '12.345.678/0001-99' },
            email: { type: 'string', example: 'contato@abc.com' },
            telefone: { type: 'string', example: '(11) 91234-5678' },
            status: { type: 'string', enum: ['ativo', 'inativo'], example: 'ativo' },
          },
        },
        Prestador: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nome: { type: 'string', example: 'João Silva' },
            cpf: { type: 'string', example: '123.456.789-00' },
            especialidade: { type: 'string', example: 'Elétrica' },
            email: { type: 'string', example: 'joao@email.com' },
            telefone: { type: 'string', example: '(11) 91234-5678' },
            status: { type: 'string', enum: ['disponivel', 'indisponivel'], example: 'disponivel' },
          },
        },
        Contrato: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            clienteId: { type: 'string', example: '664abc...' },
            prestadorId: { type: 'string', example: '664def...' },
            dataInicio: { type: 'string', format: 'date', example: '2025-01-01' },
            dataFim: { type: 'string', format: 'date', example: '2025-12-31' },
            valor: { type: 'number', example: 5000 },
            status: { type: 'string', enum: ['ativo', 'encerrado'], example: 'ativo' },
          },
        },
        OrdemServico: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            contratoId: { type: 'string', example: '664abc...' },
            descricao: { type: 'string', example: 'Manutenção elétrica no setor B' },
            status: { type: 'string', enum: ['aberta', 'em_andamento', 'concluida'], example: 'aberta' },
            dataCriacao: { type: 'string', format: 'date' },
          },
        },
        Historico: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            acao: { type: 'string', example: 'Criou cliente Empresa ABC' },
            usuario: { type: 'string', example: 'Admin GVS' },
            documentoId: { type: 'string' },
            criadoEm: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/api/auth/login': {
        post: {
          tags: ['🔒 Autenticação'],
          summary: 'Login no sistema',
          description: 'Autentica o usuário e retorna um token JWT para uso nas demais rotas.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } },
          },
          responses: {
            200: { description: 'Login realizado com sucesso. Retorna o token JWT.' },
            401: { description: 'E-mail ou senha inválidos.' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['🔒 Autenticação'],
          summary: 'Registrar novo usuário',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Register' } } },
          },
          responses: {
            201: { description: 'Usuário criado com sucesso.' },
            409: { description: 'E-mail já cadastrado.' },
          },
        },
      },
      '/api/clientes': {
        get: {
          tags: ['🏢 Clientes'],
          summary: 'Listar todos os clientes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de clientes.' } },
        },
        post: {
          tags: ['🏢 Clientes'],
          summary: 'Criar novo cliente',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cliente' } } },
          },
          responses: { 201: { description: 'Cliente criado.' } },
        },
      },
      '/api/clientes/{id}': {
        get: {
          tags: ['🏢 Clientes'],
          summary: 'Buscar cliente por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Dados do cliente.' }, 404: { description: 'Cliente não encontrado.' } },
        },
        put: {
          tags: ['🏢 Clientes'],
          summary: 'Atualizar cliente',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cliente' } } },
          },
          responses: { 200: { description: 'Cliente atualizado.' } },
        },
        delete: {
          tags: ['🏢 Clientes'],
          summary: 'Remover cliente',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Cliente removido.' } },
        },
      },
      '/api/prestadores': {
        get: {
          tags: ['👷 Prestadores'],
          summary: 'Listar todos os prestadores',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de prestadores.' } },
        },
        post: {
          tags: ['👷 Prestadores'],
          summary: 'Criar novo prestador',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Prestador' } } },
          },
          responses: { 201: { description: 'Prestador criado.' } },
        },
      },
      '/api/prestadores/{id}': {
        get: {
          tags: ['👷 Prestadores'],
          summary: 'Buscar prestador por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Dados do prestador.' } },
        },
        put: {
          tags: ['👷 Prestadores'],
          summary: 'Atualizar prestador',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Prestador' } } },
          },
          responses: { 200: { description: 'Prestador atualizado.' } },
        },
        delete: {
          tags: ['👷 Prestadores'],
          summary: 'Remover prestador',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Prestador removido.' } },
        },
      },
      '/api/contratos': {
        get: {
          tags: ['🤝 Contratos'],
          summary: 'Listar todos os contratos',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de contratos.' } },
        },
        post: {
          tags: ['🤝 Contratos'],
          summary: 'Criar novo contrato',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Contrato' } } },
          },
          responses: { 201: { description: 'Contrato criado.' } },
        },
      },
      '/api/contratos/{id}': {
        get: {
          tags: ['🤝 Contratos'],
          summary: 'Buscar contrato por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Dados do contrato.' } },
        },
        put: {
          tags: ['🤝 Contratos'],
          summary: 'Atualizar contrato',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Contrato' } } },
          },
          responses: { 200: { description: 'Contrato atualizado.' } },
        },
        delete: {
          tags: ['🤝 Contratos'],
          summary: 'Remover contrato',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Contrato removido.' } },
        },
      },
      '/api/ordens-servico': {
        get: {
          tags: ['📋 Ordens de Serviço'],
          summary: 'Listar todas as ordens de serviço',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de ordens de serviço.' } },
        },
        post: {
          tags: ['📋 Ordens de Serviço'],
          summary: 'Criar nova ordem de serviço',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OrdemServico' } } },
          },
          responses: { 201: { description: 'Ordem de serviço criada.' } },
        },
      },
      '/api/ordens-servico/{id}': {
        get: {
          tags: ['📋 Ordens de Serviço'],
          summary: 'Buscar ordem de serviço por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Dados da ordem de serviço.' } },
        },
        put: {
          tags: ['📋 Ordens de Serviço'],
          summary: 'Atualizar ordem de serviço',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OrdemServico' } } },
          },
          responses: { 200: { description: 'Ordem de serviço atualizada.' } },
        },
        delete: {
          tags: ['📋 Ordens de Serviço'],
          summary: 'Remover ordem de serviço',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Ordem de serviço removida.' } },
        },
      },
      '/api/historico': {
        get: {
          tags: ['🔍 Histórico / Auditoria'],
          summary: 'Listar todo o histórico de ações',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de registros de auditoria.' } },
        },
        post: {
          tags: ['🔍 Histórico / Auditoria'],
          summary: 'Registrar uma ação no histórico',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Historico' } } },
          },
          responses: { 201: { description: 'Ação registrada.' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
