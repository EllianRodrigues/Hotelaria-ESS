# API de Hotelaria - Documentação

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Reservas

#### 1.1 Criar Reserva
**POST** `/reservas`

Cria uma nova reserva com cálculo automático de valor.

**Body:**
```json
{
  "name": "Reserva João Silva",
  "start_date": "2024-01-15",
  "end_date": "2024-01-17",
  "room_id": 1,
  "hospede_id": 1,
  "numero_hospedes": 2,
  "servicos": [1, 2, 3],
  "codigo_promocional": "VERAO2024",
  "opcao_cancelamento": "gratuito",
  "parcelas": 3
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Reserva João Silva",
  "start_date": "2024-01-15",
  "end_date": "2024-01-17",
  "room_id": 1,
  "hospede_id": 1,
  "valor": 450.50,
  "valor_original": 500.00,
  "desconto": 49.50,
  "numero_hospedes": 2,
  "parcelas": 3,
  "valor_parcela": 150.17,
  "status": "pendente",
  "detalhes_calculo": {
    "valor_base": 200.00,
    "taxa_ocupacao": 0,
    "valor_servicos": 120.00,
    "desconto_temporada": 30.00,
    "desconto_promocional": 19.50,
    "valor_impostos": 17.00,
    "taxa_cancelamento": 20.00,
    "impostos": [
      {
        "id": 1,
        "nome": "ISS",
        "percentual": 5,
        "valor": 10.00
      },
      {
        "id": 2,
        "nome": "Taxa de Turismo",
        "percentual": 2,
        "valor": 4.00
      },
      {
        "id": 3,
        "nome": "Taxa de Serviço",
        "percentual": 10,
        "valor": 20.00
      }
    ],
    "dias": 2,
    "tipo_quarto": "padrao",
    "capacidade_maxima": 2
  }
}
```

#### 1.2 Buscar Reserva por ID
**GET** `/reservas/:id`

**Response (200):**
```json
{
  "id": 1,
  "name": "Reserva João Silva",
  "start_date": "2024-01-15",
  "end_date": "2024-01-17",
  "room_id": 1,
  "hospede_id": 1,
  "valor": 450.50,
  "status": "pendente",
  "hospede_nome": "João Silva",
  "quarto_descricao": "Quarto Padrão 101",
  "servicos": [
    {
      "name": "Café da Manhã",
      "description": "Café da manhã completo",
      "quantidade": 1,
      "valor_unitario": 25.00,
      "valor_total": 50.00
    }
  ],
  "impostos": [
    {
      "nome": "ISS",
      "valor": 10.00
    }
  ]
}
```

#### 1.3 Listar Todas as Reservas
**GET** `/reservas`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Reserva João Silva",
    "start_date": "2024-01-15",
    "end_date": "2024-01-17",
    "valor": 450.50,
    "status": "pendente",
    "hospede_nome": "João Silva",
    "quarto_descricao": "Quarto Padrão 101"
  }
]
```

#### 1.4 Atualizar Reserva
**PUT** `/reservas/:id`

**Body:**
```json
{
  "servicos_adicionais": [4, 5],
  "servicos_removidos": [1]
}
```

**Response (200):**
```json
{
  "message": "Reserva atualizada com sucesso",
  "id": 1,
  "valor_anterior": 450.50,
  "valor_novo": 480.75,
  "diferenca": 30.25,
  "detalhes_calculo": {
    "valor_base": 200.00,
    "taxa_ocupacao": 0,
    "valor_servicos": 150.00,
    "desconto_temporada": 30.00,
    "desconto_promocional": 19.50,
    "valor_impostos": 17.00,
    "taxa_cancelamento": 20.00
  }
}
```

#### 1.5 Cancelar Reserva
**DELETE** `/reservas/:id/cancel`

**Response (200):**
```json
{
  "message": "Reserva cancelada com sucesso",
  "id": 1,
  "valor_original": 450.50,
  "valor_reembolso": 405.45,
  "politica_reembolso": "Reembolso de 90% - Cancelamento com mais de 7 dias de antecedência",
  "dias_antecedencia": 10
}
```

#### 1.6 Calcular Valor (sem criar reserva)
**POST** `/reservas/calcular-valor`

**Body:**
```json
{
  "room_id": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-01-17",
  "numero_hospedes": 2,
  "servicos": [1, 2, 3],
  "codigo_promocional": "VERAO2024",
  "opcao_cancelamento": "gratuito",
  "parcelas": 3
}
```

**Response (200):**
```json
{
  "valor_final": 450.50,
  "valor_original": 500.00,
  "desconto_total": 49.50,
  "parcelas": {
    "numero": 3,
    "valor_parcela": 150.17
  },
  "detalhes": {
    "valor_base": 200.00,
    "taxa_ocupacao": 0,
    "valor_servicos": 120.00,
    "desconto_temporada": 30.00,
    "desconto_promocional": 19.50,
    "valor_impostos": 17.00,
    "taxa_cancelamento": 20.00,
    "impostos": [...],
    "dias": 2,
    "tipo_quarto": "padrao",
    "capacidade_maxima": 2
  }
}
```

### 2. Quartos

#### 2.1 Listar Quartos
**GET** `/rooms`

**Response (200):**
```json
[
  {
    "id": 1,
    "description": "Quarto Padrão 101",
    "price": 100.00,
    "tipo": "padrao",
    "capacidade_maxima": 2,
    "disponivel": 1
  },
  {
    "id": 3,
    "description": "Quarto de Luxo 201",
    "price": 200.00,
    "tipo": "luxo",
    "capacidade_maxima": 3,
    "disponivel": 1
  }
]
```

#### 2.2 Buscar Quarto por ID
**GET** `/rooms/:id`

#### 2.3 Verificar Disponibilidade
**POST** `/rooms/:id/availability`

**Body:**
```json
{
  "start_date": "2024-01-15",
  "end_date": "2024-01-17"
}
```

**Response (200):**
```json
{
  "room_id": 1,
  "start_date": "2024-01-15",
  "end_date": "2024-01-17",
  "disponivel": true,
  "reservas_existentes": 0
}
```

### 3. Serviços

#### 3.1 Listar Serviços
**GET** `/services`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Café da Manhã",
    "description": "Café da manhã completo",
    "price": 25.00,
    "tipo": "diario",
    "ativo": 1
  },
  {
    "id": 2,
    "name": "Estacionamento",
    "description": "Vaga de estacionamento",
    "price": 15.00,
    "tipo": "diario",
    "ativo": 1
  }
]
```

### 4. Códigos Promocionais

#### 4.1 Listar Códigos Promocionais
**GET** `/promo-codes`

**Response (200):**
```json
[
  {
    "codigo": "VERAO2024",
    "desconto_percentual": 20.00,
    "desconto_fixo": null,
    "tipo": "percentual",
    "data_inicio": "2024-06-01",
    "data_fim": "2024-08-31"
  }
]
```

#### 4.2 Validar Código Promocional
**POST** `/promo-codes/validate`

**Body:**
```json
{
  "codigo": "VERAO2024"
}
```

**Response (200):**
```json
{
  "valido": true,
  "desconto_percentual": 20.00,
  "desconto_fixo": null,
  "tipo": "percentual"
}
```

### 5. Temporadas

#### 5.1 Listar Temporadas
**GET** `/seasons`

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Alta Temporada - Verão",
    "data_inicio": "2024-12-01",
    "data_fim": "2024-03-31",
    "multiplicador": 1.5,
    "desconto_percentual": 0,
    "tipo": "alta"
  },
  {
    "id": 2,
    "nome": "Baixa Temporada",
    "data_inicio": "2024-04-01",
    "data_fim": "2024-11-30",
    "multiplicador": 1.0,
    "desconto_percentual": 15,
    "tipo": "baixa"
  }
]
```

### 6. Impostos

#### 6.1 Listar Impostos
**GET** `/taxes`

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "ISS",
    "percentual": 5.00,
    "tipo": "percentual",
    "ativo": 1
  },
  {
    "id": 2,
    "nome": "Taxa de Turismo",
    "percentual": 2.00,
    "tipo": "percentual",
    "ativo": 1
  },
  {
    "id": 3,
    "nome": "Taxa de Serviço",
    "percentual": 10.00,
    "tipo": "percentual",
    "ativo": 1
  }
]
```

### 7. Hóspedes

#### 7.1 Listar Hóspedes
**GET** `/hospedes`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
]
```

#### 7.2 Criar Hóspede
**POST** `/hospedes`

**Body:**
```json
{
  "name": "Maria Santos",
  "cpf": "98765432100",
  "email": "maria@email.com",
  "telefone": "11888888888"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Maria Santos",
  "cpf": "98765432100",
  "email": "maria@email.com",
  "telefone": "11888888888"
}
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **404**: Recurso não encontrado
- **409**: Conflito (ex: quarto indisponível)
- **500**: Erro interno do servidor

## Exemplos de Uso

### Exemplo 1: Criar reserva básica
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reserva Teste",
    "start_date": "2024-01-15",
    "end_date": "2024-01-17",
    "room_id": 1,
    "hospede_id": 1,
    "numero_hospedes": 2
  }'
```

### Exemplo 2: Criar reserva com serviços e código promocional
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reserva Luxo",
    "start_date": "2024-02-01",
    "end_date": "2024-02-05",
    "room_id": 3,
    "hospede_id": 1,
    "numero_hospedes": 3,
    "servicos": [1, 2, 3],
    "codigo_promocional": "VERAO2024",
    "opcao_cancelamento": "gratuito",
    "parcelas": 3
  }'
```

### Exemplo 3: Calcular valor sem criar reserva
```bash
curl -X POST http://localhost:3000/api/reservas/calcular-valor \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": 1,
    "start_date": "2024-01-15",
    "end_date": "2024-01-17",
    "numero_hospedes": 2,
    "servicos": [1, 2],
    "codigo_promocional": "VERAO2024"
  }'
```

### Exemplo 4: Verificar disponibilidade
```bash
curl -X POST http://localhost:3000/api/rooms/1/availability \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2024-01-15",
    "end_date": "2024-01-17"
  }'
```

### Exemplo 5: Validar código promocional
```bash
curl -X POST http://localhost:3000/api/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "VERAO2024"
  }'
```

## Funcionalidades Implementadas

✅ **Cenário 1**: Criar reserva básica com cálculo automático de valor
✅ **Cenário 2**: Criar reserva com quarto de luxo e valor diferenciado
✅ **Cenário 3**: Criar reserva com serviços adicionais
✅ **Cenário 4**: Criar reserva com desconto por período (baixa temporada)
✅ **Cenário 5**: Criar reserva com taxa de ocupação extra
✅ **Cenário 6**: Criar reserva com pagamento parcelado
✅ **Cenário 7**: Criar reserva com código promocional
✅ **Cenário 8**: Criar reserva com taxa de cancelamento
✅ **Cenário 9**: Criar reserva com imposto e taxas
✅ **Cenário 10**: Validação de valor inválido
✅ **Cenário 11**: Validação de datas inválidas
✅ **Cenário 12**: Validação de quarto indisponível
✅ **Cenário 13**: Atualizar valor de reserva existente
✅ **Cenário 14**: Cancelar reserva e calcular reembolso

Todos os cenários da feature `reserva_com_valor.feature` foram implementados no backend! 