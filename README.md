<div align="center">
  <img src="frontend/logo.png" alt="GVS Logo" width="200" />
  <h1>GVS Terceirizações</h1>
  <p><strong>Sistema de Gestão de Clientes, Prestadores e Ordens de Serviço</strong></p>
</div>

<br/>

## 🎯 Sobre o Projeto

O **GVS Terceirizações** é um sistema completo (API RESTful + Interface Web) desenvolvido para modernizar e centralizar a gestão de empresas de terceirização. Este projeto foi concebido e construído como requisito para o Projeto Interdisciplinar.

O foco central da aplicação é fornecer uma infraestrutura de dados rápida, segura e escalável para o gerenciamento de contratos complexos que envolvem múltiplas entidades (Cliente Solicitante e Prestador Executor), além de uma interface visual rica e responsiva para facilitar a operação diária.

---

## ✨ Funcionalidades Principais

- ⚙️ **Processamento Backend:** API estruturada com validação restrita de dados de entrada e regras de negócio robustas (ex: validação de CNPJ e proteção de duplicidade de registros).
- 🏢 **Gestão de Clientes:** Cadastro e controle de clientes com contato rápido via WhatsApp integrado.
- 👷 **Gestão de Prestadores:** Gerenciamento de profissionais terceirizados, especialidades e disponibilidade de agenda.
- 📄 **Contratos e Vínculos:** Criação de contratos firmados entre um Cliente e um Prestador.
- 🛠️ **Ordens de Serviço (OS):** Emissão e acompanhamento de chamados vinculados diretamente a contratos existentes.
- 🔍 **Auditoria Dinâmica:** Log detalhado de ações realizadas no sistema.

---

## 💻 Tecnologias Utilizadas

### 1. Backend (API REST)
A arquitetura do servidor foi construída aplicando rigorosamente os conceitos de engenharia de software e a **Arquitetura em Camadas** abordada nas aulas da disciplina de Linguagem de Programação do **Professor Felipe**. A separação de responsabilidades foi implementada seguindo o modelo:

- **Node.js + Express**
- **Zod:** Implementação de _Schemas_ para validação forte de dados logo na entrada do sistema, garantindo que o banco de dados não receba lixo.
- **Routes:** Definição clara de rotas (URLs e métodos HTTP).
- **Controllers:** Camada responsável por adaptar o mundo HTTP, disparar a validação Zod e devolver respostas padronizadas em JSON com os respectivos *Status Codes*.
- **Services:** Isolamento absoluto das regras de negócio (garantindo validações ativas de integridade e consultas prévias, como checagem de CNPJ duplicado).
- **Repositories & Models:** Abstração do acesso aos dados via banco não relacional (Mongoose/MongoDB) e definição estrita das entidades do sistema.
- **Tratamento de Erros (Middlewares):** Uso da classe `AppError` e de um *Error Handler Middleware* centralizado. Exceções são lançadas na camada de *Service* e formatadas elegantemente sem repetição de blocos *try/catch* confusos.

### 2. Frontend (Interface Web)
Para complementar a API, construímos uma interface de usuário rica, rápida e sem o peso de frameworks externos, focando nos fundamentos da Web:

- **HTML5 & CSS3 Vanilla**
- **JavaScript ES6+:** Consumo assíncrono (`async/await`) e nativo (`fetch`) da nossa API REST para a renderização dinâmica do DOM (tabelas, modais, alertas).
- **Design UI/UX:** Estilização moderna utilizando a técnica de *Glassmorphism* (elementos translúcidos), alertas customizados e tabelas totalmente responsivas com ordenação e paginação no lado do cliente.
- **Segurança Nativa:** Uso da *Web Crypto API (SHA-256)* nativa do navegador para proteção de tráfego de senhas.

---

## 🚀 Como Acessar e Executar

### 🌐 Acesso Online (Recomendado)
O projeto completo já está integrado e publicado na nuvem. Você pode testar o sistema ao vivo acessando o nosso link oficial:

👉 **[Acessar GVS Terceirizações (Netlify)](https://gvs-sistema.netlify.app)**

 *(A API backend está hospedada gratuitamente no Render.com, o que significa que as primeiras requisições podem demorar alguns segundos para "acordar" o servidor).*

### 💻 Execução Local
Se você deseja inspecionar e rodar o projeto na sua máquina:
```bash
# 1. Clone o repositório
git clone https://github.com/lbpb293/PI_ADS_GVSterceirizacoes.git
cd PI_ADS_GVSterceirizacoes

# 2. Rode o Frontend
# Abra o arquivo index.html (dentro da pasta frontend/) no seu navegador ou utilize a extensão Live Server do VSCode.
```

---

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido pelos alunos do **2º semestre de Análise e Desenvolvimento de Sistemas (ADS)** da **Faculdade de Tecnologia de Indaiatuba Dr. Archimedes Lammoglia**:

- **Daniela Bianchi** 
- **Matheus Croce** 
- **Luis Pessanha** 
- **Kevin Peruci** 

---
<div align="center">
  <small>Desenvolvido com dedicação para o Projeto Interdisciplinar</small>
</div>
