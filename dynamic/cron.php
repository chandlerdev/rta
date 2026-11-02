<?php
ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);
require __DIR__ . '/vendor/autoload.php';
use Twilio\Rest\Client;
require __DIR__ . '/twilio_config.php';
date_default_timezone_set('America/Chicago');
$mysqli = new mysqli("localhost", "trackappt", "@@@Houston77042$$$", "trackappt");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$now = date('Y-m-d H:i:00'); // current minute
// echo $now;die;
$sql = "SELECT * FROM accounts_operation_sms WHERE sms_time = ? AND sms_sent = 0 AND is_deleted = 0";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $now);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $phone = $row['phone'];
    $message = $row['sms_content'];
    // send SMS via API (pseudo-code below)
    send_sms($phone, $message);
    // mark as sent
    $update = $mysqli->prepare("UPDATE accounts_operation_sms SET sms_sent = 1 WHERE id = ?");
    $update->bind_param("i", $row['id']);
    $update->execute();
}

$stmt->close();
$mysqli->close();

function send_sms($phone, $message) {
    // Use your SMS provider API here (like Twilio, MSG91, etc.)
    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";
    $tonumber = $phone;
    $client = new Client($account_sid, $auth_token);
    $client->messages->create(
        $tonumber,
        array(
            'from' => $twilio_number,
            'body' => $message
        )
    );
    echo "Sending to $phone: $message\n";
}
?>
