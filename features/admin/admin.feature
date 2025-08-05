Feature: Gerenciamento de Usuários pelo Admin
  Como um administrador
  Eu quero acessar o painel, visualizar todos os usuários e poder removê-los
  Para manter a base de usuários do sistema organizada.

  Scenario: Admin faz login, visualiza e remove um usuário com sucesso
    Given que estou na página de login de administrador
    When eu preencho o campo de email com "admin@test.com"
    And eu preencho o campo de senha com "admin123"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para a página "/admin/dashboard"
    And eu devo ver o título "Painel do Administrador"

    When eu aguardo a lista de usuários carregar
    Then eu devo ver na lista um usuário com o email "hospede.existente@test.com"

    When eu clico no botão "Remover" do usuário com email "hospede.existente@test.com"
    And eu clico no botão de confirmação "Excluir" no modal
    Then a lista de usuários deve ser atualizada
    And eu não devo mais ver na lista um usuário com o email "hospede.existente@test.com"