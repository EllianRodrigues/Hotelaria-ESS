# Testes da API

Este diretório contém os testes automatizados para as rotas da API, baseados nos cenários descritos na pasta `feature`.

## Estrutura dos Testes


### 1. `register.test.js` - Testes de Cadastro
Testa os cenários de cadastro para clientes e hotéis:
- ✅ Cadastro de cliente com sucesso
- ❌ Cadastro com campos obrigatórios em branco
- ❌ Cadastro com CPF já existente
- ✅ Cadastro de hotel com sucesso
- ❌ Cadastro com campos obrigatórios em branco
- ❌ Cadastro com CNPJ já existente

### 2. `auth.test.js` - Testes de Autenticação
Testa os cenários de login para clientes e hotéis:
- ✅ Login de cliente com sucesso
- ❌ Login com CPF ou senha incorretos
- ❌ Login com CPF inexistente
- ✅ Login de hotel com sucesso
- ❌ Login com CNPJ ou senha incorretos
- ❌ Login com CNPJ inexistente

### 3. `password.test.js` - Testes de Edição de Senha
Testa os cenários de edição de senha:
- ✅ Cliente edita senha com sucesso
- ❌ Cliente falha ao editar senha por senha atual incorreta
- ❌ Cliente falha ao editar senha com campos em branco
- ✅ Hotel edita senha com sucesso
- ❌ Hotel falha ao editar senha por senha atual incorreta
- ❌ Hotel falha ao editar senha com campos em branco

## Como Executar os Testes

### Executar todos os testes:
```bash
npm test
```

### Executar um arquivo específico:
```bash
npx mocha tests/register.test.js
npx mocha tests/auth.test.js
npx mocha tests/password.test.js
```

### Executar com mais detalhes:
```bash
npm test -- --reporter spec --timeout 15000
```

## Banco de Dados

### Até esse momento (03/07/25) não limpamos o BD após cada teste, então se for rodar os testes mais de uma vez por favor EXCLUA o BD.
