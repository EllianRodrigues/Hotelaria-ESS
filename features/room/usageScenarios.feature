Feature: Hotel Room Usage Scenarios
  As a user of the hotel booking system
  I want to search for and manage hotel rooms
  So that I can find accommodations and manage my hotel's rooms

Scenario: Successful hotel room search
  Given that I am logged in with the cpf "335.447.380-07" with the password "1234"
  And that my user is a hospede
  And that I am on the initial page
  When I search for a room
  And I select the period from "2025-08-15" to "2025-08-25"
  And I select the city "Rio de Janeiro"
  And I select "2" as the number of adults
  And I confirm my search
  Then I am on the "search-results" page
  And I can see a list of available hotel rooms in "Rio de Janeiro" for the dates "2025-05-01" to "2025-06-10" that allow for "2" adults

Scenario: Incomplete hotel room search
  Given that I am logged in with the cpf "335.447.380-07" with the password "1234"
  And that my user is a hospede
  And that I am on the initial page
  When I search for a room
  And I select the period from "2025-08-15" to "2025-08-25"
  And I confirm my search
  Then I am still on the initial page
  And I receive an error message that states "Please fill out this field"

Scenario: Successful publishing of a hotel room
  Given that I am logged in with the cnpj "63.032.085/0001-00" with the password "1234"
  And that my user is a hotel manager
  And that I am on the initial page
  When I select the option "Adicionar Quarto"
  And I fill in "Chalé" as the hotel type
  And I fill in "2" as the number of adults it can accommodate
  And I fill in "100.00" as the daily cost of booking
  And I fill in "São Paulo" as the city
  And I fill in "30" as the identifier for the lodge
  And I fill in "Chalé com vista para o mar" as the description
  And I confirm
  Then when I move to the "hotel-rooms" page I can see the hotel room with description "Chalé com vista para o mar" listed
  And the system adds the hotel room with room ID "lodge-30" to my hotel

Scenario: Unsuccessful publishing of a hotel room
  Given that I am logged in with the cnpj "63.032.085/0001-00" with the password "1234"
  And that my user is a hotel manager
  And that I am on the initial page
  When I select the option "Adicionar Quarto"
  And I fill in "Chalé" as the hotel type
  And I fill in "2" as the number of adults it can accommodate
  And I confirm
  Then I receive an error message that states "Please fill out this field"