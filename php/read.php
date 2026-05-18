






<?php

include "connect.php";

$active = $_POST["isActive"];
$read = $pdo->prepare("select * from user_info where isActive = $active order by id");
$read->execute();

$result = $read->fetchAll(PDO::FETCH_ASSOC);
echo  json_encode($result, JSON_UNESCAPED_UNICODE);

?>