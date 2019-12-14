<?php


require("icore/icore.php");
require ("icore/permission.php");
require ("handler/table.php");
require ("handler/tableAdministrartion.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,PATCH,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parsed_uri = explode( '/', $uri );

$settings = \icore\icore::getSettings();

checkAuth();
$user = $_SERVER['PHP_AUTH_USER'];
$token = $_SERVER["PHP_AUTH_PW"];
if ($_SERVER["REQUEST_METHOD"]=="GET"&& $parsed_uri[sizeof($parsed_uri)-1] == "table.php"||$_SERVER["REQUEST_METHOD"]=="GET"&& $parsed_uri[sizeof($parsed_uri)-1] == "") {
    checkPermission($user,"ispolaso.dashboard.tables");
    $table = new \icore\table();
    echo $table->getAll(\icore\table::SORT_ASC,"nummer");
} elseif($_SERVER["REQUEST_METHOD"]=="GET"&& $parsed_uri[sizeof($parsed_uri)-1] != "table.php") {
    checkPermission($user,"ispolaso.dashboard.tables");
    $table = new \icore\table();
    echo $table->getUser($parsed_uri[sizeof($parsed_uri)-1]);
}
 elseif($_SERVER["REQUEST_METHOD"]=="PATCH"&& $parsed_uri[sizeof($parsed_uri)-1] == "table.php") {
    checkPermission($user,"ispolaso.dashboard.tables");
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\table();
    $element->patchProfile($json);
} elseif($_SERVER["REQUEST_METHOD"]=="PATCH"&& $parsed_uri[sizeof($parsed_uri)-1] != "table.php") {
    checkPermission($user,"ispolaso.dashboard.tables");
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\table();
    $element->patchProfile($json,$parsed_uri[sizeof($parsed_uri)-1]);
}elseif ($_SERVER["REQUEST_METHOD"]=="PUT") {
    checkPermission($user,"ispolaso.tools.schueler");
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    $element = new \icore\addUser($json);
}
elseif($_SERVER["REQUEST_METHOD"]=="DELETE"&& $parsed_uri[sizeof($parsed_uri)-1] != "table.php") {
    checkPermission($user,"ispolaso.tools.remove");
    $element = new \icore\removeUser($parsed_uri[sizeof($parsed_uri)-1]);
}
else {
    header('HTTP/1.0 400 Bad Request');
    return true;
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
