Funcionalidade: Sistema de Estatísticas do Sistema de Hotelaria
  Como administrador do sistema
  Quero visualizar estatísticas detalhadas da plataforma
  Para que eu possa tomar decisões baseadas em dados sobre hotéis, reservas e receitas

Cenário: Visualizar estatísticas gerais do sistema
  Dado que existe um sistema com 3 hotéis cadastrados
  E existem 5 quartos distribuídos entre os hotéis
  E existem 2 hóspedes cadastrados no sistema
  E existem 3 reservas realizadas com receita total de R$ 450
  Quando solicito as estatísticas gerais do sistema
  Então recebo uma resposta de sucesso com código "200"
  E os dados incluem totalHotels "3", totalHospedes "2", totalRooms "5", totalReservations "3" e totalRevenue "450"

Cenário: Obter ranking de hotéis por receita
  Dado que existem hotéis "Hotel Unique", "Hotel Copacabana Palace" e "Hotel Fasano" cadastrados
  E cada hotel possui quartos com diferentes receitas potenciais
  Quando solicito o ranking de hotéis por receita
  Então recebo uma resposta de sucesso com código "200"
  E a lista retorna os hotéis ordenados por receita total decrescente
  E cada hotel inclui informações de "id", "hotel_name", "total_rooms", "total_revenue" e "occupancy_rate"

Cenário: Visualizar estatísticas por tipo de quarto
  Dado que existem quartos do tipo "lodge" e "hotelRoom" no sistema
  E os quartos "lodge" têm preço médio superior aos "hotelRoom"
  Quando solicito as estatísticas por tipo de quarto
  Então recebo uma resposta de sucesso com código "200"
  E os dados incluem para cada tipo: "room_type", "total_rooms", "avg_price", "total_revenue" e "occupancy_rate"

Cenário: Consultar tendências mensais de reservas
  Dado que existem reservas realizadas em diferentes períodos
  E as reservas possuem valores e datas registradas
  Quando solicito as tendências mensais do sistema
  Então recebo uma resposta de sucesso com código "200"
  E os dados incluem informações mensais com "month", "reservations", "revenue", "new_customers" e "growth_rate"

Cenário: Obter todas as estatísticas agregadas
  Dado que o sistema possui dados completos de hotéis, quartos, hóspedes e reservas
  Quando solicito todas as estatísticas em uma única requisição
  Então recebo uma resposta de sucesso com código "200"
  E a resposta inclui "overview", "topHotels", "roomTypeStats", "seasonStats", "advancedMetrics" e "trends"
  E todos os objetos contêm dados válidos e atualizados

Cenário: Verificar saúde do sistema de estatísticas
  Dado que o sistema de estatísticas está operacional
  Quando solicito o status de saúde das estatísticas
  Então recebo uma resposta de sucesso com código "200"
  E os dados incluem "status" indicando que o sistema está funcionando
  E inclui "timestamp" com a data e hora da verificação

Cenário: Limpar cache das estatísticas
  Dado que o sistema possui cache de estatísticas ativo
  Quando solicito a limpeza do cache via DELETE
  Então recebo uma resposta de sucesso com código "200"
  E a mensagem confirma que o "cache foi limpo com sucesso"
  E as próximas consultas buscarão dados atualizados do banco

Cenário: Erro ao consultar estatísticas com banco indisponível
  Dado que o banco de dados está temporariamente indisponível
  Quando solicito qualquer estatística do sistema
  Então recebo uma resposta de erro com código "500"
  E a mensagem indica "erro interno do servidor"
  E o sistema mantém a estabilidade sem quebrar
