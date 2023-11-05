<?php

require_once __DIR__ . '/../database/db.class.php';
require_once __DIR__ . '/user.php';

class UserService 
{

    function getUserByUsername( $username ) 
    {
        $db = DB::getConnection();

        try
        {
            $st = $db->prepare( 'SELECT * FROM korisnici WHERE username=:username' );
            $st->execute( array( 'username' => $username ) );
        }
        catch( PDOException $e ) 
        {
            exit( 'Greška u bazi: ' . $e->getMessage() );
        }

        $row = $st->fetch();

        if ( $row === false )
            return $row;
        else
            return new User( $row['id'], $row['username'], $row['password_hash'], $row['email'], $row['reg_seq'], $row['registriran'] );
    }

    function getUsernameById( $id ) 
    {
        $db = DB::getConnection();

        try
		{
			$st = $db->prepare( 'SELECT username FROM korisnici WHERE id=:id' );
			$st->execute( array( 'id' => $id ) );
		}
		catch( PDOException $e ) 
        { 
            exit( 'PDO error ' . $e->getMessage() ); 
        }

		$row = $st->fetch();
		if( $row === false )
			return null;
		else
			return $row['username'];
    }

    function getIdByUsername( $username ) 
    {
        $db = DB::getConnection();

        try
		{
			$st = $db->prepare( 'SELECT id FROM korisnici WHERE username=:username' );
			$st->execute( array( 'username' => $username ) );
		}
		catch( PDOException $e ) 
        { 
            exit( 'PDO error ' . $e->getMessage() ); 
        }

		$row = $st->fetch();
        
		if( $row === false )
			return null;
		else
			return $row['id'];
    }
}

?>