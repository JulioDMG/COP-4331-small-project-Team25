<?php
//same as the professors example but with a few modifications

    require_once("db.php"); // check for the database and define the $conn variable

    $inData = json_decode(file_get_contents("php://input"),true);

    $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?"); //creates a template
    $stmt->bind_param("ss", $inData["login"], $inData["password"]); //bind data provided by the user at login
	$stmt->execute(); //execute query

    $result = $stmt->get_result(); //store result
    
    if( $row = $result->fetch_assoc()) //check if the data provided exists
	{
		echo json_encode(["id" => $row["ID"],"firstName" => $row["firstName"],"lastName" => $row["lastName"],"error" => ""]); //json file with correct response
	}
	else
	{
		echo json_encode(["id"=>0,"error"=>"Invalid login"]); //return json with invalid login
	}

    //close statements
	$stmt->close();
	$conn->close();

?>