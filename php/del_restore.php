






<?php

include "connect.php";

$id = $_POST['id'];
$active = $_POST['isActive'];

$update = $pdo->prepare("update user_info set isActive= $active where id = $id");
$update->execute();
echo $update;

?>