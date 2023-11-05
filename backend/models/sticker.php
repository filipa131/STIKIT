<?php

class Sticker 
{
    private $sticker_id, $sticker, $user_id, $date, $saves;

    function __construct($sticker_id, $sticker, $user_id, $date, $saves) 
    {
        $this->sticker_id = $sticker_id;
        $this->sticker = $sticker;
        $this->user_id = $user_id;
        $this->date = $date;
        $this->saves = $saves;
    }

    public function __get($property) 
    {
        if(property_exists($this, $property))
            return $this->$property;
    }

    public function __set($property, $value) 
    {
        if(property_exists($this, $property))
            $this->$property = $value;
        return $this;
    }
}

?>