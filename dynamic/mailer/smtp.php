<?php
$mail = new PHPMailer();
$mail->IsSMTP();    // send via SMTP
$mail->Host     =  "smtp.1and1.com"; // SMTP servers
$mail->Port     =   587 ; // SMTP Port
$mail->SMTPAuth =   true;     // turn on SMTP authentication
$mail->Username =  "info@desss.com";  // SMTP username
$mail->Password =  "earth05"; // SMTP password
$mail->IsHTML(true);
?>