<?php

session_start();

require_once __DIR__ . '/../controllers/stickerController.php';

$sc = new StickerController();

if ( isset( $_POST['poslano'] ) )
{
    $ime = $_POST['poslano'];

    $b = $sc->changeStickerAdd( $_SESSION['username'], $ime );

    $response = [
        'success' => true,
        'message' => 'Podaci uspjesno prihvaceni'
    ];

    header('Content-Type: application/json');
    echo json_encode( $response );
}

?>