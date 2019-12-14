<?php


namespace icore;
require "handler.php";
use icore\database;
use icore\handler;
use PDO;

class table implements handler
{
    public const SORT_DESC= 0;
    public const SORT_ASC=1;

    public function getAll($sort,$category) {
        $result = new \icore\database("SELECT * FROM runner WHERE Vorname NOT LIKE '%MAN_%' ORDER BY `Nummer` ASC");
        $sqlSelect = $result->getAssoc();
        if (isset($category)==true&&isset($sort)==true)
        {
            $sorto  = array_column($sqlSelect, $category);
            if ($sort == "SORT_DESC")
            {
                array_multisort($sorto, SORT_DESC, $sqlSelect); //Absteigend
            }
            elseif ($sort == "SORT_ASC")
            {
                array_multisort($sorto, SORT_ASC, $sqlSelect); //Aufsteigend
            }
        }
        else
        {
            $sorto  = array_column($sqlSelect, "Nummer");
            array_multisort($sorto, SORT_ASC, $sqlSelect);
        }


        echo json_encode($sqlSelect, JSON_PRETTY_PRINT);
    }
    public function getUser($id) {
        $this->testzero($id);
        $result = new \icore\database("SELECT * FROM runner WHERE Vorname NOT LIKE '%MAN_%' AND Nummer='$id'");
        $sqlSelect = $result->getAssoc();
        echo json_encode($sqlSelect, JSON_PRETTY_PRINT);
    }

    public function patchProfile($array,$nummerv=null) {
        $nummer = $array["Nummer"];
        if ($nummerv!=null) {
            $nummer = $nummerv;
        }
        $result = new \icore\database("SELECT * FROM runner WHERE Vorname NOT LIKE '%MAN_%' AND Nummer='$nummer'");
        $sqlSelect = $result->getAssoc();
        isset($array["Vorname"]) ? $vorname = $array["Vorname"] : $vorname = $sqlSelect["Vorname"];
        isset($array["Name"]) ? $name = $array["Name"] : $name = $sqlSelect["Name"];
        isset($array["Gruppe"]) ? $gruppe = $array["Gruppe"] : $gruppe = $sqlSelect["Gruppe"];
        isset($array["Anwesenheit"]) ? $anwesenheit = $array["Anwesenheit"] : $anwesenheit = $sqlSelect["Anwesenheit"];
        isset($array["Ankunftszeit"]) ? $ankunftszeit = $array["Ankunftszeit"] : $ankunftszeit = $sqlSelect["Ankunftszeit"];
        isset($array["Endzeit"]) ?$endzeit = $array["Endzeit"] : $endzeit = $sqlSelect["Endzeit"];
        isset($array["Uhrzeit"]) ?$uhrzeit = $array["Uhrzeit"] : $uhrzeit = $sqlSelect["Uhrzeit"];
        isset($array["Runde"]) ? $runde = $array["Runde"] : $runde = $sqlSelect["Runde"];
        isset($array["Station"]) ? $station = $array["Station"] : $station = $sqlSelect["Station"];
        isset($array["old"]) ?$old = $array["old"] : $old=$sqlSelect["Nummer"];
        $this->testzero($nummer);
        $settings = icore::getSettings();
        $pdo = new PDO("mysql:host=".$settings["mysql"]["host"].":".$settings["mysql"]["port"].";dbname=".$settings["mysql"]["database"],$settings["mysql"]["username"],$settings["mysql"]["password"]);
        $arguments = array($vorname,$name,$gruppe,$nummer,$anwesenheit,$ankunftszeit,$endzeit,$uhrzeit,$runde,$station,$old);
        $req= $pdo->prepare("UPDATE runner SET Vorname=?,Name=?,Gruppe=?,Nummer=?,Anwesenheit=?,Ankunftszeit=?,Endzeit=?,Uhrzeit=?,Runde=?,Station=? WHERE Nummer=?");
        $req->execute($arguments);
    }

    private function testzero($nummer){
        if ($nummer==0) {
            header("'HTTP/1.0 403 Forbidden'");
            exit();
        }
    }
    public function getPermission()
    {
        return "ispolaso.dashboard.tables";
    }
}

