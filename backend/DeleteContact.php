<?php
require_once("db.php");
$inData = json_decode(file_get_contents("php://input"), true);

//check if any of the fields is NULL
if(!$inData || !isset($inData["id"])|| !isset($inData["userId"]))
    {
        echo json_encode(["id"=>0,"error"=> "Missing fields"]);
        exit();
    }
//Delete contact
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? and UserID=?");
$stmt->bind_param("ii", $inData["id"],$inData["userId"]);

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