<div align="center">
  <img src="logo.png" alt="GVS Logo" width="200" />
  <h1>GVS Terceirizações</h1>
  <p><strong>Sistema de Gestão de Clientes, Prestadores e Ordens de Serviço</strong></p>
</div>

<br/>

## 🎯 Sobre o Projeto

O **GVS Terceirizações** é um sistema corporativo completo (API RESTful + Interface Web) desenvolvido para modernizar a gestão de empresas provedoras de mão de obra. Este projeto foi construído do absoluto zero como requisito do **Projeto Interdisciplinar** (2º Semestre de ADS).

O foco central da aplicação é fornecer uma infraestrutura de dados **rápida, segura e escalável** na nuvem, capaz de gerenciar entidades complexas (Clientes e Prestadores unidos por Contratos), aliada a uma interface visual premium (*Glassmorphism*) e de altíssima performance.

---

## ⚙️ Funcionalidades Principais

- 🔒 **Sistema de Autenticação Segura:** Login protegido com **JWT (JSON Web Tokens)** e senhas criptografadas com **Bcrypt** no banco de dados.
- 🏢 **Gestão de Clientes:** Cadastro, validação restrita de CNPJ e controle de status de contratantes.
- 👷 **Gestão de Prestadores:** Gerenciamento de profissionais terceirizados, especialidades e disponibilidade de agenda em tempo real.
- 🤝 **Contratos Inteligentes:** Criação de vínculos contratuais entre um Cliente e um Prestador, calculando vigência e valores.
- 📑 **Ordens de Serviço (OS):** Emissão e acompanhamento de chamados e manutenções vinculados diretamente a contratos ativos.
- 🔍 **Auditoria Dinâmica:** Log automático de ações realizadas no sistema (Histórico de quem criou/alterou registros).

---

## 🛠️ Arquitetura e Tecnologias

### 1. Backend (O Motor do Sistema)
O servidor foi construído aplicando rigorosamente o **Padrão Clean Architecture**, isolando lógicas de negócios e garantindo escalabilidade.

- **Node.js, TypeScript e Express:** Construção da API RESTful com forte tipagem estática.
- **Camadas Isoladas:** Separação rígida em `Routes`, `Controllers`, `Services`, e `Repositories` (Padrão SOLID).
- **Zod:** Implementação de _Schemas_ para validação pesada de dados na entrada do sistema, garantindo integridade.
- **Autenticação:** Proteção de rotas via `auth.middleware.ts` interceptando Tokens JWT.
- **Mongoose & MongoDB Atlas:** Modelagem orientada a documentos na nuvem, utilizando relacionamentos complexos (`.populate()`) para amarrar Clientes e Prestadores.
- **Swagger (Documentação Viva):** Documentação interativa na rota `/api-docs` para testes visuais rápidos com a funcionalidade "Try it out".

### 2. Frontend (A Vitrine Estática)
Uma interface de usuário rica, desenhada sem a dependência de frameworks compiladores (React/Angular), extraindo a máxima velocidade dos navegadores web:

- **HTML5, CSS3 & JavaScript Vanilla (ES6+)**
- **Interceptor de Rede (apiFetch):** Um wrapper customizado nativo que anexa automaticamente o crachá JWT de sessão no cabeçalho (*Authorization Bearer*) de todas as chamadas HTTP. Redirecionamento automático em caso de token expirado (Erro 401).
- **Tratamento Avançado no Front:** Busca inteligente nas tabelas ignorando letras acentuadas e tradução dinâmica de status do banco de dados na tela de exibição.
- **Design UI/UX Premium:** Estilização com *Glassmorphism*, tabelas responsivas, paginação no cliente e alertas personalizados.

---

## 🚀 Como Acessar e Executar

### 🌐 Acesso Online (Em Produção)
O projeto completo possui uma arquitetura desacoplada na nuvem. Você pode testar o sistema ao vivo acessando o link oficial:

🔗 **[Acessar Frontend GVS (Netlify)](https://gvs-sistema.netlify.app)**

 *(A API backend está hospedada gratuitamente no **Render.com**. Por ser um plano gratuito, as primeiras requisições do dia podem demorar alguns segundos para "acordar" o servidor).*

### 💻 Execução Local (Modo Offline)
Se você deseja inspecionar ou rodar o backend localmente na sua máquina para a apresentação:
```bash
# 1. Clone o repositório
git clone https://github.com/lbpb293/PI_ADS_GVSterceirizacoes.git
cd PI_ADS_GVSterceirizacoes

# 2. Inicie a API Backend
cd gvs-api
npm install
npm run dev
# O servidor rodará na porta http://localhost:3000

# 3. Rode o Frontend
# Abra o arquivo index.html (dentro da pasta raiz ou deploy-netlify) no seu navegador, ou utilize a extensão Live Server do VSCode.
```

---

## 🎓 Equipe de Desenvolvimento

Projeto desenvolvido pelos alunos do **2º semestre de Análise e Desenvolvimento de Sistemas (ADS)** da **Faculdade de Tecnologia de Indaiatuba Dr. Archimedes Lammoglia**:

- **Daniela Bianchi** 
- **Matheus Croce** 
- **Luis Pessanha** 
- **Kevin Peruci** 

---
<div align="center">
  <small>Desenvolvido para o Projeto Interdisciplinar</small>
</div>
