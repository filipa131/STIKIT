<?php

session_start();

require_once __DIR__ . '/../controllers/stickerController.php';

$sc = new StickerController();

if ( isset( $_POST['img'] ) ) 
{
    $blob = $_POST['img'];

    $sc->uploadSticker( $_SESSION['username'], $blob, $_POST['tags'] );

    $response = [
        'success' => true,
        'message' => 'Sticker uspjesno pohranjen.'
    ];

    header( 'Content-Type: application/json' );
    echo json_encode( $response );
}
