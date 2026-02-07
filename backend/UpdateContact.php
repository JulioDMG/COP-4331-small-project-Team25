<?php
require_once("db.php");
$inData = json_decode(file_get_contents("php://input"), true);

//check if any of the fields is NULL
if(!$inData || !isset($inData["userId"])|| !isset($inData["firstName"])|| !isset($inData["lastName"])|| !isset($inData["phone"])|| !isset($inData["email"]))
    {
        echo json_encode(["id"=>0,"error"=> "Missing fields"]);
        exit();
    }
//update contact
$stmt = $conn->prepare("UPDATE Contacts set FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? and UserID=?");
$stmt->bind_param("ssssii", $inData["firstName"],$inData["lastName"],$inData["phone"],$inData["email"],$inData["id"],$inData["userId"]);

//check if contact was updated correctly
if($stmt->execute() && $stmt->affected_rows > 0)
    {
        echo json_encode(["error"=> ""]);
    }
    else
    {
        echo json_encode(["error"=> "Contact not found"]);
    }

    $stmt ->close();
    $conn ->close();
    ?>