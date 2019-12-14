<?php
require("icore/icore.php");
require ("icore/permission.php");
require "handler/userman.php";
require_once "handler/login.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parsed_uri = explode( '/', $uri );

$settings = \icore\icore::getSettings();

if ($_SERVER["REQUEST_METHOD"]=="POST"&& strpos($uri,"login")!=false) {
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\login();
    $element->dologin($json);
}

checkAuth();
$user = $_SERVER['PHP_AUTH_USER'];
$token = $_SERVER["PHP_AUTH_PW"];


if($_SERVER["REQUEST_METHOD"]=="PUT") {
checkPermission($user,"ispolaso.user.manage");
$request = file_get_contents("php://input");
$json = json_decode($request, true);
$element = new \icore\userman();
$element->newAdmin($json,$user);
} elseif ($_SERVER["REQUEST_METHOD"]=="POST"&& strpos($uri,"logout")!=false) {
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\login();
    $element->dologout($json);
}







function checkPermission($user,$permission) {
    if (!\icore\icore::hasPermission($permission,$user)) {
        header('HTTP/1.0 401 Unauthorized');
        return true;

    }
    return false;
}
function checkAuth() {
    if (array_key_exists("PHP_AUTH_PW",$_SERVER)&& array_key_exists("PHP_AUTH_PW",$_SERVER)) {
        if (!\icore\permission::checkLogin($_SERVER['PHP_AUTH_USER'],$_SERVER["PHP_AUTH_PW"])) {
            header('HTTP/1.0 401 Unauthorized');
            exit();
        }
    }
    else {
        header('HTTP/1.0 401 Unauthorized');
        exit();
    }
}

