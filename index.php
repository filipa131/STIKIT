<?php

$rt = isset( $_GET['rt'] ) ? $_GET['rt'] : '';

switch ($rt) 
{
    case '':
        require_once 'frontend/home.html';
        break;
    case 'login':
        require_once 'frontend/login.html';
        break;
    case 'explore':
        require_once 'frontend/explore.html';
        break;
    case 'user':
        require_once 'frontend/user.html';
        break;
    case 'add':
        require_once 'frontend/add.html';
        break;
    case 'logout':
        require_once 'frontend/logout.html';
        break;
    default:
        require_once 'frontend/404.html';
        break;
}

?>