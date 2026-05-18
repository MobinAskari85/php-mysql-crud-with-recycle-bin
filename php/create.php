





<?php

include "connect.php";


$fname = $_POST['fname'];
$turn = $_POST['turn'];

$insert = $pdo->prepare("insert into user_info(f_name, turn) values ('$fname', $turn)");
$exe = $insert->execute();

echo $exe;

?>