<?php
//conect to local database
    $conn = mysqli_connect("localhost","TheBeast","WeLoveCOP4331","COP4331"); //variable
    if ($conn->connect_error) //check if connection was succesful
    {
        die(json_encode(["error"=> $conn->connect_error])); //stops execution and returns an error message if no conection was stablished (json file)
    }
?>