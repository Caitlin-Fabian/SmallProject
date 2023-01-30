<?php

	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
//	ECHO $firstName;
	$lastName = $inData["lastName"];
//	ECHO $lastName;
	$userName = $inData["userName"];
//	ECHO $userName;
	$loginPassword = $inData["loginPassword"];
//	ECHO $loginPassword;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("select * from Users where Login=?");
		$stmt->bind_param("s", $userName );
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc() )
		{
			$stmt->close();
			$conn->close();

			returnWithError("That user name already exists");
		}
		else
		{
			$stmt->close();

			$stmt = $conn->prepare("insert into Users (FirstName,LastName,Login,Password) VALUES (?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $userName, $loginPassword);
			$stmt->execute();

			$stmt->close();
			$conn->close();

			returnWithError("Success!");
		}


	}

//	returnWithError("test");

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
