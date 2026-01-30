<?php
require_once("db.php");

$indata = json_decode(file_get_contents("php://input"),true);
//check for data
if (!$indata)
{
    die(json_encode(["error" => "Invalid JSON input"]));
}

$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
$stmt->bind_param("ssss", $indata["firstName"],$indata["lastName"], $indata["login"],$indata["password"]);
if($stmt->execute())
{
    echo json_encode(["error"=>""]);
}else 
{
    echo json_encode(["error"=> $stmt->error]);
}
$stmt->close();
$conn->close();
?>