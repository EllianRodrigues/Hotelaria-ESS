
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Tabela de reservas expandida
  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    start_date TEXT,
    end_date TEXT,
    room_id INTEGER,
    hospede_id INTEGER,
    valor REAL,
    valor_original REAL,
    desconto REAL,
    status TEXT DEFAULT 'pendente',
    numero_hospedes INTEGER DEFAULT 1,
    taxa_ocupacao_extra REAL DEFAULT 0,
    taxa_cancelamento REAL DEFAULT 0,
    codigo_promocional TEXT,
    parcelas INTEGER DEFAULT 1,
    valor_parcela REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de hóspedes
  db.run(`CREATE TABLE IF NOT EXISTS hospedes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cpf TEXT UNIQUE,
    email TEXT,
    telefone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de quartos expandida
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    price REAL,
    tipo TEXT DEFAULT 'padrao',
    capacidade_maxima INTEGER DEFAULT 2,
    disponivel BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de anúncios (para favoritos)
  db.run(`CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER,
    titulo TEXT,
    descricao TEXT,
    preco_por_noite REAL,
    localizacao TEXT,
    avaliacao_media REAL DEFAULT 0,
    numero_avaliacoes INTEGER DEFAULT 0,
    comodidades TEXT,
    politica_cancelamento TEXT,
    fotos TEXT,
    status TEXT DEFAULT 'ativo',
    destaque BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
  )`);

  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    telefone TEXT,
    data_nascimento TEXT,
    preferencias_notificacao TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de favoritos
  db.run(`CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    anuncio_id INTEGER,
    pasta_id INTEGER,
    data_salvamento DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_remocao DATETIME,
    visitado BOOLEAN DEFAULT 0,
    data_visita DATETIME,
    comentarios_pessoais TEXT,
    alerta_preco REAL,
    alerta_disponibilidade BOOLEAN DEFAULT 1,
    status TEXT DEFAULT 'ativo',
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (anuncio_id) REFERENCES anuncios (id),
    FOREIGN KEY (pasta_id) REFERENCES pastas_favoritos (id)
  )`);

  // Tabela de pastas de favoritos
  db.run(`CREATE TABLE IF NOT EXISTS pastas_favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    nome TEXT,
    descricao TEXT,
    cor TEXT DEFAULT '#007bff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )`);

  // Tabela de notificações
  db.run(`CREATE TABLE IF NOT EXISTS notificacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    favorito_id INTEGER,
    tipo TEXT,
    titulo TEXT,
    mensagem TEXT,
    dados_adicional TEXT,
    lida BOOLEAN DEFAULT 0,
    enviada BOOLEAN DEFAULT 0,
    canal TEXT DEFAULT 'email',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (favorito_id) REFERENCES favoritos (id)
  )`);

  // Tabela de alertas de preço
  db.run(`CREATE TABLE IF NOT EXISTS alertas_preco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    favorito_id INTEGER,
    preco_maximo REAL,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (favorito_id) REFERENCES favoritos (id)
  )`);

  // Tabela de alertas de disponibilidade
  db.run(`CREATE TABLE IF NOT EXISTS alertas_disponibilidade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    favorito_id INTEGER,
    data_inicio TEXT,
    data_fim TEXT,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (favorito_id) REFERENCES favoritos (id)
  )`);

  // Tabela de compartilhamento de favoritos
  db.run(`CREATE TABLE IF NOT EXISTS compartilhamento_favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    codigo_unico TEXT UNIQUE,
    tipo TEXT DEFAULT 'lista',
    dados_compartilhados TEXT,
    expira_em DATETIME,
    visualizacoes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )`);

  // Tabela de histórico de favoritos
  db.run(`CREATE TABLE IF NOT EXISTS historico_favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    anuncio_id INTEGER,
    acao TEXT,
    dados_anteriores TEXT,
    dados_novos TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (anuncio_id) REFERENCES anuncios (id)
  )`);

  // Tabela de sugestões baseadas em favoritos
  db.run(`CREATE TABLE IF NOT EXISTS sugestoes_favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    anuncio_sugerido_id INTEGER,
    anuncio_base_id INTEGER,
    score REAL,
    motivo TEXT,
    visualizada BOOLEAN DEFAULT 0,
    salva_como_favorito BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (anuncio_sugerido_id) REFERENCES anuncios (id),
    FOREIGN KEY (anuncio_base_id) REFERENCES anuncios (id)
  )`);

  // Tabela de serviços
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    tipo TEXT DEFAULT 'diario',
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de serviços da reserva
  db.run(`CREATE TABLE IF NOT EXISTS reservation_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER,
    service_id INTEGER,
    quantidade INTEGER DEFAULT 1,
    valor_unitario REAL,
    valor_total REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id),
    FOREIGN KEY (service_id) REFERENCES services (id)
  )`);

  // Tabela de códigos promocionais
  db.run(`CREATE TABLE IF NOT EXISTS promo_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE,
    desconto_percentual REAL,
    desconto_fixo REAL,
    tipo TEXT DEFAULT 'percentual',
    data_inicio TEXT,
    data_fim TEXT,
    max_usos INTEGER,
    usos_atuais INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de impostos e taxas
  db.run(`CREATE TABLE IF NOT EXISTS taxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    percentual REAL,
    tipo TEXT DEFAULT 'percentual',
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de impostos da reserva
  db.run(`CREATE TABLE IF NOT EXISTS reservation_taxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER,
    tax_id INTEGER,
    valor REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id),
    FOREIGN KEY (tax_id) REFERENCES taxes (id)
  )`);

  // Tabela de temporadas
  db.run(`CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    data_inicio TEXT,
    data_fim TEXT,
    multiplicador REAL DEFAULT 1.0,
    desconto_percentual REAL DEFAULT 0,
    tipo TEXT DEFAULT 'alta',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Inserir dados iniciais
  db.run(`INSERT INTO rooms (description, price, tipo, capacidade_maxima) VALUES 
    ('Quarto Padrão 101', 100, 'padrao', 2),
    ('Quarto Padrão 102', 100, 'padrao', 2),
    ('Quarto de Luxo 201', 200, 'luxo', 3),
    ('Suíte Presidencial 301', 500, 'luxo', 4)
  `);

  db.run(`INSERT INTO anuncios (room_id, titulo, descricao, preco_por_noite, localizacao, avaliacao_media, numero_avaliacoes, comodidades, politica_cancelamento) VALUES 
    (1, 'Quarto Padrão com Vista para o Mar', 'Quarto confortável com vista deslumbrante para o oceano', 100, 'Copacabana, Rio de Janeiro', 4.5, 127, 'Wi-Fi, TV, Ar condicionado, Frigobar', 'Cancelamento gratuito até 24h antes'),
    (2, 'Quarto Padrão Centro da Cidade', 'Quarto ideal para quem quer ficar no centro da cidade', 100, 'Centro, São Paulo', 4.2, 89, 'Wi-Fi, TV, Ar condicionado', 'Cancelamento com taxa de 10%'),
    (3, 'Quarto de Luxo com Varanda', 'Quarto de luxo com varanda privativa e vista panorâmica', 200, 'Ipanema, Rio de Janeiro', 4.8, 203, 'Wi-Fi, TV 4K, Ar condicionado, Varanda, Room service', 'Cancelamento gratuito até 48h antes'),
    (4, 'Suíte Presidencial', 'A mais luxuosa suíte do hotel com todos os mimos', 500, 'Leblon, Rio de Janeiro', 4.9, 67, 'Wi-Fi, TV 4K, Ar condicionado, Varanda, Room service 24h, Spa', 'Cancelamento gratuito até 72h antes')
  `);

  db.run(`INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) VALUES 
    ('João Silva', 'joao@email.com', 'senha123', '11999999999', '1990-05-15'),
    ('Maria Santos', 'maria@email.com', 'senha456', '11888888888', '1985-08-22'),
    ('Pedro Costa', 'pedro@email.com', 'senha789', '11777777777', '1992-12-10')
  `);

  db.run(`INSERT INTO pastas_favoritos (usuario_id, nome, descricao, cor) VALUES 
    (1, 'Viagem de Férias', 'Quartos para as próximas férias', '#28a745'),
    (1, 'Viagem de Negócios', 'Quartos para viagens de trabalho', '#007bff'),
    (2, 'Finais de Semana', 'Quartos para escapadas de fim de semana', '#ffc107')
  `);

  db.run(`INSERT INTO favoritos (usuario_id, anuncio_id, pasta_id, data_salvamento) VALUES 
    (1, 1, 1, '2024-01-10 10:30:00'),
    (1, 3, 1, '2024-01-12 14:20:00'),
    (2, 2, 3, '2024-01-15 09:15:00'),
    (2, 4, NULL, '2024-01-18 16:45:00')
  `);

  db.run(`INSERT INTO alertas_preco (favorito_id, preco_maximo) VALUES 
    (1, 80.00),
    (3, 90.00)
  `);

  db.run(`INSERT INTO alertas_disponibilidade (favorito_id, data_inicio, data_fim) VALUES 
    (2, '2024-02-01', '2024-02-05'),
    (4, '2024-03-15', '2024-03-20')
  `);

  db.run(`INSERT INTO services (name, description, price, tipo) VALUES 
    ('Café da Manhã', 'Café da manhã completo', 25, 'diario'),
    ('Estacionamento', 'Vaga de estacionamento', 15, 'diario'),
    ('Limpeza Diária', 'Serviço de limpeza diária', 20, 'diario'),
    ('Wi-Fi Premium', 'Internet de alta velocidade', 10, 'diario'),
    ('Serviço de Quarto', 'Serviço de quarto 24h', 30, 'diario')
  `);

  db.run(`INSERT INTO promo_codes (codigo, desconto_percentual, data_inicio, data_fim, max_usos) VALUES 
    ('VERAO2024', 20, '2024-06-01', '2024-08-31', 100),
    ('PRIMEIRA', 15, '2024-01-01', '2024-12-31', 50),
    ('FIDELIDADE', 10, '2024-01-01', '2024-12-31', 200)
  `);

  db.run(`INSERT INTO taxes (nome, percentual, tipo) VALUES 
    ('ISS', 5, 'percentual'),
    ('Taxa de Turismo', 2, 'percentual'),
    ('Taxa de Serviço', 10, 'percentual')
  `);

  db.run(`INSERT INTO seasons (nome, data_inicio, data_fim, multiplicador, desconto_percentual, tipo) VALUES 
    ('Alta Temporada - Verão', '2024-12-01', '2024-03-31', 1.5, 0, 'alta'),
    ('Baixa Temporada', '2024-04-01', '2024-11-30', 1.0, 15, 'baixa')
  `);

  db.run(`INSERT INTO hospedes (name, cpf, email, telefone) VALUES 
    ('João Silva', '12345678901', 'joao@email.com', '11999999999'),
    ('Maria Santos', '98765432100', 'maria@email.com', '11888888888')
  `);
});

module.exports = db;
