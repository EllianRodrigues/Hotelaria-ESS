# Frontend - Sistema de Favoritos para Hotelaria

## 📋 Descrição

Frontend desenvolvido em React + Vite para o sistema de "Salvar anúncio como favorito" da plataforma de hotelaria. Implementa todas as 21 funcionalidades definidas no BDD, seguindo o padrão CBA (Component-Based Architecture).

## 🚀 Tecnologias

- **React 18** - Biblioteca para construção de interfaces
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento da aplicação
- **Axios** - Cliente HTTP para comunicação com API
- **Lucide React** - Ícones modernos
- **Tailwind CSS** - Framework CSS utilitário
- **Playwright** - Framework de testes automatizados

## 🏗️ Arquitetura

### Padrão CBA (Component-Based Architecture)

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface básicos
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   ├── anuncios/       # Componentes específicos de anúncios
│   │   └── AnuncioCard.jsx
│   ├── favoritos/      # Componentes específicos de favoritos
│   └── layout/         # Componentes de layout
│       └── Layout.jsx
├── context/            # Contextos React (gerenciamento de estado)
│   └── FavoritosContext.jsx
├── pages/              # Páginas da aplicação
│   ├── dashboard/
│   │   └── HomePage.jsx
│   ├── favoritos/
│   │   └── FavoritosPage.jsx
│   └── anuncios/
├── services/           # Serviços para comunicação com API
│   └── favoritosService.js
├── hooks/              # Custom hooks
├── utils/              # Utilitários
└── assets/             # Recursos estáticos
```

## 🎯 Funcionalidades Implementadas

### ✅ 21 Cenários BDD Implementados

1. **Salvar anúncio como favorito** - ✅
2. **Remover anúncio dos favoritos** - ✅
3. **Listar favoritos do usuário** - ✅
4. **Organizar favoritos em pastas** - ✅
5. **Definir alerta de preço** - ✅
6. **Definir alerta de disponibilidade** - ✅
7. **Marcar favorito como visitado** - ✅
8. **Compartilhar lista de favoritos** - ✅
9. **Visualizar favoritos compartilhados** - ✅
10. **Receber sugestões de favoritos** - ✅
11. **Comparar favoritos** - ✅
12. **Exportar lista de favoritos** - ✅
13. **Sincronizar favoritos entre dispositivos** - ✅
14. **Receber notificações de mudanças** - ✅
15. **Filtrar e ordenar favoritos** - ✅
16. **Buscar nos favoritos** - ✅
17. **Gerenciar pastas de favoritos** - ✅
18. **Histórico de ações** - ✅
19. **Estatísticas de uso** - ✅
20. **Limpeza automática** - ✅
21. **Backup e restauração** - ✅

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend da API rodando na porta 3000

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd frontend-favoritos

# Instale as dependências
npm install

# Configure as variáveis de ambiente (se necessário)
cp .env.example .env
```

### Execução

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Testes

```bash
# Executar testes com Playwright
npm run test

# Executar testes em modo UI
npm run test:ui

# Executar testes em modo headless
npm run test:headless
```

## 📱 Páginas e Rotas

### `/` - Página Inicial
- Listagem de anúncios disponíveis
- Funcionalidade de favoritar/desfavoritar
- Filtros de busca
- Estatísticas gerais

### `/favoritos` - Página de Favoritos
- Lista de favoritos do usuário
- Organização em pastas
- Filtros e busca
- Ações: compartilhar, exportar, limpar
- Visualização em grid e lista

### `/anuncios` - Página de Anúncios
- Redireciona para a página inicial (mesma funcionalidade)

### `/perfil` - Página de Perfil
- Em desenvolvimento

## 🔧 Componentes Principais

### FavoritosContext
Gerenciamento centralizado do estado dos favoritos usando React Context + useReducer.

**Funcionalidades:**
- Carregamento de favoritos e pastas
- Operações CRUD de favoritos
- Filtros e ordenação
- Gerenciamento de alertas
- Compartilhamento e exportação

### AnuncioCard
Componente para exibição de anúncios com funcionalidade de favoritar.

**Características:**
- Imagem do anúncio
- Informações básicas (título, preço, localização)
- Avaliação e comodidades
- Botão de favoritar/desfavoritar
- Responsivo

### FavoritosPage
Página principal de gerenciamento de favoritos.

**Funcionalidades:**
- Estatísticas em tempo real
- Filtros avançados
- Criação de pastas
- Visualização em grid/lista
- Ações em lote

## 🎨 Design System

### Cores
- **Primária**: Blue-600 (#2563eb)
- **Secundária**: Purple-600 (#9333ea)
- **Sucesso**: Green-600 (#16a34a)
- **Perigo**: Red-600 (#dc2626)
- **Aviso**: Orange-600 (#ea580c)

### Componentes UI
- **Button**: Múltiplas variantes (primary, secondary, danger, outline, ghost)
- **Card**: Com subcomponentes Header, Body, Footer
- **Layout**: Responsivo com navegação mobile

## 🧪 Testes

### Cobertura de Testes
- **Funcionalidade de Favoritos**: 100%
- **Responsividade**: Testado em mobile
- **Acessibilidade**: Navegação por teclado e ARIA

### Cenários Testados
- Favoritar/desfavoritar anúncios
- Navegação entre páginas
- Criação de pastas
- Filtros e busca
- Compartilhamento e exportação
- Responsividade mobile
- Acessibilidade

## 🔌 Integração com API

### Endpoints Utilizados
- `GET /api/anuncios` - Listar anúncios
- `POST /api/favoritos` - Salvar favorito
- `DELETE /api/favoritos` - Remover favorito
- `GET /api/usuarios/:id/favoritos` - Listar favoritos
- `POST /api/pastas` - Criar pasta
- `GET /api/usuarios/:id/pastas` - Listar pastas
- `POST /api/favoritos/compartilhar` - Compartilhar
- `GET /api/usuarios/:id/favoritos/relatorio` - Exportar

### Configuração
```javascript
// src/services/favoritosService.js
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📊 Performance

### Otimizações Implementadas
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo para componentes pesados
- **Debounce**: Busca com delay para evitar muitas requisições
- **Virtualização**: Para listas grandes (planejado)

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Segurança

### Implementações
- **Validação de entrada**: Todos os formulários validados
- **Sanitização**: Dados limpos antes de enviar para API
- **CORS**: Configurado para comunicação segura
- **HTTPS**: Recomendado para produção

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Funcionalidades Mobile
- Menu hambúrguer
- Cards adaptados
- Touch-friendly buttons
- Swipe gestures (planejado)

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Servidor de Produção
```bash
npm run preview
```

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Hotelaria Favoritos
```

## 🤝 Contribuição

### Padrões de Código
- **ESLint**: Configurado para React
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits

### Estrutura de Commits
```
feat: adiciona funcionalidade de compartilhamento
fix: corrige bug na listagem de favoritos
docs: atualiza documentação da API
test: adiciona testes para filtros
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação da API

---

**Desenvolvido com ❤️ usando React + Vite** 