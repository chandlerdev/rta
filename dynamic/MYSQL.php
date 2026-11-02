<?php
/*****************************************************************************
 *                                                                           *
 * Copyright (c) 2013. All rights reserved.         				 		 *
 *                                                                           *
 ****************************************************************************/
//	database functions :: MySQLI
function db_iconnect($host,$user,$pass, $db) //create connection
{
	return mysqli_connect($host,$user,$pass,$db);
}
 
//	database functions :: MySQL
function db_connect($host,$user,$pass) //create connection
{
	return mysql_connect($host,$user,$pass);
}

function db_select_db($name) //select database
{
	return mysql_select_db($name);
}

function db_iquery($cn, $s) //database query
{
	return mysqli_query($cn, $s);
}

function db_query($s) //database query
{
	return mysql_query($s);
}

function db_fetch_row($q) //row fetching
{
	return mysql_fetch_row($q);
}

function db_fetch_array($q) //row fetching
{
	return mysql_fetch_assoc($q);
}

function db_fetch_object($q) //row fetching
{
	return mysql_fetch_object($q);
}

function db_bof($q,$numrow) //row fetching
{
  $bof=mysql_data_seek($q, $numrow);
  return $bof;

}

function db_set_identity($table) //actual for MSSQL only
{
	return 1;
}

function db_insert_id($gen_name = "") //id of last inserted record
				//$gen_name is used for InterBase
{
	return mysql_insert_id();
}

function db_error() //database error message
{
	return mysql_error();
}

function db_close($conn) //database error message
{
	return mysqli_close($conn);
}

?>
