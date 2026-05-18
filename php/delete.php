






<?php

include "connect.php";

$id = $_POST['id'];

$delete = $pdo->prepare("delete from user_info where id = $id");
$x = $delete->execute();
echo $x;

?>