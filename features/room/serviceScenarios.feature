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
  Given that there is no hotel room with identifier "30" under type "lodge" in the system for the hotel with ID "1"
  When a request is made to add a new hotel room with: type "lodge", "n_of_adults" "2", "cost" "100.00", "photos" ["example.png"], "identifier" "30", hotel_id "1"
  Then the service creates the hotel room
  And returns a success response with the code "201"
  And the response includes the room identifier "30" and the type "lodge"

Scenario: Unsuccessful publishing of a hotel room
  Given that the system has a hotel with ID "1"
  When a request is made to add a new hotel room with: "lodge", "n_of_adults" "2", "cost" "100.00", "photos" ["example.png"], hotel_id "1", but without an identifier
  Then the service returns an error response with the code "400"
  And the error message states "Incomplete information"
  And no hotel room is created

Scenario: Duplicate room creation attempt
  Given that a hotel room with identifier "25" and type "hotelRoom" already exists in the system for hotel with ID "1"
  When a request is made to create another hotel room with the same identifier "25", type "hotelRoom", and hotel_id "1"
  Then the service returns an error response with the code "409"
  And the error message states "Room with same identifier, type, and hotel_id already exists"
  And no duplicate room is created

Scenario: Successful room retrieval by ID
  Given that a hotel room with identifier "101" and type "lodge" exists in the system for hotel with ID "1"
  When a request is made to retrieve the room with ID "lodge-101" for hotel_id "1"
  Then the service returns a success response with the code "200"
  And the response includes the room with identifier "101" and type "lodge"

Scenario: Room not found by ID
  Given that no hotel room with identifier "999" and type "hotelRoom" exists in the system for hotel with ID "1"
  When a request is made to retrieve the room with ID "hotelRoom-999" for hotel_id "1"
  Then the service returns an error response with the code "404"
  And the error message states "Room not found"

Scenario: Successful room update
  Given that a hotel room with identifier "102" and type "lodge" exists in the system for hotel with ID "1"
  When a request is made to update the room with ID "1" to change the cost to "250.00" and description to "Updated room description"
  Then the service returns a success response with the code "200"
  And the response includes the message "Room updated successfully"

Scenario: Room update with invalid data
  Given that a hotel room with identifier "104" and type "lodge" exists in the system for hotel with ID "1"
  When a request is made to update the room with ID "1" with invalid cost value "invalid_cost"
  Then the service returns an error response with the code "400"
  And the error message indicates the validation failure

Scenario: Successful room deletion
  Given that a hotel room with identifier "105" and type "lodge" exists in the system for hotel with ID "1"
  When a request is made to delete the room with ID "1"
  Then the service returns a success response with the code "200"
  And the response includes the message "Room deleted successfully"

Scenario: Room deletion of non-existent room
  Given that no hotel room with ID "999" exists in the system
  When a request is made to delete the room with ID "999"
  Then the service returns an error response with the code "404"
  And the error message states "Room not found"

Scenario: Get all rooms from a specific hotel
  Given that multiple hotel rooms exist in the system for hotel with ID "1"
  When a request is made to retrieve all rooms for hotel_id "1"
  Then the service returns a success response with the code "200"
  And the response includes an array of rooms
  And all rooms in the response have hotel_id "1"

Scenario: Search for rooms with no available results
  Given that no hotel rooms exist in the system for city "Manaus" that accommodate "4" adults during the period from "2025-07-01" to "2025-07-15"
  When a request is made to search for available hotel rooms with city "Manaus", period "2025-07-01" to "2025-07-15", and number of adults "4"
  Then the service returns a success response with the code "200"
  And the response includes an empty array of available rooms

Scenario: Search for rooms with overlapping reservations
  Given that a hotel room exists in the system for city "Brasília" that accommodates "2" adults
  And the room has an existing reservation from "2025-08-01" to "2025-08-10"
  When a request is made to search for available hotel rooms with city "Brasília", period "2025-08-05" to "2025-08-15", and number of adults "2"
  Then the service returns a success response with the code "200"
  And the response does not include the room with overlapping reservation

