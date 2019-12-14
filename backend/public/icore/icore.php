<?php
/**
 * Created by PhpStorm.
 * User: Jonas
 * Date: 10.12.2018
 * Time: 10:38
 */

namespace icore;

use http\QueryString;
use SimpleXMLElement;
include_once "logger.php";
include_once "database.php";
class icore
{

    public static function getSettings() {
        $settings = json_decode(json_encode(simplexml_load_string(file_get_contents(getcwd()."/settings.xml"))),true);
        if ($settings == null) {
            logger::error("Einstellungen","Die settings.xml konnte nicht gefunden werden");
            return 0;
        }
        return $settings;
    }
    public static function testwritable() {
        if (!is_dir("cache/")) {
            mkdir("cache/");
        }
        fclose(fopen("cache/test.txt","w+"));
        if (is_writable("cache/test.txt")==false)
        {
            logger::error("Schreibrechte","Es sind keine Schreibrechte auf dem Server vorhanden.");
            exit("Keine Schreibrechte auf dem Server vorhanden!");
        } else {
            return true;
        }
    }
    public static function getlevel($user) {
        $settings = self::getSettings();

        $con =new database("SELECT * FROM admins WHERE username='".$user."'");

        $result = $con->getAssoc();
        if ($result !== "") {
            return $result["level"];
        } else {
            return 0;
        }
    }
    public static function getLevelPermission($user) {
        $levels = new SimpleXMLElement(file_get_contents(getcwd()."/settings.xml"));
        $level = self::getlevel($user);
        if($level==0) {
            return "Der Benutzer ".$user." existiert nicht!";
        }
        $settings = self::getSettings();
        if($settings==0) return "Die Einstellungen wurden nicht gefunden!";
        $permissions = array();
        foreach ($levels->userlevel->level as $clevel) {
            if ($clevel["id"]==$level) {
                foreach ($clevel->permission as $permission ) {
                    array_push($permissions,$permission["id"][0]);
                }
            }
        }
        return $permissions;
    }
    public static function hasPermission($permission,$user) {
        $permissions = self::getLevelPermission($user);
        if (in_array($permission,$permissions)) {
            return true;
        } else {
            return false;
        }
    }

    public static function getAllpermissions($user)
    {
        $pemList ="";
        foreach (icore::getLevelPermission($user) as $pem) {
            if ($pemList == "") {
                $pemList = $pem[0];
            } else{
                $pemList = $pemList.",".$pem[0];
            }
        }
        return  $pemList;
    }

    public static function getLevelList()
    {
        $levels = self::getSettings();
        $levellist = $levels["userlevel"]["level"];
        $reslt = array();
        for ($i=0;$i<sizeof($levellist);$i++) {
            $level = $levellist[$i]["@attributes"];
            $reslt[$i]["name"]= $level["name"];
            $reslt[$i]["id"]= $level["id"];
        }
        return  json_encode($reslt, JSON_PRETTY_PRINT);
    }
}