Scenario: Successful hotel room search
  Given that I am logged in with the email "ana.clara@gmail.com" with the password "1234"
  And that my user is a guest
  And that I am on the page "/available-rooms"
  When I select the period from "01/05/2025" to "10/06/2025"
  And I select the city "Recife"
  And I select "2" as the number of adults
  And I confirm my search
  Then I am on the "Results" page
  And I can see a list of available hotel rooms in "Recife" for the dates
  "01/05/2025" to "10/06/2025" that allow for "2" adults

Scenario: Incomplete hotel room search
  Given that I am logged in with the email "ana.clara@gmail.com" with the password "1234"
  And that my user is a guest
  And that I am on the page "/available-rooms"
  When I select the period from "01/05/2025" to "10/06/2025"
  And I select the city "Recife"
  And I confirm my search
  Then I am still on the "Available Rooms" page
  And I receive an error message that states "Incomplete information"

Scenario: Successful publishing of a hotel room
  Given that I am logged in with the email "guilherme.fernandes@gmail.com" with the password "1234"
  And that my user is a hotel manager
  And that I am on the page "/hotel/rooms"
  When I select the option "Add New Hotel Room"
  And I fill in "Cottage" as the hotel type
  And I fill in "2" as the number of adults it can accommodate
  And I fill in R$ "100,00" as the daily cost of booking
  And I add the photo "example.png"
  And I fill in "30" as the identifier for the cottage
  And I confirm
  Then I am still on the "My Hotel Rooms" page
  And I see a success message that states “Hotel Room Added”
  And I can see the hotel room with room ID "Cottage 30" listed
  And the system adds the hotel room with room ID "Quarto 30" to my hotel

Scenario: Unsuccessful publishing of a hotel room
  Given that I am logged in with the email "guilherme.fernandes@gmail.com" with the password "1234"
  And that my user is a "hotel manager"
  And that I am on the page "/hotel/rooms"
  When I select the option "Add New Hotel Room"
  And I fill in "Chalé" as the hotel type
  And I fill in "2" as the number of adults it can accommodate
  And I fill in R$ "100,00" as the daily cost of booking
  And I add the photo "example.png"
  And I confirm
  Then I am still on the "Add New Hotel Room" section
  And I receive an error message that states "Incomplete information"