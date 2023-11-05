<?php

session_start();

$jsonData = file_get_contents( 'php://input' );
$data = json_decode( $jsonData, true );

require_once __DIR__ . '/../controllers/userController.php';

$uc = new UserController();

$registracija = $uc->createNewUser( $data['username'], $data['password'], $data['email'] );

if ( $registracija === true ) 
{
  $response = [
    'success' => true,
    'message' => 'Registrirali ste se :)'
  ];
} 
else 
{
  $response = [
    'success' => false,
    'message' => $registracija
  ];
}

header( 'Content-Type: application/json' );
echo json_encode( $response );

?>
