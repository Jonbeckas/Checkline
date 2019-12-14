<?php


namespace icore;
use PDO;

require_once "handler.php";

class addUser implements handler
{
   public function __construct($params) {
        $vorname = $params["Vorname"];
        $name = $params["Name"];
        $gruppe = $params["Gruppe"];
        $nummer = $params["Nummer"];
        $anwesenheit = $params["Anwesenheit"];
        $ankunftszeit = $params["Ankunftszeit"];
        $endzeit = $params["Endzeit"];
        $uhrzeit = $params["Uhrzeit"];
        $runde = $params["Runde"];
        $station = $params["Station"];
       if ($nummer==0) {
           header("'HTTP/1.0 403 Forbidden'");
           exit();
       }
        if($nummer=="+") {
            $result = new \icore\database("SELECT MAX(Nummer) FROM runner");
            $sqlSelect = $result->getAssoc();
            $nummer = $sqlSelect["MAX(Nummer)"]+1;
        }

        $settings = icore::getSettings();
        $pdo = new PDO("mysql:host=".$settings["mysql"]["host"].":".$settings["mysql"]["port"].";dbname=".$settings["mysql"]["database"],$settings["mysql"]["username"],$settings["mysql"]["password"]);
        $arguments = array($vorname,$name,$gruppe,$nummer,$anwesenheit,$ankunftszeit,$endzeit,$uhrzeit,$runde,$station);
        $req= $pdo->prepare("INSERT INTO runner(`Vorname`, `Name`, `Gruppe`, `Nummer`, `Anwesenheit`, `Ankunftszeit`, `Endzeit`, `Uhrzeit`, `Runde`, `Station`) VALUES (? ,? ,? ,?, ?, ?, ?, ?, ?, ?)");
        $req->execute($arguments);
    }

    public function getPermission()
    {
        return "ispolaso.tools.schueler";
    }
}

class removeUser implements handler
{
    public function __construct($nummer) {
        if ($nummer==0) {
            header("'HTTP/1.0 403 Forbidden'");
            exit();
        }
        $result = new \icore\database("DELETE FROM runner WHERE Nummer=$nummer");
    }

    public function getPermission()
    {
        return "ispolaso.tools.remove";
    }
}