Feature: Salvar anúncio como favorito

  Como um usuário do sistema de hotelaria
  Eu quero salvar anúncios de quartos como favoritos
  Para que eu possa acessá-los facilmente e receber notificações sobre disponibilidade

  Background:
    Given o sistema de hotelaria está operacional
    And o usuário está autenticado no sistema
    And existem anúncios de quartos disponíveis

  Scenario: Salvar anúncio como favorito
    Given o usuário visualiza um anúncio de quarto
    And o anúncio está disponível para reserva
    When o usuário clica no botão "Salvar como Favorito"
    Then o anúncio deve ser salvo como favorito
    And o botão deve mudar para "Favorito Salvo"
    And o anúncio deve aparecer na lista de favoritos do usuário
    And o sistema deve registrar a data de salvamento

  Scenario: Salvar múltiplos anúncios como favoritos
    Given o usuário tem uma lista de anúncios de quartos
    And o usuário salva o primeiro anúncio como favorito
    And o usuário salva o segundo anúncio como favorito
    And o usuário salva o terceiro anúncio como favorito
    When o usuário acessa sua lista de favoritos
    Then a lista deve conter 3 anúncios favoritos
    And os anúncios devem estar ordenados por data de salvamento
    And cada anúncio deve mostrar suas informações básicas

  Scenario: Remover anúncio dos favoritos
    Given o usuário tem um anúncio salvo como favorito
    When o usuário clica no botão "Remover dos Favoritos"
    Then o anúncio deve ser removido dos favoritos
    And o botão deve voltar para "Salvar como Favorito"
    And o anúncio não deve mais aparecer na lista de favoritos
    And o sistema deve registrar a data de remoção

  Scenario: Visualizar lista de favoritos
    Given o usuário tem vários anúncios salvos como favoritos
    When o usuário acessa a página de favoritos
    Then a página deve mostrar todos os anúncios favoritos
    And cada anúncio deve exibir:
      | Nome do quarto |
      | Preço por noite |
      | Localização |
      | Avaliação média |
      | Status de disponibilidade |
    And deve haver opção de ordenar por preço, avaliação ou data
    And deve haver opção de filtrar por tipo de quarto

  Scenario: Receber notificação de disponibilidade
    Given o usuário tem um anúncio salvo como favorito
    And o anúncio estava indisponível
    When o quarto fica disponível para as datas desejadas
    Then o sistema deve enviar notificação ao usuário
    And a notificação deve conter:
      | Nome do quarto |
      | Datas disponíveis |
      | Preço atual |
      | Link direto para reserva |
    And o anúncio deve ser marcado como "Disponível" na lista de favoritos

  Scenario: Receber notificação de promoção
    Given o usuário tem um anúncio salvo como favorito
    And o anúncio tem um preço base
    When o preço do quarto é reduzido
    Then o sistema deve enviar notificação de promoção
    And a notificação deve mostrar:
      | Preço anterior |
      | Preço atual |
      | Percentual de desconto |
      | Data de validade da promoção |
    And o anúncio deve ser destacado na lista de favoritos

  Scenario: Compartilhar lista de favoritos
    Given o usuário tem uma lista de favoritos
    When o usuário clica em "Compartilhar Favoritos"
    Then o sistema deve gerar um link único
    And o link deve permitir visualização pública dos favoritos
    And o usuário deve poder copiar o link para compartilhar
    And o link deve expirar após 7 dias

  Scenario: Exportar lista de favoritos
    Given o usuário tem uma lista de favoritos
    When o usuário clica em "Exportar Favoritos"
    Then o sistema deve gerar um arquivo PDF
    And o PDF deve conter:
      | Lista completa de favoritos |
      | Informações detalhadas de cada quarto |
      | Preços e disponibilidade |
      | Links para reserva |
    And o arquivo deve ser baixado automaticamente

  Scenario: Adicionar anúncio já favoritado
    Given o usuário já tem um anúncio salvo como favorito
    When o usuário tenta salvar o mesmo anúncio novamente
    Then o sistema deve mostrar mensagem "Já está nos favoritos"
    And o anúncio não deve ser duplicado na lista
    And o botão deve permanecer como "Favorito Salvo"

  Scenario: Salvar anúncio indisponível como favorito
    Given o usuário visualiza um anúncio indisponível
    When o usuário clica em "Salvar como Favorito"
    Then o anúncio deve ser salvo como favorito
    And o sistema deve mostrar status "Indisponível"
    And o usuário deve receber notificação quando ficar disponível
    And deve haver opção de definir alerta de disponibilidade

  Scenario: Definir alerta de preço
    Given o usuário tem um anúncio salvo como favorito
    When o usuário define um alerta de preço
    And especifica o preço máximo desejado
    Then o sistema deve monitorar o preço do quarto
    And deve enviar notificação quando o preço baixar
    And a notificação deve incluir o preço atual e o desejado

  Scenario: Organizar favoritos em pastas
    Given o usuário tem vários anúncios favoritos
    When o usuário cria uma pasta chamada "Viagem de Férias"
    And move alguns anúncios para essa pasta
    Then os anúncios devem ser organizados na pasta
    And o usuário deve poder navegar entre pastas
    And deve haver opção de criar múltiplas pastas
    And cada pasta deve ter nome personalizado

  Scenario: Sincronizar favoritos entre dispositivos
    Given o usuário tem favoritos salvos no computador
    When o usuário acessa o sistema pelo celular
    Then a lista de favoritos deve estar sincronizada
    And todas as pastas devem estar disponíveis
    And as configurações de alerta devem ser mantidas
    And as notificações devem funcionar em ambos os dispositivos

  Scenario: Limpar favoritos antigos
    Given o usuário tem favoritos salvos há mais de 6 meses
    When o usuário acessa a lista de favoritos
    Then o sistema deve sugerir limpeza de favoritos antigos
    And deve mostrar opção de "Limpar Favoritos Antigos"
    And deve permitir selecionar quais remover
    And deve manter histórico de favoritos removidos

  Scenario: Comparar favoritos
    Given o usuário tem múltiplos anúncios favoritos
    When o usuário seleciona 3 anúncios para comparar
    And clica em "Comparar Favoritos"
    Then o sistema deve mostrar tabela comparativa
    And a tabela deve incluir:
      | Preço por noite |
      | Avaliação |
      | Localização |
      | Comodidades |
      | Política de cancelamento |
    And deve permitir ordenar por qualquer critério

  Scenario: Receber sugestões baseadas em favoritos
    Given o usuário tem anúncios salvos como favoritos
    When o usuário acessa a página inicial
    Then o sistema deve mostrar "Sugestões para Você"
    And as sugestões devem ser baseadas nos favoritos
    And devem incluir quartos similares
    And devem mostrar preços competitivos
    And deve haver opção de salvar sugestões como favoritos

  Scenario: Definir preferências de notificação
    Given o usuário tem anúncios favoritos
    When o usuário acessa configurações de notificação
    Then o usuário deve poder configurar:
      | Frequência de notificações |
      | Tipos de notificação (preço, disponibilidade) |
      | Horários preferidos |
      | Canais (email, push, SMS) |
    And as configurações devem ser aplicadas a todos os favoritos

  Scenario: Marcar favorito como "Já visitado"
    Given o usuário tem um anúncio salvo como favorito
    When o usuário marca como "Já visitei este quarto"
    Then o anúncio deve ser marcado como visitado
    And deve mostrar data da visita
    And deve permitir adicionar comentários pessoais
    And deve aparecer em seção separada "Quartos Visitados"

  Scenario: Compartilhar favorito específico
    Given o usuário tem um anúncio salvo como favorito
    When o usuário clica em "Compartilhar este favorito"
    Then o sistema deve gerar link específico para o anúncio
    And o link deve incluir informações do favorito
    And deve permitir adicionar mensagem pessoal
    And deve mostrar preview do que será compartilhado

  Scenario: Receber relatório semanal de favoritos
    Given o usuário tem anúncios favoritos
    When chega o final da semana
    Then o sistema deve enviar relatório semanal
    And o relatório deve incluir:
      | Mudanças de preço nos favoritos |
      | Novas disponibilidades |
      | Sugestões de quartos similares |
      | Estatísticas de uso dos favoritos |
    And deve haver opção de cancelar relatórios

  Scenario: Migrar favoritos de conta antiga
    Given o usuário tem favoritos em uma conta antiga
    When o usuário faz login em uma nova conta
    Then o sistema deve detectar favoritos da conta antiga
    And deve oferecer opção de migrar favoritos
    And deve permitir selecionar quais migrar
    And deve manter histórico de favoritos migrados
    And deve sincronizar configurações de alerta 