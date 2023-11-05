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
  require_once __DIR__ . '/../controllers/stickerController.php';
  require_once __DIR__ . '/../controllers/userController.php';

  $sc = new StickerController();
  $uc = new UserController();

  $stickers = $sc->userStickers( $_SESSION['username'] );

  $transformedStickers = [];
  foreach ( $stickers as $sticker ) {
    $author = $uc->usernameWithId( $sticker->user_id );
    $transformedSticker = [
      'sticker_id' => $sticker->sticker_id,
      'sticker' => base64_encode( $sticker->sticker ),
      'user_id' => $sticker->user_id,
      'date' => $sticker->date,
      'saves' => $sticker->saves,
      'author' => $author
    ];
    $transformedStickers[] = $transformedSticker;
  }

  $response = [
    'success' => true,
    'message' => 'Podaci uspjesno prihvaceni',
    'stickers' => $transformedStickers
  ];
  header('Content-Type: application/json');
  echo json_encode($response);
}

?>