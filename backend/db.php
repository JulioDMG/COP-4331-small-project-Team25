<?php
//conect to local database
    $conn = mysqli_connect("localhost","theBeast","WeloveCOP4331","COP4331"); //variable
    if (mysqli_connect_errno()) //check if connection was succesful
    {
        die(json_encode(["error"=> $conn->connect_error])); //stops execution and returns an error message if no conection was stablished (json file)
    }
?>