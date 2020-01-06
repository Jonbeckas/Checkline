<?php


require("icore/icore.php");
require ("icore/permission.php");
require ("handler/table.php");
require ("handler/tableAdministrartion.php");

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
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
//code

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parsed_uri = explode( '/', $uri );

$settings = \icore\icore::getSettings();


$user = checkAuth();

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
    $request = file_get_contents("php://input");
    $json = json_decode($request, true);
    if (isset($json["token"])) {
          if (!\icore\permission::checkToken($json["token"])) {
              header('HTTP/1.0 401 Unauthorized');
              exit();
          } else {
            return \icore\permission::getNameByToken($json["token"]);
          }
    }
    else {
        header('HTTP/1.0 401 Unauthorized');
        exit();
    }
}
