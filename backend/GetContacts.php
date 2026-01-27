<?php
    //Get all contacts for a specific user

    require_once("db.php"); //Connect to database

    //Decode JSON input from request body
    $inData = json_decode(file_get_contents("php://input"), true);

    //Prepare SQL query to fetch all contacts for the given userId
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? ORDER BY LastName, FirstName");
    $stmt->bind_param("i", $inData["userId"]); //Bind userId parameter
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

    //Return JSON response with contacts array
    echo json_encode(array("results" => $contacts, "error" => ""));

   
    $stmt->close();
    $conn->close();
?>
