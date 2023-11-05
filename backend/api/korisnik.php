<?php

session_start();

require_once __DIR__ . '/../controllers/userController.php';

$uc = new UserController();

$user = $uc->idWithUsername( $_SESSION['username'] );

$response = [
  'success' => true,
  'message' => 'Podaci uspjesno prihvaceni',
  'korisnik' => $user
];

header( 'Content-Type: application/json' );
echo json_encode( $response );

?>