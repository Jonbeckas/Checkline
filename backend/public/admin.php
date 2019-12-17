<?php
require("icore/icore.php");
require ("icore/permission.php");
require "handler/userman.php";
require_once "handler/login.php";

/*header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST,PUT,OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");*/

header("Content-Type: application/json; charset=UTF-8");
//CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
//Code

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parsed_uri = explode( '/', $uri );

$settings = \icore\icore::getSettings();

if ($_SERVER["REQUEST_METHOD"]=="POST"&& strpos($uri,"login")!=false&&strpos($uri,"checklogin")==false) {
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\login();
    $element->dologin($json);
} elseif ($_SERVER["REQUEST_METHOD"]=="POST"&&strpos($uri,"checklogin")!=false) {
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\login();
    $element->checklogin($json);
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

