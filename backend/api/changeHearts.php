<?php

session_start();

require_once __DIR__ . '/../controllers/stickerController.php';
require_once __DIR__ . '/../controllers/userController.php';

/*if (isset($_POST['koliko'])) 
{
    $_SESSION['koliko'] = $_POST['koliko'];
}*/

$sc = new StickerController();
$uc = new UserController();

if (isset($_POST['koliko']))
{
    $ime = $_POST['koliko'];

    $b = $sc->changeSticker( $_SESSION['username'], $ime );

    $response = [
        'success' => true,
        'message' => 'Podaci uspjesno prihvaceni',
        'poruka' => $b
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
}



?>