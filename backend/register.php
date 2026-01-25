<?php
require_once("db");

$_indata= json_decode(file_get_contents("php://input"),true);
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
$stmt->bind_param("ssss", $_indata["firstname"],$_indata["lastname"],$_indata["Login"],$_indata["Password"]);
if( $stmt->execute() )
    {
        echo json_encode(["error"=>""]);
    } else 
    {
        echo json_encode(["error"=> $stmt->error]);
    }
    $stmt->close();
    $conn->close();
    ?>