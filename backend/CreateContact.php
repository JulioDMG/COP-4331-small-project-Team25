<?php
require_once("db.php");
$inData = json_decode(file_get_contents("php://input"), true);
//check if any of the fields is NULL
if(!$inData || !isset($inData["userId"])|| !isset($inData["firstName"])|| !isset($inData["lastName"])|| !isset($inData["phone"])|| !isset($inData["email"]))
    {
        echo json_encode(["id"=>0,"error"=> "Missing fields"]);
        exit();
    }
//add contact to database
$stmt = $conn->prepare("INSERT INTO  Contacts (FirstName,LastName,Phone,Email,UserID) VALUES (?,?,?,?,?)");

//check if prepare failed
if (!$stmt) {
    echo json_encode(["id"=> 0,"error"=> "Database error"]);
    $conn->close();
    exit();
}

$stmt->bind_param("ssssi", $inData["firstName"],$inData["lastName"],$inData["phone"],$inData["email"],$inData["userId"]);
//check if contact was added correctly
if($stmt->execute())
    {
        echo json_encode(["id"=> $stmt->insert_id,"error"=> ""]);
    }
    else
    {
        echo json_encode(["id"=> 0,"error"=> "Failed to add contact"]);
    }

    $stmt ->close();
    $conn ->close();
?>