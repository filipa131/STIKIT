<?php

class User 
{
    private $id, $username, $password_hash, $email, $saves, $registriran;


    function __construct( $id, $username, $password_hash, $email, $reg_seq, $registriran ) 
    {
        $this->id = $id;
        $this->username = $username;
        $this->password_hash = $password_hash;
        $this->email = $email;
        $this->reg_seq = $reg_seq;
        $this->registriran = $registriran;
    }

    public function __get( $property ) 
    {
        if( property_exists( $this, $property ) )
            return $this->$property;
    }

    public function __set( $property, $value ) 
    {
        if( property_exists( $this, $property ) )
            $this->$property = $value;
        return $this;
    }
}

?>