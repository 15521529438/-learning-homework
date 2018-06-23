<?php
header("Content-type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT,DELETE');
$con = mysql_connect("localhost","root","");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }else{
  	mysql_select_db("PHPlesson", $con);
  	mysql_query("set names 'utf8'");
	$num = $_REQUEST['num'];
	// mysql_query("INSERT INTO `likes`(`num`) VALUES ($num)");
	mysql_query("UPDATE likes SET num=$num WHERE id=1");
	echo 'success!';
  }

mysql_close($con);
?>