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

    public static function checkToken($token) {
        $req = new database("SELECT token FROM admins WHERE token='$token'");
        $tk = $req->getAssoc();
        if ($tk["token"]=="") {
            return false;
        } else{
            return true;
        }
    }

    public static function getNameByToken($token) {
        $req = new database("SELECT * FROM admins WHERE token='$token'");
        $tk = $req->getAssoc();
        return $tk["username"];
    }


    public static function getLevel($username) {
        $level =new database("SELECT level FROM admins WHERE username='$username'");
        $level = $level->getAssoc();
        return $level;
    }
}