<?php

session_start();

$jsonData = file_get_contents( 'php://input' );
$data = json_decode( $jsonData, true );

require_once __DIR__ . '/../controllers/userController.php';

$uc = new UserController();

$foundUser = $uc->checkUser( $data['username'], $data['password'] );

if ( $foundUser === true ) 
{
  $_SESSION['username'] = $data['username'];

  $response = [
    'success' => true,
    'message' => 'Korisnik je ulogiran'
  ];
} 
else 
{
  $response = [
    'success' => false,
    'message' => $foundUser
  ];
}

header( 'Content-Type: application/json' );
echo json_encode( $response );

?>