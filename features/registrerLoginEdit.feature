Feature de Registro, Login e edição de dados

Cliente:

Cenário: Cadastro cliente
Dado que estou na página “cadastro cliente” e não existe o cliente "Ellian" de email "ellian@gmail.com" com senha "123" e cpf "12345678900"
Quando preencho nome com “Ellian”, email com “ellian@gmail.com”, senha com “123”, cpf com “12345678900” e tento Cadastrar
Então os dados nome “Ellian”, email “ellian@gmail.com”, senha “123” e cpf “12345678900” são adicionados e aparece a mensagem “cadastro do cliente realizado com sucesso”

Cenário: Cadastro cliente errado
Dado que estou na página “cadastro cliente” e não existe o cliente "Ellian" de email "ellian@gmail.com" com senha "123" e cpf "12345678900"
Quando preencho nome com “Ellian”, email com “ellian@gmail.com”, senha com “123”, cpf deixo em branco “” e tento Cadastrar
Então Aparece a mensagem “Todos os campos são obrigatórios” e os dados não são adicionados

Cenário: Cadastro cliente com cpf já existente
Dado que estou na página “cadastro cliente” e o usuário com cpf "09876543211" já existe
Quando preencho nome com “Ellian”, email com “novoemail@gmail.com”, senha com “456” e cpf com “09876543211” e tento Cadastrar
Então aparece a mensagem CPF de cliente já cadastrado” e os dados não são adicionados

Cenário: Login cliente com sucesso
Dado que estou na página “login cliente”
Quando preencho cpf com “12345678900” e senha com “123” e tento fazer Login
Então sou redirecionado para a página inicial do cliente e aparece a mensagem “Login realizado com sucesso”

Cenário: Login cliente com cpf ou senha incorretos
Dado que estou na página “login cliente” e não existe cliente com cpf “12345678900” e senha "123"
Quando preencho cpf com “12345678900” e senha com "123" e tento fazer login
Então aparece a mensagem cpf ou senha incorretos”

Cenário: Cliente edita a senha com sucesso
Dado que estou na página “editar dados cliente” e logado como o cliente “Ellian” de senha "123"
Quando preencho o campo “senha atual” com “123” e o campo “nova senha” com “456” e tento salvar alterações
Então a senha do cliente “Ellian” é atualizada no banco de dados para “456” e aparece a mensagem “dados atualizados com sucesso”

Cenário: Cliente falha ao editar senha por senha atual incorreta
Dado que estou na página “editar dados cliente” e logado como o cliente “Ellian” de senha "123"
Quando preencho o campo “senha atual” com “senhaErrada” e o campo “nova senha” com “456” e tento salvar alterações
Então aparece a mensagem “Senha atual incorreta” 

HOTEL:

Cenário: Cadastro hotel
Dado que estou na página “cadastro hotel” e não existe o hotel "Paradise" de email "paradise@gmail.com" com senha "123" e cnpj "12345678900000"
Quando preencho nome com “Paradise”, email com “paradise@gmail.com”, senha com “123”, cnpj com “12345678900000” e tento Cadastrar
Então os dados nome “Paradise”, email “paradise@gmail.com”, senha “123” e cnpj “12345678900000” são adicionados e aparece a mensagem “cadastro do hotel realizado com sucesso”

Cenário: Cadastro hotel errado
Dado que estou na página “cadastro hotel” e não existe o hotel "Paradise" de email "paradise@gmail.com" com senha "123" e cnpj "12345678900000"
Quando preencho nome com “Paradise”, email com “paradise@gmail.com”, senha com “123”, cnpj deixo em branco “” e tento Cadastrar
Então aparece a mensagem “Todos os campos são obrigatórios” e os dados não são adicionados

Cenário: Cadastro hotel com cnpj já existente
Dado que estou na página “cadastro hotel” e o hotel com cnpj "09876543210000" já existe
Quando preencho nome com “Paradise”, email com “novohotel@gmail.com”, senha com “456” e cnpj com “09876543210000” e tento Cadastrar
Então aparece a mensagem “CNPJ de hotel já cadastrado” e os dados não são adicionados

Cenário: Login hotel com sucesso
Dado que estou na página “login hotel”
Quando preencho cnpj com “12345678900000” e senha com “123” e tento fazer Login
Então sou redirecionado para a página inicial do hotel e aparece a mensagem “Login realizado com sucesso”

Cenário: Login hotel com cnpj ou senha incorretos
Dado que estou na página “login hotel” e não existe hotel com cnpj “12345678900000” e senha "123"
Quando preencho cnpj com “12345678900000” e senha com "123" e tento fazer login
Então aparece a mensagem “cnpj ou senha incorretos”

Cenário: Hotel edita a senha com sucesso
Dado que estou na página “editar dados hotel” e logado como o hotel “Paradise” de senha "123"
Quando preencho o campo “senha atual” com “123” e o campo “nova senha” com “456” e tento salvar alterações
Então a senha do hotel “Paradise” é atualizada no banco de dados para “456” e aparece a mensagem “dados atualizados com sucesso”

Cenário: Hotel falha ao editar senha por senha atual incorreta
Dado que estou na página “editar dados hotel” e logado como o hotel “Paradise” de senha "123"
Quando preencho o campo “senha atual” com “senhaErrada” e o campo “nova senha” com “456” e tento salvar alterações
Então aparece a mensagem “Senha atual incorreta”