<?php
    //Search contacts by name, email, or phone for a specific user

    require_once("db.php"); 

    //Decode JSON input from request body
    $inData = json_decode(file_get_contents("php://input"), true);

    //input validation for debuggin
    if(!$inData)
    {
        echo json_encode(["results"=> [],"error"=>"Invalid JSON input"]);
        exit();
    }
    if(!isset($inData["userId"]) || !isset($inData["search"]))
    {
        echo json_encode(["results"=> [],"error"=> "No user Id or search parameter"]);
        exit();
    }

    //Add wildcards for partial matching.
    $searchTerm = "%" . $inData["search"] . "%";

    
    //Searches FirstName, LastName, Email, and Phone fields
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?) ORDER BY LastName, FirstName");
    $stmt->bind_param("issss", $inData["userId"], $searchTerm, $searchTerm, $searchTerm, $searchTerm);
    $stmt->execute(); // Execute query

    $result = $stmt->get_result(); 

    $contacts = array();

    //Loop through all results and add to contacts array
    while($row = $result->fetch_assoc())
    {
        $contacts[] = array(
            "id" => $row["ID"],
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"],
            "phone" => $row["Phone"],
            "email" => $row["Email"]
        );
    }

    //Return JSON response with matching contacts
    echo json_encode(array("results" => $contacts, "error" => ""));

  
    $stmt->close();
    $conn->close();
?>
