<?php


namespace icore;


use PDO;

class database {
    private $result;
    public function __construct($request,$user=null){
        $settings = icore::getSettings();
        $pdo = new PDO("mysql:host=".$settings["mysql"]["host"].":".$settings["mysql"]["port"].";dbname=".$settings["mysql"]["database"],$settings["mysql"]["username"],$settings["mysql"]["password"]);
        //$request=str_replace(","," ",$request);
        $param = explode("=",$request);
        if(isset($param[1])) {
            $query = "";
            $paramarray = array();
            for ($i=0;$i<count($param);$i++) {
                if (($i+1)%2!=0) {
                    $query = $query.$param[$i]."=? ";
                    if (isset($param[$i+1])) {
                        $stro =explode(" ",$param[$i+1],2);
                        $str = $stro[0];
                        $str = str_replace("'","",$str);
                        $str=str_replace("\"","",$str);
                        $str=str_replace("`","",$str);
                        array_push($paramarray,$str);
                        if (isset($stro[1])) {
                            $query = $query.$stro[1]."=?";
                            $str = str_replace("'","",$param[$i+2]);
                            $str=str_replace("\"","",$str);
                            $str=str_replace("`","",$str);
                            array_push($paramarray,$str);
                            $i++;
                            $i++;
                        }
                    }
                }
            }
            $req = $pdo->prepare($query);
            if( $req->execute($paramarray)) {
                $this->result= $req->fetchAll(PDO::FETCH_ASSOC);
            } else {
                logger::error("Datenbank",$req->errorInfo()[2]);
            }
        } else{
            $req = $pdo->prepare($request);
            if( $req->execute()) {
                $this->result= $req->fetchAll(PDO::FETCH_ASSOC);
            } else {
                logger::error("Datenbank",$req->errorInfo()[2]);
            }
        }
    }

    public function getAssoc() {
        $res = $this->result;
        if ($res==false) {
            echo null;
            return null;
        } else {
            if (sizeof($res)==1) {
                return $res[0];
            } else {
                return $res;
            }
        }
    }
}