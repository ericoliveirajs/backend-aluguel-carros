<div align="center">

# 🚗 Guardians API — Sistema de Aluguel de Carros  
**Teste Técnico Happmobi**

API Restful completa desenvolvida com **Nest.js**, **TypeScript** e **MongoDB**, voltada ao gerenciamento de reservas de veículos.  
100% funcional, testada, monitorada e implantada em nuvem ☁️

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Jest](https://img.shields.io/badge/Tests-96%25-brightgreen?style=for-the-badge&logo=jest&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#)
[![Railway](https://img.shields.io/badge/Deploy-Railway-000000?style=for-the-badge&logo=railway&logoColor=white)](#)
[![Sentry](https://img.shields.io/badge/Monitoring-Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](#)

---

</div>

## 🌐 Links do Deploy

🔹 **API (Railway):** [backend-aluguel-carros-production.up.railway.app](http://backend-aluguel-carros-production.up.railway.app)  
🔹 **Swagger (Documentação):** [backend-aluguel-carros-production.up.railway.app/api](http://backend-aluguel-carros-production.up.railway.app/api)

---

## ✨ Features e Diferenciais

> Projeto desenvolvido com foco em **boas práticas**, **segurança**, **testabilidade** e **observabilidade**.

### ⚙️ Funcionalidades Principais

- 🔑 **Autenticação JWT:** `Cadastro` e `Login` seguros via token.
- 🚘 **Gerenciamento de Veículos:** CRUD completo (`/vehicles`).
- 📅 **Reservas de Veículos:** Criar e cancelar reservas (`/reservations`).
- 🧩 **Regras de Negócio Críticas:**
  - Usuário não pode reservar mais de um veículo (**409 Conflict**)
  - Veículo já reservado não pode ser reservado novamente (**409 Conflict**)
  - Veículo reservado não pode ser deletado (**409 Conflict**)
  - Ao deletar o usuário, sua reserva é automaticamente removida (**deleção em cascata**)

---

## 🧠 Diferenciais Técnicos (DevSecOps)

### 🔐 Segurança (RBAC - Roles Guard)
- Rotas administrativas (`POST`, `PATCH`, `DELETE` em `/vehicles`) protegidas e acessíveis apenas por usuários **admin**.
- Rotas públicas (`GET /vehicles`) disponíveis a todos os usuários autenticados.

### 🧪 Testes Unitários (Jest)
- Cobertura de **+96%** nas lógicas críticas (`AuthService` e `ReservationsService`).
- Testes em **controllers** e **services** asseguram compilação e injeção de dependências corretas.

### 📊 Monitoramento (Sentry)
- Totalmente instrumentada com **Sentry.io**.
- Qualquer erro não tratado (500) é automaticamente reportado no painel de monitoramento.

### 📘 Documentação (Swagger)
- API 100% documentada e hospedada publicamente em `/api`.

### 🐳 Deploy (Docker & PaaS)
- Aplicação **containerizada** com `Dockerfile` multi-stage otimizado.
- Deploy contínuo via **Railway**, conectado à branch `develop`.
- Banco de dados hospedado no **MongoDB Atlas**.

---

## 🚀 Como Rodar o Projeto Localmente

### 🧭 1. Usando Docker (Recomendado)

> O método mais rápido e confiável.  
> Certifique-se de ter o **Docker Desktop** rodando.

```bash
# 1. Clone o repositório
git clone https://github.com/ericoliveirajs/backend-aluguel-carros.git
cd backend-aluguel-carros

# 2. Suba os contêineres (API + Banco de Dados)
docker-compose up --build

### 💻 2. Usando NPM (Ambiente Local)

```bash
# 1. Clone o repositório
git clone https://github.com/ericoliveirajs/backend-aluguel-carros.git
cd backend-aluguel-carros

# 2. Instale as dependências
npm install

Garanta que há uma instância do MongoDB rodando localmente
(ou utilize sua string do MongoDB Atlas).

Crie o arquivo .env na raiz do projeto e adicione:

MONGO_URI=<sua-string-de-conexao>
JWT_SECRET=<sua-chave-secreta>

Rode o servidor:

npm run start:dev


A API estará disponível em:
👉 http://localhost:3000
