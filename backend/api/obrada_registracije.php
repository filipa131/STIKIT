<?php

session_start();

require_once __DIR__ . '/../models/userService.php';
require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../database/db.class.php';


if( !isset( $_GET['niz'] ) || !preg_match( '/^[a-z]{20}$/', $_GET['niz'] ) )
	exit( 'Nešto ne valja s nizom.' );

$db = DB::getConnection();

try
{
	$st = $db->prepare( 'SELECT * FROM korisnici WHERE reg_seq=:reg_seq' );
	$st->execute( array( 'reg_seq' => $_GET['niz'] ) );
}
catch( PDOException $e )
{
    exit( 'Greška u bazi: ' . $e->getMessage() );
}

$row = $st->fetch();

if( $st->rowCount() !== 1 )
	exit( 'Taj registracijski niz ima ' . $st->rowCount() . 'korisnika, a treba biti točno 1 takav.' );
else
{
	try
	{
		$st = $db->prepare( 'UPDATE korisnici SET registriran=1 WHERE reg_seq=:reg_seq' );
		$st->execute( array( 'reg_seq' => $_GET['niz'] ) );
	}
	catch( PDOException $e )
    {
        exit( 'Greška u bazi: ' . $e->getMessage() );
    }

}

header( "Location: ../../frontend/zahvalaNaRegistraciji.html" );

?>