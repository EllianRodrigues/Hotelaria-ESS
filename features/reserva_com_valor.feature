
Feature: Criar reserva com valor

  Como um cliente do sistema de hotelaria
  Eu quero criar reservas com valores calculados automaticamente
  Para que eu possa gerenciar minhas estadias de forma transparente

  Background:
    Given o sistema de hotelaria está operacional
    And o cliente está autenticado no sistema
    And existem quartos disponíveis no hotel

  Scenario: Criar reserva básica com cálculo automático de valor
    Given o cliente seleciona um quarto padrão
    And a data de check-in é "2024-01-15"
    And a data de check-out é "2024-01-17"
    And o número de hóspedes é 2
    When o sistema calcula o valor da reserva
    Then a reserva deve ser criada com sucesso
    And o valor total deve ser calculado corretamente
    And a reserva deve conter a propriedade "valor"
    And o valor deve ser maior que zero
    And o status da reserva deve ser "pendente"

  Scenario: Criar reserva com quarto de luxo e valor diferenciado
    Given o cliente seleciona um quarto de luxo
    And a data de check-in é "2024-02-01"
    And a data de check-out é "2024-02-05"
    And o número de hóspedes é 3
    When o sistema calcula o valor da reserva com taxa de luxo
    Then a reserva deve ser criada com sucesso
    And o valor deve incluir a taxa de luxo
    And o valor deve ser maior que uma reserva padrão
    And a reserva deve conter detalhes do quarto de luxo

  Scenario: Criar reserva com serviços adicionais
    Given o cliente seleciona um quarto padrão
    And adiciona serviço de café da manhã
    And adiciona serviço de estacionamento
    And adiciona serviço de limpeza diária
    And a data de check-in é "2024-03-10"
    And a data de check-out é "2024-03-12"
    When o sistema calcula o valor total com serviços
    Then a reserva deve ser criada com sucesso
    And o valor deve incluir todos os serviços selecionados
    And cada serviço deve ter seu valor individual calculado
    And o valor total deve ser a soma do quarto mais os serviços

  Scenario: Criar reserva com desconto por período
    Given o cliente seleciona um quarto padrão
    And a data de check-in é "2024-06-01"
    And a data de check-out é "2024-06-10"
    And o período está na baixa temporada
    When o sistema aplica desconto de baixa temporada
    Then a reserva deve ser criada com sucesso
    And o valor deve ter desconto aplicado
    And o desconto deve ser de 15% sobre o valor original
    And a reserva deve mostrar o valor original e o valor com desconto

  Scenario: Criar reserva com taxa de ocupação
    Given o cliente seleciona um quarto padrão
    And o número de hóspedes é 4
    And a capacidade máxima do quarto é 2
    When o sistema calcula taxa de ocupação extra
    Then a reserva deve ser criada com sucesso
    And o valor deve incluir taxa de ocupação extra
    And a taxa deve ser de 50% por pessoa adicional
    And o sistema deve alertar sobre a superlotação

  Scenario: Criar reserva com pagamento parcelado
    Given o cliente seleciona um quarto padrão
    And escolhe pagamento em 3 parcelas
    And a data de check-in é "2024-04-01"
    And a data de check-out é "2024-04-05"
    When o sistema calcula o valor das parcelas
    Then a reserva deve ser criada com sucesso
    And o valor total deve ser dividido em 3 parcelas iguais
    And cada parcela deve ter o valor calculado corretamente
    And a primeira parcela deve ser cobrada no momento da reserva

  Scenario: Criar reserva com código promocional
    Given o cliente seleciona um quarto padrão
    And insere o código promocional "VERAO2024"
    And a data de check-in é "2024-07-15"
    And a data de check-out é "2024-07-20"
    When o sistema valida e aplica o código promocional
    Then a reserva deve ser criada com sucesso
    And o código promocional deve ser aplicado
    And o desconto deve ser de 20% sobre o valor total
    And o código promocional deve ser marcado como usado

  Scenario: Criar reserva com taxa de cancelamento
    Given o cliente seleciona um quarto padrão
    And escolhe a opção de cancelamento gratuito
    And a data de check-in é "2024-05-01"
    And a data de check-out é "2024-05-03"
    When o sistema adiciona taxa de cancelamento
    Then a reserva deve ser criada com sucesso
    And o valor deve incluir taxa de cancelamento
    And a taxa deve ser de 10% do valor total
    And o cancelamento deve ser permitido até 24h antes do check-in

  Scenario: Criar reserva com imposto e taxas
    Given o cliente seleciona um quarto padrão
    And a data de check-in é "2024-08-01"
    And a data de check-out é "2024-08-05"
    When o sistema calcula impostos e taxas
    Then a reserva deve ser criada com sucesso
    And o valor deve incluir ISS de 5%
    And o valor deve incluir taxa de turismo de 2%
    And o valor deve incluir taxa de serviço de 10%
    And todos os impostos devem ser discriminados na reserva

  Scenario: Tentar criar reserva com valor inválido
    Given o cliente tenta criar uma reserva
    And o valor calculado é zero ou negativo
    When o sistema valida o valor da reserva
    Then a reserva não deve ser criada
    And o sistema deve retornar erro de valor inválido
    And uma mensagem de erro deve ser exibida

  Scenario: Tentar criar reserva com datas inválidas
    Given o cliente tenta criar uma reserva
    And a data de check-out é anterior à data de check-in
    When o sistema valida as datas
    Then a reserva não deve ser criada
    And o sistema deve retornar erro de datas inválidas
    And uma mensagem de erro deve ser exibida

  Scenario: Tentar criar reserva com quarto indisponível
    Given o cliente seleciona um quarto
    And o quarto já está reservado para o período solicitado
    When o sistema verifica a disponibilidade
    Then a reserva não deve ser criada
    And o sistema deve retornar erro de quarto indisponível
    And deve sugerir quartos alternativos disponíveis

  Scenario: Atualizar valor de reserva existente
    Given existe uma reserva criada
    And o cliente adiciona um serviço extra
    When o sistema recalcula o valor da reserva
    Then o valor da reserva deve ser atualizado
    And a diferença de valor deve ser calculada
    And o cliente deve ser notificado sobre a alteração

  Scenario: Cancelar reserva e calcular reembolso
    Given existe uma reserva confirmada
    And o cliente solicita cancelamento
    When o sistema calcula o valor do reembolso
    Then o reembolso deve ser calculado conforme política
    And a reserva deve ser marcada como cancelada
    And o valor do reembolso deve ser comunicado ao cliente
