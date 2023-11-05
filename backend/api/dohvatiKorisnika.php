<?php

session_start();

if ( !isset( $_SESSION['username'] ) ) 
{
  $response = [
    'success' => false,
    'message' => 'Korisnik nije ulogiran',
    'stickers' => null
  ];
    header( 'Content-Type: application/json' );
    echo json_encode( $response );
}
else 
{
  $korisnik = $_SESSION['username'];

  $response = [
    'success' => true,
    'message' => 'Podaci uspjesno prihvaceni',
    'korisnik' => $korisnik
  ];
  header( 'Content-Type: application/json' );
  echo json_encode( $response );
}

?>