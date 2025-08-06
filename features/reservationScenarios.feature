Funcionalidade: Reserva de quarto

Cenário: Hóspede faz uma reserva de um quarto
Dado que existe um hóspede cadastrado com nome "Ellian", email "ellian@gmail.com", senha "123" e cpf "12345678900"
E existe um hotel cadastrado com nome "Paradise", email "paradise@gmail.com", senha "123" e cnpj "12345678900000"
E existe um quarto disponível no hotel com identifier "1", type "lodge", n_of_adults "2", description "Quarto de teste", cost "100", photos "foto1.png", city "Recife" e hotel_id do hotel cadastrado
Quando o hóspede faz uma reserva para o quarto de "2024-07-01" até "2024-07-05"
Então a reserva é criada com sucesso e associada ao hóspede de cpf "12345678900" e ao quarto de identifier "1" do hotel "Paradise"