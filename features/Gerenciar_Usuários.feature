Funcionalidade: Gerenciamento de Usuários pelo Administrador
  Como administrador do sistema
  Quero criar, editar e remover usuários comuns e anunciantes
  Para que eu possa manter o controle de acesso da plataforma


Cenário: Admin cria um usuário comum
    Dado que acesso o sistema com o email "admin@hotelaria.com" e senha "admin123"
    E sou autenticado com perfil de administrador
    E estou na página “gerenciar usuários”
    E seleciono a opção “criar novo usuário”
    E preencho nome com “João Silva”, email com “joao@gmail.com”, senha com “123456”, tipo com “comum”
    Quando clico em “salvar”
    Então os dados do usuário são adicionados ao banco de dados
    E aparece a mensagem “usuário criado com sucesso”


Cenário: Admin edita um usuário comum
    Dado que acesso o sistema com o email "admin@hotelaria.com" e senha "admin123"
    E sou autenticado com perfil de administrador
    E estou na página “gerenciar usuários”
    E clico em “editar” no usuário com nome “João Silva”
    E altero o email para “joao.silva@gmail.com”
    Quando clico em “salvar”
    Então os dados atualizados são salvos no banco de dados


Cenário: Admin remove um usuário comum
    Dado que acesso o sistema com o email "admin@hotelaria.com" e senha "admin123"
    E sou autenticado com perfil de administrador
    E estou na página “gerenciar usuários”
    E clico em “remover” no usuário com nome “João Silva”
    Quando confirmo a exclusão
    Então o usuário é removido do banco de dados
    E aparece a mensagem “usuário removido com sucesso”