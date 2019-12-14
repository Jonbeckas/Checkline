<?php /** @noinspection ALL */


namespace icore;
require_once "handler.php";


class login implements handler
{
    public function dologin($json)
    {
        $username =$json["username"];
        $password = $json["password"];
        if ($username == "" && $password == "" && $password == null && $username == null) {
            exit("{'error':'fillout'}");
        }

        $con = new \icore\database("SELECT * FROM admins WHERE username='" . $username . "'");
        $dbresult = $con->getAssoc();
        if (password_verify($password, $dbresult["hash"])) {
            $token = hash('gost', time());
            new \icore\database("UPDATE admins SET token='" . $token . "' WHERE username='" . $username . "'");
            \icore\logger::log("Login", "Der Nutzer hat sich angemeldet", $username);
            $levels = icore::getAllPermissions($username);
            exit("{'token':'$token','levels':'".$levels."'}");
        } else {
            exit("{'error':'wrongLogin'}");

        }
    }

    public function dologout($json) {
        $username =$json["username"];
        $toke = $json["token"];
        $con = new \icore\database("UPDATE admins SET token='$toke' AND username='$username'");
    }

    public function getPermission()
    {
        return "*";
    }
}