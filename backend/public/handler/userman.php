<?php


namespace icore;

require_once "handler.php";

class userman implements handler
{

    public function newAdmin($json, $autUser)
    {
        $username = $json["username"];
        $hash =password_hash($json["password"],PASSWORD_DEFAULT);
        $rog = new \icore\database("SELECT * FROM admins WHERE username='$username'");
        $rog = $rog->getAssoc();
        if($rog["username"]==""&&$username!="") {
            new \icore\database("INSERT INTO `admins`(`username`, `hash`, `level`,token,lrefresh) VALUES ('" .$username. "','" . $hash . "','" .$json["level"]. "','','0')");
            \icore\logger::log("Admin Erstellen","Der Nutzer hat den Admin ".$username." erstellt",$autUser);
        } else {
            header('HTTP/1.0 409 Conflict');
        }
    }


    public function getPermission()
    {
        return "ispolaso.user.manage";
    }


}