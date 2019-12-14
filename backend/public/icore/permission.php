<?php


namespace icore;


class permission
{
    public static function checkLogin($username, $password) {

        if ($username == "" && $password == "" && $password == null && $username == null)
        {
            return false;
        }
        $settings = icore::getSettings();
        if ($settings == 0) {
            return false;
        }

        $hash =new database("SELECT * FROM admins WHERE username='$username'");
        $hash = $hash->getAssoc();


//echo $password;
        if(isset($hash)&&isset($password) && $hash["token"] === $password ) {
            return true;
        }
        else {
            return false;
        }
    }


    public static function getLevel($username) {
        $level =new database("SELECT level FROM admins WHERE username='$username'");
        $level = $level->getAssoc();
        return $level;
    }
}