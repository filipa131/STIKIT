<?php

require_once __DIR__ . '/../models/userService.php';
require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../database/db.class.php';

class UserController 
{
    
    function checkUser( $username, $password ) 
    {
        $us = new UserService();

        $user = $us->getUserByUsername( $username );

        if( $user === false )
        {
            return 'Ne postoji korisnik s tim imenom!';
        }
        else if( !password_verify( $password, $user->password_hash ) )
        {
            return 'Lozinka nije ispravna.';
        }
        else if( $user->registriran === '0' )
        {
            return 'Niste se još potvrdili registraciju!';
        }
        else
        {
            return true;
        }
    }

    function createNewUser( $username, $password, $email ) 
    {
        $us = new UserService();

        $user = $us->getUserByUsername( $username );

        if( $user !== false )
        {
            return 'Korisnik postoji!';
        }
        else
        {
            if ( $username === '' || $password === '' || $email === '' )
            {
                return 'Upišite sve podatke!';
            } 
            else if ( !preg_match( '/^[A-Za-z]{3,10}$/', $username ) ) 
            {
                return 'Korisničko ime treba imati između 3 i 10 slova.';
            }
            else if ( !filter_var( $email, FILTER_VALIDATE_EMAIL ) )
            {
                return 'E-mail adresa nije ispravna.';
            }
            else
            {
                $reg_seq = '';
                for( $i = 0; $i < 20; ++$i )
                {
                    $reg_seq .= chr( rand( 0, 25 ) + ord( 'a' ) ); // Zalijepi slučajno odabrano slovo
                }

                $db = DB::getConnection();

                try
                {
                    $st = $db->prepare( 'INSERT INTO korisnici(username, password_hash, email, reg_seq, registriran) VALUES (:username, :password_hash, :email, :reg_seq, 0)' );
                    $st->execute( array( 'username' => $username, 'password_hash' => password_hash( $password, PASSWORD_DEFAULT ), 'email' => $email, 'reg_seq'  => $reg_seq ) );
                }
                catch( PDOException $e )
                {
                    exit( 'Greška u bazi: ' . $e->getMessage() );
                }

                $to       = $email;
                $subject  = 'Registracijski mail';
                $message  = 'Poštovani ' . $username . "!\nZa dovršetak registracije kliknite na sljedeći link: http://rp2.studenti.math.hr/~dimnjiva/projekt/RPII-main/backend/api/obrada_registracije.php?niz=" . $reg_seq;
                $headers  = 'From: rp2@studenti.math.hr' . "\r\n" .
                            'Reply-To: rp2@studenti.math.hr' . "\r\n" .
                            'X-Mailer: PHP/' . phpversion();

                $isOK = mail( $to, $subject, $message, $headers );

                if( !$isOK )
                {
                    exit( 'Greška: ne mogu poslati mail. (Pokrenite na rp2 serveru.)' );
                }

                return true;
            }
        }
    }

    function usernameWithId( $id ) 
    {
        $us = new UserService();

        $username = $us->getUsernameById( $id );

        return $username;
    }

    function idWithUsername( $username )
    {
        $us = new UserService();

        $id = $us->getIdByUsername( $username );

        return $id;
    }
}

?>