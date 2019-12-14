<?php


namespace icore;
include_once "icore.php";
class logger
{
    public static function log($part,$text,$user=""){
        if($user==null) $user="";
        $log = self::doForAll();
        fwrite($log,"<log time='".strftime("[%d.%m.%Y %H:%M]",time())."' user='".$user."' part='".$part."'>".$text."</log>\n");
        fclose($log);
    }
    public static function warn($part,$text,$user=""){
        if($user==null) $user="";
        $log = self::doForAll();
        fwrite($log,"<warning time='".strftime("[%d.%m.%Y %H:%M]",time())."' user='".$user."' part='".$part."'>".$text."</warning>\n");
        fclose($log);
    }
    public static function error($part,$text,$user=""){
        if($user==null) $user="";
        $log = self::doForAll();
        fwrite($log,"<error time='".strftime("[%d.%m.%Y %H:%M]",time())."' user='".$user."' part='".$part."'>".$text."</error>\n");
        fclose($log);
    }
    private static function doForAll() {
        if (!icore::testwritable()) {
            exit("Keine Schreibrechte");
        }
        if(file_exists("Logs/")==false)
        {
            mkdir("Logs/");
            $clientLog = fopen("Logs/.htaccess", "w");
            fwrite($clientLog, "<Files \"*.*\">\nDeny from all\n</Files>");
            fclose($clientLog);
        }
        $log = fopen("Logs/log.txt","a");
        return $log;

    }
}