



<?php

include "connect.php";

$id = $_POST['id'];
$fname = $_POST['fname'];

$update = $pdo->prepare("update user_info set f_name='$fname' where id = $id");
$update->execute();

echo $update;
?>