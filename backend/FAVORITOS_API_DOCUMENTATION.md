# API de Favoritos - Documentação

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Favoritos

#### 1.1 Salvar Anúncio como Favorito
**POST** `/favoritos`

Salva um anúncio como favorito para um usuário.

**Body:**
```json
{
  "usuario_id": 1,
  "anuncio_id": 1,
  "pasta_id": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Anúncio salvo como favorito com sucesso",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "anuncio_id": 1,
    "pasta_id": 1,
    "data_salvamento": "2024-01-15T10:30:00.000Z",
    "mensagem": "Anúncio salvo como favorito com sucesso"
  }
}
```

#### 1.2 Remover Favorito
**DELETE** `/favoritos`

Remove um anúncio dos favoritos.

**Body:**
```json
{
  "usuario_id": 1,
  "anuncio_id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Favorito removido com sucesso",
  "data": {
    "mensagem": "Favorito removido com sucesso",
    "anuncio_id": 1
  }
}
```

#### 1.3 Verificar se Anúncio é Favorito
**GET** `/favoritos/verificar?usuario_id=1&anuncio_id=1`

Verifica se um anúncio está nos favoritos do usuário.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "is_favorito": true,
    "favorito_id": 1,
    "pasta_id": 1
  }
}
```

#### 1.4 Listar Favoritos do Usuário
**GET** `/usuarios/:usuario_id/favoritos`

Lista todos os favoritos de um usuário com filtros opcionais.

**Query Parameters:**
- `pasta_id` - Filtrar por pasta
- `visitado` - Filtrar por visitados (true/false)
- `ordenacao` - Campo para ordenação (data_salvamento, preco_por_noite, avaliacao_media)
- `direcao` - Direção da ordenação (ASC/DESC)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "anuncio": {
        "id": 1,
        "titulo": "Quarto Padrão com Vista para o Mar",
        "descricao": "Quarto confortável com vista deslumbrante para o oceano",
        "preco_por_noite": 100.00,
        "localizacao": "Copacabana, Rio de Janeiro",
        "avaliacao_media": 4.5,
        "numero_avaliacoes": 127,
        "comodidades": "Wi-Fi, TV, Ar condicionado, Frigobar",
        "politica_cancelamento": "Cancelamento gratuito até 24h antes"
      },
      "pasta": {
        "id": 1,
        "nome": "Viagem de Férias",
        "cor": "#28a745"
      },
      "data_salvamento": "2024-01-10T10:30:00.000Z",
      "visitado": false,
      "data_visita": null,
      "comentarios_pessoais": null,
      "alerta_preco": null,
      "alerta_disponibilidade": true
    }
  ],
  "total": 1
}
```

### 2. Pastas

#### 2.1 Criar Pasta
**POST** `/pastas`

Cria uma nova pasta para organizar favoritos.

**Body:**
```json
{
  "usuario_id": 1,
  "nome": "Viagem de Férias",
  "descricao": "Quartos para as próximas férias",
  "cor": "#28a745"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pasta criada com sucesso",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "nome": "Viagem de Férias",
    "descricao": "Quartos para as próximas férias",
    "cor": "#28a745",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2.2 Listar Pastas do Usuário
**GET** `/usuarios/:usuario_id/pastas`

Lista todas as pastas de um usuário.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "usuario_id": 1,
      "nome": "Viagem de Férias",
      "descricao": "Quartos para as próximas férias",
      "cor": "#28a745",
      "created_at": "2024-01-10T10:30:00.000Z",
      "total_favoritos": 2
    }
  ],
  "total": 1
}
```

#### 2.3 Mover Favorito para Pasta
**POST** `/favoritos/mover-pasta`

Move um favorito para uma pasta específica.

**Body:**
```json
{
  "usuario_id": 1,
  "favorito_id": 1,
  "pasta_id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Favorito movido com sucesso",
  "data": {
    "mensagem": "Favorito movido para pasta com sucesso",
    "favorito_id": 1,
    "pasta_id": 1
  }
}
```

### 3. Alertas

#### 3.1 Definir Alerta de Preço
**POST** `/favoritos/alerta-preco`

Define um alerta de preço para um favorito.

**Body:**
```json
{
  "usuario_id": 1,
  "favorito_id": 1,
  "preco_maximo": 80.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alerta de preço definido com sucesso",
  "data": {
    "mensagem": "Alerta de preço definido com sucesso",
    "favorito_id": 1,
    "preco_maximo": 80.00
  }
}
```

#### 3.2 Definir Alerta de Disponibilidade
**POST** `/favoritos/alerta-disponibilidade`

Define um alerta de disponibilidade para um favorito.

**Body:**
```json
{
  "usuario_id": 1,
  "favorito_id": 1,
  "data_inicio": "2024-02-01",
  "data_fim": "2024-02-05"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alerta de disponibilidade definido com sucesso",
  "data": {
    "mensagem": "Alerta de disponibilidade definido com sucesso",
    "favorito_id": 1,
    "data_inicio": "2024-02-01",
    "data_fim": "2024-02-05"
  }
}
```

### 4. Compartilhamento

#### 4.1 Compartilhar Favoritos
**POST** `/favoritos/compartilhar`

Gera um link para compartilhar favoritos.

**Body:**
```json
{
  "usuario_id": 1,
  "tipo": "lista",
  "dados_compartilhados": null
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Link de compartilhamento gerado com sucesso",
  "data": {
    "codigo_unico": "abc123def456",
    "link_compartilhamento": "http://localhost:3000/api/favoritos/compartilhado/abc123def456",
    "expira_em": "2024-01-22T10:30:00.000Z"
  }
}
```

#### 4.2 Visualizar Favoritos Compartilhados
**GET** `/favoritos/compartilhado/:codigo`

Visualiza favoritos compartilhados através de um link.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "compartilhamento": {
      "usuario": "João Silva",
      "tipo": "lista",
      "visualizacoes": 1,
      "expira_em": "2024-01-22T10:30:00.000Z"
    },
    "favoritos": [...]
  }
}
```

### 5. Sugestões e Comparação

#### 5.1 Gerar Sugestões
**GET** `/usuarios/:usuario_id/sugestoes?limite=5`

Gera sugestões baseadas nos favoritos do usuário.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "titulo": "Quarto Premium",
      "descricao": "Quarto premium com vista para a cidade",
      "preco_por_noite": 150.00,
      "localizacao": "Centro, São Paulo",
      "avaliacao_media": 4.3,
      "score": 0.85,
      "motivo": "Baseado em seus favoritos"
    }
  ],
  "total": 1
}
```

#### 5.2 Comparar Favoritos
**POST** `/favoritos/comparar`

Compara múltiplos favoritos lado a lado.

**Body:**
```json
{
  "usuario_id": 1,
  "favorito_ids": [1, 2, 3]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "comparacao": [
      {
        "id": 1,
        "titulo": "Quarto Padrão com Vista para o Mar",
        "preco_por_noite": 100.00,
        "localizacao": "Copacabana, Rio de Janeiro",
        "avaliacao_media": 4.5,
        "comodidades": "Wi-Fi, TV, Ar condicionado, Frigobar",
        "politica_cancelamento": "Cancelamento gratuito até 24h antes"
      }
    ],
    "total_comparados": 1
  }
}
```

### 6. Gerenciamento

#### 6.1 Marcar como Visitado
**POST** `/favoritos/marcar-visitado`

Marca um favorito como visitado.

**Body:**
```json
{
  "usuario_id": 1,
  "favorito_id": 1,
  "comentarios": "Quarto muito confortável!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Favorito marcado como visitado",
  "data": {
    "mensagem": "Favorito marcado como visitado",
    "favorito_id": 1,
    "data_visita": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 6.2 Limpar Favoritos Antigos
**DELETE** `/usuarios/:usuario_id/favoritos/limpar-antigos?meses=6`

Remove favoritos antigos automaticamente.

**Response (200):**
```json
{
  "success": true,
  "message": "2 favoritos antigos foram removidos",
  "data": {
    "mensagem": "2 favoritos antigos foram removidos",
    "favoritos_removidos": 2
  }
}
```

#### 6.3 Gerar Relatório
**GET** `/usuarios/:usuario_id/favoritos/relatorio`

Gera um relatório completo dos favoritos.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_favoritos": 5,
    "favoritos_visitados": 2,
    "favoritos_organizados": 3,
    "media_avaliacao": 4.4,
    "faixa_preco": {
      "menor": 100.00,
      "maior": 500.00
    },
    "novos_esta_semana": 1
  }
}
```

### 7. Anúncios

#### 7.1 Listar Anúncios
**GET** `/anuncios`

Lista todos os anúncios disponíveis.

**Response (200):**
```json
[
  {
    "id": 1,
    "room_id": 1,
    "titulo": "Quarto Padrão com Vista para o Mar",
    "descricao": "Quarto confortável com vista deslumbrante para o oceano",
    "preco_por_noite": 100.00,
    "localizacao": "Copacabana, Rio de Janeiro",
    "avaliacao_media": 4.5,
    "numero_avaliacoes": 127,
    "comodidades": "Wi-Fi, TV, Ar condicionado, Frigobar",
    "politica_cancelamento": "Cancelamento gratuito até 24h antes",
    "status": "ativo"
  }
]
```

#### 7.2 Buscar Anúncio por ID
**GET** `/anuncios/:id`

Busca um anúncio específico.

**Response (200):**
```json
{
  "id": 1,
  "room_id": 1,
  "titulo": "Quarto Padrão com Vista para o Mar",
  "descricao": "Quarto confortável com vista deslumbrante para o oceano",
  "preco_por_noite": 100.00,
  "localizacao": "Copacabana, Rio de Janeiro",
  "avaliacao_media": 4.5,
  "numero_avaliacoes": 127,
  "comodidades": "Wi-Fi, TV, Ar condicionado, Frigobar",
  "politica_cancelamento": "Cancelamento gratuito até 24h antes",
  "status": "ativo"
}
```

### 8. Usuários

#### 8.1 Listar Usuários
**GET** `/usuarios`

Lista todos os usuários.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "data_nascimento": "1990-05-15"
  }
]
```

#### 8.2 Criar Usuário
**POST** `/usuarios`

Cria um novo usuário.

**Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "senha123",
  "telefone": "11888888888",
  "data_nascimento": "1985-08-22"
}
```

**Response (201):**
```json
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "telefone": "11888888888",
  "data_nascimento": "1985-08-22"
}
```

### 9. Notificações

#### 9.1 Listar Notificações
**GET** `/usuarios/:usuario_id/notificacoes?lida=false`

Lista notificações do usuário.

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "favorito_id": 1,
    "tipo": "preco",
    "titulo": "Preço Reduzido!",
    "mensagem": "O preço do seu favorito foi reduzido",
    "dados_adicional": "{\"preco_anterior\": 120, \"preco_atual\": 100}",
    "lida": 0,
    "enviada": 1,
    "canal": "email",
    "created_at": "2024-01-15T10:30:00.000Z",
    "anuncio_titulo": "Quarto Padrão com Vista para o Mar"
  }
]
```

#### 9.2 Marcar Notificação como Lida
**PUT** `/notificacoes/:id/marcar-lida`

Marca uma notificação como lida.

**Response (200):**
```json
{
  "message": "Notificação marcada como lida"
}
```

### 10. Histórico

#### 10.1 Histórico de Favoritos
**GET** `/usuarios/:usuario_id/historico-favoritos?acao=salvar&limit=50`

Lista o histórico de ações nos favoritos.

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "anuncio_id": 1,
    "acao": "salvar",
    "dados_anteriores": null,
    "dados_novos": "{\"pasta_id\": 1}",
    "created_at": "2024-01-15T10:30:00.000Z",
    "anuncio_titulo": "Quarto Padrão com Vista para o Mar"
  }
]
```

### 11. Estatísticas

#### 11.1 Estatísticas de Favoritos
**GET** `/usuarios/:usuario_id/estatisticas-favoritos`

Gera estatísticas completas dos favoritos.

**Response (200):**
```json
{
  "total_favoritos": 5,
  "favoritos_visitados": 2,
  "favoritos_organizados": 3,
  "novos_esta_semana": 1,
  "novos_este_mes": 3,
  "media_avaliacao": 4.4,
  "menor_preco": 100.00,
  "maior_preco": 500.00,
  "preco_medio": 250.00
}
```

### 12. Exportação

#### 12.1 Exportar Favoritos
**GET** `/usuarios/:usuario_id/favoritos/exportar?formato=json`

Exporta favoritos em diferentes formatos.

**Query Parameters:**
- `formato` - Formato de exportação (json/csv)

**Response (200):**
```json
{
  "usuario_id": 1,
  "total_favoritos": 5,
  "data_exportacao": "2024-01-15T10:30:00.000Z",
  "favoritos": [...]
}
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **404**: Recurso não encontrado
- **409**: Conflito (ex: anúncio já favoritado)
- **500**: Erro interno do servidor

## Exemplos de Uso

### Exemplo 1: Salvar favorito
```bash
curl -X POST http://localhost:3000/api/favoritos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "anuncio_id": 1,
    "pasta_id": 1
  }'
```

### Exemplo 2: Listar favoritos
```bash
curl -X GET "http://localhost:3000/api/usuarios/1/favoritos?ordenacao=preco_por_noite&direcao=ASC"
```

### Exemplo 3: Criar pasta
```bash
curl -X POST http://localhost:3000/api/pastas \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "nome": "Viagem de Férias",
    "descricao": "Quartos para as próximas férias",
    "cor": "#28a745"
  }'
```

### Exemplo 4: Definir alerta de preço
```bash
curl -X POST http://localhost:3000/api/favoritos/alerta-preco \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "favorito_id": 1,
    "preco_maximo": 80.00
  }'
```

### Exemplo 5: Compartilhar favoritos
```bash
curl -X POST http://localhost:3000/api/favoritos/compartilhar \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "tipo": "lista"
  }'
```

### Exemplo 6: Comparar favoritos
```bash
curl -X POST http://localhost:3000/api/favoritos/comparar \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "favorito_ids": [1, 2, 3]
  }'
```

## Funcionalidades Implementadas

✅ **Cenário 1**: Salvar anúncio como favorito
✅ **Cenário 2**: Salvar múltiplos anúncios como favoritos
✅ **Cenário 3**: Remover anúncio dos favoritos
✅ **Cenário 4**: Visualizar lista de favoritos
✅ **Cenário 5**: Receber notificação de disponibilidade
✅ **Cenário 6**: Receber notificação de promoção
✅ **Cenário 7**: Compartilhar lista de favoritos
✅ **Cenário 8**: Exportar lista de favoritos
✅ **Cenário 9**: Adicionar anúncio já favoritado
✅ **Cenário 10**: Salvar anúncio indisponível como favorito
✅ **Cenário 11**: Definir alerta de preço
✅ **Cenário 12**: Organizar favoritos em pastas
✅ **Cenário 13**: Sincronizar favoritos entre dispositivos
✅ **Cenário 14**: Limpar favoritos antigos
✅ **Cenário 15**: Comparar favoritos
✅ **Cenário 16**: Receber sugestões baseadas em favoritos
✅ **Cenário 17**: Definir preferências de notificação
✅ **Cenário 18**: Marcar favorito como "Já visitado"
✅ **Cenário 19**: Compartilhar favorito específico
✅ **Cenário 20**: Receber relatório semanal de favoritos
✅ **Cenário 21**: Migrar favoritos de conta antiga

Todos os cenários da feature `salvar_anuncio_favorito.feature` foram implementados no backend! 