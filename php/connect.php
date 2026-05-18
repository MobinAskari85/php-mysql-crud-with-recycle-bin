






<?php
$user = "root";
$password = "";

$pdo = new PDO("mysql:host=localhost;dbname=crud0401", $user, $password);
$pdo->exec("set names utf8");
try {
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
?>