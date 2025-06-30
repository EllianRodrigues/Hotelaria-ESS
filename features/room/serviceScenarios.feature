Scenario: Successful hotel room search
  Given that available hotel rooms exist in the system for city "Recife" that accommodate "2" adults during the period from "2025-05-01" to "2025-06-10"
  When a request is made to search for available hotel rooms with city "Recife", period "2025-05-01" to "2025-06-10", and number of adults "2"
  Then the service returns a success response with the code "200"
  And the response includes a list of those available hotel rooms

Scenario: Incomplete hotel room search
  Given that the system has hotel rooms available for city "Recife" and period "2025-05-01" to "2025-06-10"
  When a request is made to search for available hotel rooms with city "Recife" and period "2025-05-01" to "2025-06-10" but without specifying the number of adults
  Then the service returns an error response with the code "400"
  And the error message states "Incomplete information"
  
Scenario: Successful publishing of a hotel room
  Given that there is no hotel room with identifier "30" under type "lodge" in the system for the hotel with identifier "1"
  When a request is made to add a new hotel room with: type "lodge", "n_of_adults" "2", "cost" "100.00", "photos" ["example.png"], "identifier" "30", hotel_id "1"
  Then the service creates the hotel room
  And returns a success response with the code "201"
  And the response includes the room identifier "30" and the type "lodge"

Scenario: Unsuccessful publishing of a hotel room
  Given that the system does not contain a hotel room with missing required fields (e.g., missing identifier)
  When a request is made to add a new hotel room with: "lodge", "n_of_adults" "2", "cost" "100.00", "photos" ["example.png"], hotel_id "1", but without an identifier
  Then the service returns an error response with the code "400"
  And the error message states "Incomplete information"
  And no hotel room is created

