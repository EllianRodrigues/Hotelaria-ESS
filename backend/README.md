# Express SQLite MVC API

Este projeto é uma API RESTful construída com **Node.js**, **Express**, **SQLite** e segue a arquitetura **MVC**.

---

## 📁 Estrutura do Projeto

```
backend/
├── controllers/
├── data/
├── models/
├── routes/
├── server.js
├── db.js
├── package.json
├── Dockerfile
├── docker-compose.yml
└── docker-compose.override.yml (usado no modo dev)
```

---

## 🚀 Executando Localmente

### 1. Instale as dependências:
```bash
npm install
```

### 2. Execute em modo produção:
```bash
npm start
```

### 3. Execute em modo desenvolvimento (com `nodemon`):
```bash
npm run dev
```

---

## 🐳 Executando com Docker

### 1. Build da imagem:
```bash
docker build -t express-sqlite-mvc-api .
```

### 2. Rodar o container:
```bash
docker run -p 3000:3000 express-sqlite-mvc-api
```

---

## 🐳 Executando com Docker Compose

### ▶️ Modo Produção:
```bash
docker-compose up --build
```

### 💻 Modo Desenvolvimento (com hot reload + bind mount):
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

A API estará disponível em:  
📍 [http://localhost:3000](http://localhost:3000)

---

## 🐞 Debug com VS Code (modo dev)

1. Certifique-se de estar usando `docker-compose.override.yml` com a porta `9229` exposta:
   ```yaml
   ports:
     - "9229:9229"
   command: npx nodemon --inspect=0.0.0.0:9229 server.js
   ```

2. Crie o arquivo `.vscode/launch.json` com:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug: Dockerized Node.js",
         "type": "node",
         "request": "attach",
         "port": 9229,
         "address": "localhost",
         "restart": true,
         "localRoot": "${workspaceFolder}",
         "remoteRoot": "/app",
         "protocol": "inspector",
         "skipFiles": ["<node_internals>/**"]
       }
     ]
   }
   ```

---

## 📦 Scripts úteis (`package.json`)

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon --inspect=0.0.0.0:9229 server.js"
}
```

---

## 🌐 Endpoints da API

### 📄 Users
- `GET    /api/users` – Lista todos os usuários
- `POST   /api/users` – Cria um novo usuário

### 🛏️ Rooms
- `GET    /api/rooms` – Lista todos os quartos
- `GET    /api/rooms/:id` – Retorna um quarto por ID
- `POST   /api/rooms` – Cria um novo quarto
- `PATCH  /api/rooms/:id` – Atualiza parcialmente um quarto
- `DELETE /api/rooms/:id` – Remove um quarto