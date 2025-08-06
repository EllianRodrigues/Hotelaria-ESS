Feature: Reserva de Quarto por um Hóspede
  Como um hóspede
  Eu quero buscar e reservar um quarto disponível
  Para garantir minha estadia.

  Background:
    Given que o banco de dados foi populado com dados de teste
    And estou na página inicial

  Scenario: Hóspede logado reserva um quarto com sucesso
    Given que estou logado como hóspede com CPF "12345678900" e senha "123"
    When eu busco por quartos na cidade "Rio de Janeiro" para "2" adultos de "2025-10-01" a "2025-10-05"
    Then eu sou redirecionado para a página de resultados da busca
    And eu devo ver pelo menos um quarto na lista

    When eu clico no botão "Reservar Agora" do primeiro quarto da lista
    Then o modal de confirmação de reserva deve aparecer
    
    When eu clico no botão "Confirmar Reserva"
    Then eu devo ver a mensagem de sucesso "Reserva Confirmada!"
    And o quarto reservado não deve mais aparecer na lista de resultados

  Scenario: Usuário não logado tenta reservar um quarto
    Given que eu não estou logado
    When eu busco por quartos na cidade "Rio de Janeiro" para "2" adultos de "2025-10-01" a "2025-10-05"
    Then eu sou redirecionado para a página de resultados da busca
    And eu devo ver pelo menos um quarto na lista

    When eu clico no botão "Reservar Agora" do primeiro quarto da lista
    Then eu devo ser redirecionado para a página de login de hóspede "/login-hospede"