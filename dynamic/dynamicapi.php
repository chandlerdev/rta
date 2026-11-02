<?php 
ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);
require __DIR__ . '/vendor/autoload.php';
use Twilio\Rest\Client;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/vxl/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Reader\Xlsx; 

//-----connection--------------
define('DBMS', 'MYSQL'); // database system
define('DB_HOST', 'localhost'); // database host
define('DB_USER', 'trackappt'); // username
define('DB_PASS', '@@@Houston77042$$$'); // password
define('DB_NAME', 'trackappt'); // data

require __DIR__ . '/twilio_config.php';
include("MYSQL.php");
// header('Access-Control-Allow-Origin: *');
Header('Access-Control-Allow-Origin: *'); //for allow any domain, insecure
Header('Access-Control-Allow-Headers: *'); //for allow any headers, insecure
Header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE'); //method allowed

// header('Content-Type : application/json;charset=utf-8');
// date_default_timezone_set('America/Chicago');
// $script_tz = date_default_timezone_get();

if (isset($_REQUEST['action'])) 
{
    $action = $_REQUEST['action']; 
} 
else 
{
    $action = "";
}

switch (strtolower(trim($action))) 
{ 
    case 'po_details':
        po_details();
        break;
    case 'ih_partdesc_details':
        ih_partdesc_details();
        break;  
    case 'ih_serialnumber_details':
        ih_serialnumber_details();
        break;        
    case 'create':
        test_create();
        break;
    case 'read':
        test_read();
        break;
    case 'update':
        test_update();
        break; 
    case 'delete':
        test_delete();
        break; 
    case 'multipleread':
        test_multipleread();
        break;   
    case 'multipledelete':
        test_multipledelete();
        break;  
    case 'multiplecreate':
        test_multiplecreate();
        break; 
    case 'multipleupdate':
        test_multipleupdate();
        break;  
    case 'all_appointment':
        test_all_appointment();
        break; 
    case 'completd_all_appointment':
        test_completd_all_appointment();
        break;  
    case 'import':
        import_file();
        break;           
    case 'import_patient':
        // import_file_patient();
        import_file_patient_new_temp();
        break; 
    case 'import_patient_dynamic':
        // import_file_patient();
        import_file_patient_new_temp_dynamic();
        break;      
    case 'today_sms':
        today_twilio_sms();
        break;
    case 'today_doctor_patient_sms':
        today_doctor_patient_sms();
        break;      
    case 'custom_appointment':
        get_custom_appointment();
        break; 
    case 'custom_appointment_fromtime':
        get_custom_appointment_fromtime();
        break; 
    case 'custom_appointment_completetime':
        get_custom_appointment_completetime();
        break; 
    case 'custom_appointment_by_date':
        get_custom_appointment_by_date();
        break;       
    case 'custom_appointment_update':
        custom_appointment_update1();
        break;  
    case 'custom_appointment_update_noshow':
        custom_appointment_update1_noshow();
        break;     
    case 'add_custom_hospital':
        add_custom_hospital();
        break; 
    case 'add_hospital':
        add_hospital();
        break;     
    case 'add_custom_doctor':
        add_custom_doctor();
        break;
    case 'add_doctor':
        add_doctor();
        break;
    case 'check_is_hospital_doctor':
        check_is_hospital_doctor();
        break;        
    case 'add_custom_patient':
        add_custom_patient();
        break;
    case 'add_custom_patient_dynamic':
        add_custom_patient_dynamic();
        break;   
    case 'add_custom_multiple_appointment':
        add_custom_multiple_appointment();
        break;     
    case 'custom_hospital_block_unblock':
        custom_hospital_block_unblock();
        break; 
    case 'custom_doctor_delete':
        custom_doctor_delete();
        break; 
    case 'custom_hospital_delete':
        custom_hospital_delete();
        break;              
    case 'custom_doctor_block_unblock':
        custom_doctor_block_unblock();
        break;   
    case 'custom_hospital_appoinments':
        custom_hospital_appoinments();
        break; 
    case 'custom_hospital_appoinments_mob':
        custom_hospital_appoinments_mob();
        break;       
    case 'forgot_password':
        forgot_password();
        break; 
    case 'forgot_password_username':
        forgot_password_username();
        break;    
    case 'set_password':
        set_password();
        break;   
    case 'set_password_id':
        set_password_id();
        break;   
    case 'login':
        login();
        break;        
    case 'add_to_cart':
        add_to_cart();
        break;   
    case 'custom_pipe_product':
        custom_pipe_product();
        break;   
    case 'register_doctor':
        register_doctor();
        break;     
    case 'check_is_user':
        test_check_is_user();
        break;   
    case 'custom_update_user_doctor':
        custom_update_user_doctor();
        break;  
    case 'set_forgot_pass':
        set_forgot_pass();
        break;  
    case 'open_email':
        open_email();
        break;  
    case 'open_email_username':
        open_email_username();
        break;        
    case 'is_user_delete':
        is_user_delete();
        break;     
    case 'sms_send':
        sms_send();
        break;  
    case 'is_show':
        custom_appointment_isshow();
        break;  
    case 'sample_export':
        get_atr_data_export();
        break;   
    case 'add_edit_doctor_template':
        add_edit_doctor_template();
        break;    
    case 'cron_today_doctor_patient_sms':
        cron_today_doctor_patient_sms();
        break;   
    case 'ip':
        ip_address();
        break; 
    case 'custom_interval_time':
        custom_interval_time();
        break;  
    case 'open_otp':
        open_otp();
        break;
	case 'common_text':
        common_text();
        break;
	case 'common_sms':
        common_sms();
        break;
	case 'opensms':
        opensms();
        break;	
    case 'atobmenus':
        atobmenus();
        break;
    case 'authupdate':
        authupdate();
        break; 
        
    /** Operation API */    
    case 'add_edit_operation_appointment':
        add_edit_operation_appointment();
        break;
    case 'complete_operation_appointment':
        complete_operation_appointment();
        break;   
    case 'duplicate':  test_duplicate(); break;    
    case 'patient_rosters':  patient_rosters(); break;           
    default:
        defa();
}
function test_duplicate() {
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
        or die("could not connect to database");
    // Default response
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    // Collect keys and values from request
    foreach ($_REQUEST as $x => $x_value) {
        $keys[] = $x;
        $values[] = $x_value;
    }

    $key_length = count($keys);
    $table = $values[1]; // second parameter is the table name

    // Ensure at least 3 parameters: action, table, and one field to check
    if ($key_length < 3) {
        sendResponse(400, json_encode(["data" => [["msg" => "Missing fields to check duplication"]]]), $contenttype);
        die;
    }

    // Prepare WHERE conditions for duplicate check
    $whereClauses = [];
    for ($i = 2; $i < $key_length; $i++) {
        $col = $keys[$i];
        $val = mysqli_real_escape_string($connection, $values[$i]);
        $whereClauses[] = "$col = '$val'";
    }
    $where = implode(" AND ", $whereClauses);

    // Handle optional exclusion by id (if 'id' provided)
    $excludeClause = "";
    if (isset($_REQUEST['id']) && $_REQUEST['id'] !== '') {
        $id = mysqli_real_escape_string($connection, $_REQUEST['id']);
        $excludeClause = " AND id != '$id'";
    }

    // Build query
    $sql = "SELECT COUNT(*) as cnt FROM `$table` WHERE $where $excludeClause";

    // Execute query
    $result = db_iquery($connection, $sql) or die(mysqli_error($connection));
    $row = mysqli_fetch_assoc($result);

    if ($row['cnt'] > 0) {
        $output[] = ["msg" => "Duplication occurred"];
        $response['code'] = 1;
        $response['status'] = 200;
    } else {
        $output[] = ["msg" => "You can update"];
        $response['code'] = 1;
        $response['status'] = 200;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Start Oepration API --------------//
function add_edit_operation_appointment()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $password = uniqid();
    if (isset($_POST['id'])) 
    {
        $id = $_POST['id'];
    } 
    else $id = "";
    if (isset($_POST['surgery_name'])) 
    {
        $surgery_name = $_POST['surgery_name'];
    } 
    else $surgery_name = "";
    if (isset($_POST['surgery_duration_time'])) 
    {
        $surgery_duration_time = $_POST['surgery_duration_time'];
    } 
    else $surgery_duration_time = "";
    if (isset($_POST['doctor'])) 
    {
        $doctor = $_POST['doctor'];
    } 
    else $doctor = "";
    if (isset($_POST['hospital'])) 
    {
        $hospital = $_POST['hospital'];
    } 
    else $hospital = "";
    if (isset($_POST['patient_name'])) 
    {
        $patient_name = $_POST['patient_name'];
    } 
    else $patient_name = "";
    if (isset($_POST['phone'])) 
    {
        $phone = $_POST['phone'];
    } 
    else $phone = "";
    if (isset($_POST['email'])) 
    {
        $email = $_POST['email'];
    } 
    else $email = "";
    if (isset($_POST['date'])) 
    {
        $date = $_POST['date'];
    } 
    else $date = "";
    if (isset($_POST['surgery_start_time'])) 
    {
        $surgery_start_time = $_POST['surgery_start_time'];
    } 
    else $surgery_start_time = "";
    if (isset($_POST['surgery_details'])) 
    {
        $surgery_details = $_POST['surgery_details'];
    } 
    else $surgery_details = "";
    if (isset($_POST['attender_name'])) 
    {
        $attender_name = $_POST['attender_name'];
    } 
    else $attender_name = "";
    if (isset($_POST['attender_phone_number'])) 
    {
        $attender_phone_number = $_POST['attender_phone_number'];
    } 
    else $attender_phone_number = "";
    if (isset($_POST['drop_off_time'])) 
    {
        $drop_off_time = $_POST['drop_off_time'];
    } 
    else $drop_off_time = "";
    if (isset($_POST['pharmacy'])) 
    {
        $pharmacy = $_POST['pharmacy'];
    } 
    else $pharmacy = "";
    if (isset($_POST['medicine_names'])) 
    {
        $medicine_names = $_POST['medicine_names'];
    } 
    else $medicine_names = "";
    if (isset($_POST['notifications'])) 
    {
        $notifications = $_POST['notifications'];
    } 
    else $notifications = "";
    if (isset($_POST['notification_time'])) 
    {
        $notification_time = $_POST['notification_time'];
    }
    else $notification_time = "";
    if (isset($_POST['is_attender'])) 
    {
        $is_attender = $_POST['is_attender'];
    }
    else $is_attender = "";
    if (isset($_POST['procedure_category'])) 
    {
        $procedure_category = $_POST['procedure_category'];
    }
    else $procedure_category = "";
    if (isset($_POST['procedure_short_description'])) 
    {
        $procedure_short_description = $_POST['procedure_short_description'];
    }
    else $procedure_short_description = "";
    if (isset($_POST['procedure_detailed_description'])) 
    {
        $procedure_detailed_description = $_POST['procedure_detailed_description'];
    }
    else $procedure_detailed_description = "";
    if (isset($_POST['procedure_medications_instructions'])) 
    {
        $procedure_medications_instructions = $_POST['procedure_medications_instructions'];
    }
    else $procedure_medications_instructions = "";
    if (isset($_POST['dosage_guidelines'])) 
    {
        $dosage_guidelines = $_POST['dosage_guidelines'];
    }
    else $dosage_guidelines = "";
    if (isset($_POST['notes_warnings'])) 
    {
        $notes_warnings = $_POST['notes_warnings'];
    }
    else $notes_warnings = "";

    if(empty($id)):
        $recs_role1 = db_iquery($connection, "insert into accounts_operation_appointments (`surgery_name`,`surgery_duration_time`,`doctor`,`hospital`,`patient_name`,`phone`,`email`,`date`,`surgery_start_time`,`surgery_details`,`attender_name`,`attender_phone_number`,`drop_off_time`,`pharmacy`,`medicine_names`,`notifications`,`notification_time`,`is_attender`,`procedure_category`,`procedure_short_description`,`procedure_detailed_description`,`procedure_medications_instructions`,`dosage_guidelines`,`notes_warnings`) values ('".$surgery_name."','".$surgery_duration_time."','".$doctor."','".$hospital."','".$patient_name."','".$phone."','".$email."','".$date."','".$surgery_start_time."','".$surgery_details."','".$attender_name."','".$attender_phone_number."','".$drop_off_time."','".$pharmacy."','".$medicine_names."','".$notifications."','".$notification_time."','".$is_attender."','".$procedure_category."','".$procedure_short_description."','".$procedure_detailed_description."','".$procedure_medications_instructions."','".$dosage_guidelines."','".$notes_warnings."')") or die(mysqli_error());  // die ("invalid query");
        $samedata=mysqli_insert_id($connection);
        if ($samedata > 0) 
        {
            $recs_role = db_iquery($connection, "SELECT * FROM accounts_operation_appointments WHERE id='".$samedata."'") or die(mysqli_error());
            if(mysqli_num_rows($recs_role) > 0)
            {            
                while ($row = mysqli_fetch_object($recs_role)) 
                {
                    $output[] = $row;
                }
                $response['code'] = 1;
                $response['status'] = 200;
            }
        } 
        else 
        {
            $output[] = array("errmsg" => 'Invalid');
            $response['status'] = 403;
        }
    else:
        db_iquery($connection, "update accounts_operation_appointments set `surgery_name` = '".$surgery_name."',`surgery_duration_time` = '".$surgery_duration_time."',`doctor` = '".$doctor."',`hospital` = '".$hospital."',`patient_name` = '".$patient_name."',`phone` = '".$phone."',`email` = '".$email."',`date` = '".$date."',`surgery_start_time` = '".$surgery_start_time."',`surgery_details` = '".$surgery_details."',`attender_name` = '".$attender_name."',`attender_phone_number` = '".$attender_phone_number."',`drop_off_time` = '".$drop_off_time."',`pharmacy` = '".$pharmacy."',`medicine_names` = '".$medicine_names."',`notifications` = '".$notifications."',`notification_time` = '".$notification_time."',`is_attender` = '".$is_attender."', `procedure_category`= '".$procedure_category."',`procedure_short_description`= '".$procedure_short_description."',`procedure_detailed_description`= '".$procedure_detailed_description."',`procedure_medications_instructions`= '".$procedure_medications_instructions."',`dosage_guidelines`= '".$dosage_guidelines."',`notes_warnings`= '".$notes_warnings."' where id = '".$id."'") or die(mysqli_error());  // die ("invalid query");
        $recs_role = db_iquery($connection, "SELECT * FROM accounts_operation_appointments WHERE id='".$id."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else 
        {
            $output[] = array("errmsg" => 'Invalid');
            $response['status'] = 403;
        }
    endif;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Start Oepration API --------------//
function complete_operation_appointment()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $password = uniqid();
    if (isset($_POST['id'])) 
    {
        $id = $_POST['id'];
    } 
    else $id = "";
    $is_completed = 1;
    if (isset($_POST['completed_time']))
    {
        $completed_time = $_POST['completed_time'];
    }
    else $completed_time = "";
    if (isset($_POST['attender_content'])) 
    {
        $attender_content = $_POST['attender_content'];
    }
    else $attender_content = "";
    if (isset($_POST['phone']))
    {
        $phone = $_POST['phone'];
    }
    else $phone = "";
    db_iquery($connection, "update accounts_operation_appointments set `completed_time` = '".$completed_time."',`is_completed` = '".$is_completed."' where id = '".$id."'") or die(mysqli_error());  // die ("invalid query");
    if(!empty($phone) && !empty($attender_content)):
        $account_sid = TWILIO_ACCOUNT_SID;
        $auth_token = TWILIO_AUTH_TOKEN;
        $twilio_number = "+12818843247";
        $tonumber = $phone;
        $client = new Client($account_sid, $auth_token);
        $client->messages->create(
            $tonumber,
            array(
                'from' => $twilio_number,
                'body' => $attender_content
            )
        );
    endif;  
    $output[] = array("msg" => 'Suceesfully Updated');
    $response['code'] = 1;
    $response['status'] = 200;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}
//--------------- End Oepration API --------------//

//--------------- ih_serialnumber_details --------------//
function ih_serialnumber_details()
{
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_GET['job_id'])) 
    {
        $job_id = $_GET['job_id'];
    } 
    else $job_id = "";
    if (isset($_GET['suffix'])) 
    {
        $suffix = $_GET['suffix'];
    } 
    else $suffix = "";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"https://jrreports.workovererp.com:8091/api/jetrubberapi.php?action=po_details");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, 
    http_build_query(array('job_id' =>$job_id,'suffix' =>$suffix)));
    // Receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close($ch);
    $ji = json_decode($server_output);

    $code = $ji->code;
    $status = $ji->status;
    $data = $ji->data;
    $additional_data = $ji->additional_data;

    $response['code'] = $code;
    $response['data'] = $data;
    $response['additional_data'] = $additional_data;
    $response['status'] = $status;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 
//--------------- po_details --------------//
function po_details()
{
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_GET['job_id'])) 
    {
        $job_id = $_GET['job_id'];
    } 
    else $job_id = "";
    if (isset($_GET['suffix'])) 
    {
        $suffix = $_GET['suffix'];
    } 
    else $suffix = "";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"https://jrreports.workovererp.com:8091/api/jetrubberapi.php?action=po_details");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, 
    http_build_query(array('job_id' =>$job_id,'suffix' =>$suffix)));
    // Receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close($ch);
    $ji = json_decode($server_output);

    $code = $ji->code;
    $status = $ji->status;
    $data = $ji->data;
    $additional_data = $ji->additional_data;

    $response['code'] = $code;
    $response['data'] = $data;
    $response['additional_data'] = $additional_data;
    $response['status'] = $status;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 
//--------------- ih_partdesc_details --------------//
function ih_partdesc_details()
{
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_GET['job_id'])) 
    {
        $job_id = $_GET['job_id'];
    } 
    else $job_id = "";
    if (isset($_GET['suffix'])) 
    {
        $suffix = $_GET['suffix'];
    } 
    else $suffix = "";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"https://jrreports.workovererp.com:8091/api/jetrubberapi.php?action=ih_partdesc_details");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, 
    http_build_query(array('job_id' =>$job_id,'suffix' =>$suffix)));
    // Receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close($ch);
    $ji = json_decode($server_output);
    $code = $ji->code;
    $status = $ji->status;
    $data = $ji->data;

    $response['code'] = $code;
    $response['data'] = $data;
    $response['status'] = $status;
    sendResponse($response['status'], json_encode($response), $contenttype);
}


//--------------- A to B menus --------------//
function atobmenus()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_GET['name'])) 
    {
        $name = $_GET['name'];
    } 
    else $name = "";
    if(!empty($name))
    {
        $sqls = "select * from zcms_atob_menus where alias_name like '%$name%' limit 1";
        $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
        if (mysqli_num_rows($recs_des) > 0)
        { 
            while ($row = mysqli_fetch_object($recs_des)) 
            {
                $output[] = $row;
            }
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else
        {
            $output[] = array("errmsg" => 'no date found');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Data missed');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//---------- Open OTP -------------------------------//
function open_otp()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $date = date("m-d-Y");
    if (isset($_REQUEST['phone'])) 
    {
        $phone = $_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['region'])) 
    {
        $region = $_REQUEST['region'];
    } 
    else $region = "";
    if(!empty($phone) && !empty($region))
    {
        // $sqls = "select * from zcms_register where phone = '".$phone."'";
        // $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
        if (!empty($phone)) 
        { 
            $tonumber = "+".$region.$phone;
            $SixDigitRandomNumber = rand(100000,999999);
            $account_sid = TWILIO_ACCOUNT_SID;
            $auth_token = TWILIO_AUTH_TOKEN;
            $twilio_number = "+12818843247";
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $tonumber,
                array(
                    'from' => $twilio_number,
                    'body' => "OTP is $SixDigitRandomNumber"
                )
            );
            $output[] = array("otp" => "".$SixDigitRandomNumber."");
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else
        {
            $output[] = array("otp" => 'No phone found');
            $response['status'] = 400;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Data missed');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//---------- Open OTP -------------------------------//
function common_text()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $date = date("m-d-Y");
    if (isset($_REQUEST['phone'])) 
    {
        $phone = $_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['region'])) 
    {
        $region = $_REQUEST['region'];
    } 
    else $region = "";
	if (isset($_REQUEST['content'])) 
    {
        $content = $_REQUEST['content'];
    } 
    else $content = "";
    if(!empty($phone) && !empty($region))
    {
        // $sqls = "select * from zcms_register where phone = '".$phone."'";
        // $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
        if (!empty($phone)) 
        { 
            $tonumber = "+".$region.$phone;
            $SixDigitRandomNumber = rand(100000,999999);
            $account_sid = TWILIO_ACCOUNT_SID;
            $auth_token = TWILIO_AUTH_TOKEN;
            $twilio_number = "+12818843247";
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $tonumber,
                array(
                    'from' => $twilio_number,
                    'body' => $content
                )
            );
            $output[] = array("otp" => "".$SixDigitRandomNumber."");
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else
        {
            $output[] = array("otp" => 'No phone found');
            $response['status'] = 400;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Data missed');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//---------- Open OTP -------------------------------//
function common_sms()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $date = date("m-d-Y");
    if (isset($_REQUEST['phone'])) 
    {
        $phone = $_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['region'])) 
    {
        $region = $_REQUEST['region'];
    } 
    else $region = "";
	$region = '1';
	$phone = "7135578001";
	if (isset($_REQUEST['content'])) 
    {
        $content = $_REQUEST['content'];
    } 
    else $content = "";
    if(!empty($phone) && !empty($region))
    {
        // $sqls = "select * from zcms_register where phone = '".$phone."'";
        // $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
        if (!empty($phone)) 
        { 
            $tonumber = "+".$region.$phone;
            $SixDigitRandomNumber = rand(100000,999999);
            $account_sid = TWILIO_ACCOUNT_SID;
            $auth_token = TWILIO_AUTH_TOKEN;
            $twilio_number = "+12818843247";
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $tonumber,
                array(
                    'from' => $twilio_number,
                    'body' => $content
                )
            );
            $output[] = array("otp" => "".$SixDigitRandomNumber."");
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else
        {
            $output[] = array("otp" => 'No phone found');
            $response['status'] = 400;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Data missed');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//---------- Open OTP -------------------------------//
function opensms()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");

    // Set default HTTP response
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $output = array();

    // ---------- ENFORCE POST METHOD ----------
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $output[] = array("msg" => 'Only POST method allowed');
        $response['status'] = 405;
        $response['data']   = $output;
        sendResponse($response['status'], json_encode($response), $contenttype);
        return;
    }

    // ---------- OPTIONAL HEADER VALIDATION ----------
    // Headers are optional. Uncomment to enforce.
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader   = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    $apiKeyHeader = $headers['X-Api-Key']     ?? ($_SERVER['HTTP_X_API_KEY']     ?? '');
    // if (!empty($authHeader) && $authHeader !== 'Bearer xxxx') {
    //     $output[] = array("msg" => 'Invalid Authorization header');
    //     sendResponse(401, json_encode(array('code'=>0,'status'=>401,'data'=>$output)), $contenttype);
    //     return;
    // }

    // ---------- READ POST BODY (JSON or form-encoded) ----------
    $rawInput    = file_get_contents("php://input");
    $contentType = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');

    $payload = array();
    if (stripos($contentType, 'application/json') !== false) {
        $decoded = json_decode($rawInput, true);
        if (is_array($decoded)) {
            $payload = $decoded;
        }
    } else {
        // form-urlencoded or multipart/form-data
        $payload = $_POST;
    }

    // Final fallback: try decoding raw body as JSON regardless of header
    if (empty($payload) && !empty($rawInput)) {
        $decoded = json_decode($rawInput, true);
        if (is_array($decoded)) {
            $payload = $decoded;
        }
    }

    if (empty($payload)) {
        $output[] = array("msg" => 'Empty POST body');
        $response['status'] = 400;
        $response['data']   = $output;
        sendResponse($response['status'], json_encode($response), $contenttype);
        return;
    }

    // SMS target
    $region = '91';
    $phone  = "9791189569";

    // ---------- BUILD SMS BODY DYNAMICALLY FROM ANY FIELDS ----------
    if (isset($payload['content']) && $payload['content'] !== '') {
        $content = is_array($payload['content']) ? json_encode($payload['content']) : $payload['content'];
    } else {
        $content = "New Submission:\n";

        // Fields you never want in the SMS
        $skipFields = array('password', 'confirm_password', 'Confirm Password', 'Password', 'captcha_answer');

        foreach ($payload as $key => $value) {
            if (in_array($key, $skipFields, true)) continue;
            if ($value === '' || $value === null) continue;

            if (is_array($value) || is_object($value)) {
                $value = json_encode($value);
            }

            $content .= $key . ": " . $value . "\n";
        }
    }

    $content = trim($content);
    if (strlen($content) > 1500) {
        $content = substr($content, 0, 1497) . "...";
    }

    if (!empty($phone) && !empty($region)) {
        $tonumber = "+" . $region . $phone;

        $account_sid   = TWILIO_ACCOUNT_SID;
        $auth_token    = TWILIO_AUTH_TOKEN;
        $twilio_number = "+12818843247";

        $client = new Client($account_sid, $auth_token);
        $client->messages->create(
            $tonumber,
            array(
                'from' => $twilio_number,
                'body' => $content
            )
        );

        $output[] = array("msg" => "SMS sent");
        $response['code']   = 1;
        $response['status'] = 200;
    } else {
        $output[] = array("msg" => 'Data missed');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Sms Send --------------//
function sms_send()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    date_default_timezone_set('Asia/Kolkata');
    $date = date("m-d-Y H:i");
    // echo $date;die;
    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";
    $name  = 'Hi, We look forward to seeing you.';
    $tonumber = "+919791189569";
    $client = new Client($account_sid, $auth_token);
    $client->messages->create(
        $tonumber,
        array(
            'from' => $twilio_number,
            'body' => $name
        )
    );

    $output[] = array("errmsg" => 'Sms sent');
    $response['status'] = 200;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 


//--------------- Forget Password --------------//
function set_password()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_POST['email'])) 
    {
        $email = $_POST['email'];
    } 
    else $email = "";
    if (isset($_POST['password'])) 
    {
        $password = $_POST['password'];
    } 
    else $password = "";
    $decode_email = base64_decode($email);
    $sqls = "select * from accounts_user where email = '".$decode_email."' and is_active=1";
    // echo $sqls;die;
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0)
    { 
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET password = '".$password."' WHERE email='".$decode_email."'") or die(mysqli_error());   
        $output[] = array("msg" => 'Password set successfully');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else
    {
        $output[] = array("errmsg" => 'Something went wrong no email found');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Forget Password --------------//
function set_password_id()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_POST['id'])) 
    {
        $id = $_POST['id'];
    } 
    else $id = "";
    if (isset($_POST['password'])) 
    {
        $password = $_POST['password'];
    } 
    else $password = "";
    $sqls = "select * from accounts_user where id = '".$id."' and is_active=1";
    // echo $sqls;die;
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0)
    { 
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET password = '".$password."' WHERE id='".$id."'") or die(mysqli_error());   
        $output[] = array("msg" => 'Password set successfully');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else
    {
        $output[] = array("errmsg" => 'Something went wrong no email found');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Forget Password --------------//
function login()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_POST['user_name'])) 
    {
        $user_name = $_POST['user_name'];
    } 
    else $user_name = "";
    if (isset($_POST['password'])) 
    {
        $password = $_POST['password'];
    } 
    else $password = "";
    $sqls = "select * from accounts_user where user_name = '".$user_name."' and password = '".$password."' and is_active=1";
    $recs_role = db_iquery($connection,$sqls) or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $output[] = $row;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else
    {
        $output[] = array("errmsg" => 'Credential wrong');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Forget Password --------------//
function forgot_password()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    $sqls = "select * from accounts_user where email = '".$email."' and is_active=1 and is_deleted=0";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    { 
        $encode_email = base64_encode($email);
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send = "reset password Mail Content";
                $send .= "<br></br><br>You're receiving this email because you requested a password reset for your user account at webapp.realtimeappointment.com."; 
                $send .= "<br></br>Please go to the following page and choose a new password:"; 
                $send .= "<br></br>https://webapp.realtimeappointment.com/TraKKerAppt/reset_password/$encode_email"; 
                $send .= "<br></br>Your username, in case you've forgotten: $email"; 
                $send .= "<br></br>Thanks for using our site!"; 
                $send .= "<br></br>The webapp.realtimeappointment.com team"; 
                $headers      =  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com');
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "Reset Password"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $output[] = array("msg" => 'Email sent successfully');
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'No email found');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Forget Password --------------//
function forgot_password_username()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['username'])) 
    {
        $username = $_REQUEST['username'];
    } 
    else $username = "";

    $sqls = "select * from accounts_user where user_name = '".$username."'";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    { 
        while ($row21 = mysqli_fetch_object($recs_des)) 
        {
            $output21[] = $row21;
        }    
        if (isset($output21[0]->email) && !empty($output21[0]->email)) 
        { 
            $email = $output21[0]->email;
            $id = $output21[0]->id;
            $encode_email = base64_encode($email);
            $encode_id = base64_encode($id);
            $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
            if (mysqli_num_rows($recs_mail) > 0)
            {
                while ($rowmail = mysqli_fetch_object($recs_mail)) 
                {
                    $outputmail[] = $rowmail;
                }
                if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
                {
                    require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                    $mail        = new PHPMailer();
                    $send = "reset password Mail Content"; 
                    $send .= "<br></br><br>You're receiving this email because you requested a password reset for your user account at webapp.realtimeappointment.com."; 
                    $send .= "<br></br>Please go to the following page and choose a new password:"; 
                    $send .= "<br></br>https://webapp.realtimeappointment.com/TraKKerAppt/reset_password/$encode_id"; 
                    $send .= "<br></br>Your username, in case you've forgotten: $username"; 
                    $send .= "<br></br>Thanks for using our site!"; 
                    $send .= "<br></br>The webapp.realtimeappointment.com team"; 
                    $headers      =  'MIME-Version: 1.0' . "\r\n";
                    $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                    $mail->IsSMTP();  
                    $mail->SetLanguage("en", 'mailer/language/'); 
                    $mail->Host     = $outputmail[0]->host;          
                    $mail->Port     = $outputmail[0]->port;              
                    $mail->SMTPAuth = true; 
                    $mail->Username = $outputmail[0]->email;       
                    $mail->Password = $outputmail[0]->password;
                    $mail->AddAddress($email);
                    // $mail->AddBCC('yuvaraj.p@desss.com'); 
                    $mail->From     = $outputmail[0]->mail_from;
                    $mail->FromName = $outputmail[0]->from_name;
                    $mail->IsHTML(true);
                    $mail->IsHTML(true);                                
                    $mail->Subject  =  "Reset Password"; 
                    $mail->Body     =  $send;
                    $mail->Send();
                    $mail->ClearAddresses();
                    $attachment = '';
                    $output[] = array("msg" => 'Email sent successfully');
                    $response['code'] = 1;
                    $response['status'] = 200;
                }
                else
                {
                    $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                    $response['status'] = 403;
                }
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            } 
        }
        else
        {
            $output[] = array("errmsg" => 'No user founds');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'No user founds');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Forget Password --------------//
function open_email()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (!empty($email)) 
    { 
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $SixDigitRandomNumber = rand(100000,999999);
                $send = ""; 
                $headers = "";
                $send .= "OTP is $SixDigitRandomNumber"; 
                $headers      .=  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "OTP"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $output[] = array("otp" => "".$SixDigitRandomNumber."");
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'data missed');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 


//--------------- Forget Password(open_email_username) --------------//
function open_email_username()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['username'])) 
    {
        $username = $_REQUEST['username'];
    } 
    else $username = "";

    $sqls = "select * from accounts_user where user_name = '".$username."' LIMIT 1";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    { 
        while ($row21 = mysqli_fetch_object($recs_des)) 
        {
            $output21[] = $row21;
        }    
        if (isset($output21[0]->phone) && !empty($output21[0]->phone)) 
        { 
            $email = $output21[0]->email;
            $id = $output21[0]->id;
            $phone = $output21[0]->phone;

            $tonumber = $phone;
            $SixDigitRandomNumber = rand(100000,999999);
            $account_sid = TWILIO_ACCOUNT_SID;
            $auth_token = TWILIO_AUTH_TOKEN;
            $twilio_number = "+12818843247";
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $tonumber,
                array(
                    'from' => $twilio_number,
                    'body' => "OTP is $SixDigitRandomNumber"
                )
            );
            $output[] = array("otp" => "".$SixDigitRandomNumber."","id" => "".$id."","email" => "".$email."","user_name" => "".$username."","phone" => "".$phone."");
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else
        {
            $output[] = array("errmsg" => 'No user founds');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'No user founds');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get custom appointment --------------//
function custom_hospital_appoinments()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";
    $sqls = "select * from accounts_hospital where user_id = '".$id."'";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    { 
        while ($row21 = mysqli_fetch_object($recs_des)) 
        {
            $output21[] = $row21;
        }     
        $sqls1 = "select * from accounts_doctor where hospital_id_id = '".$output21[0]->id."' and is_active=1";
        $recs_des1 = db_iquery($connection,$sqls1) or die(mysqli_error());
        if (mysqli_num_rows($recs_des1) > 0) 
        { 
            while ($row22 = mysqli_fetch_object($recs_des1)) 
            {
                $output22[] = $row22->id;
            }   
            $doc_idin = implode(",",$output22);
            $sql = "select * from accounts_appointment where doc_id_id IN (".$doc_idin.") and date = '".$date."' order by from_time asc";
            $recs_de = db_iquery($connection,$sql) or die(mysqli_error());
            if (mysqli_num_rows($recs_de) > 0) 
            { 
                while ($row = mysqli_fetch_object($recs_de)) 
                { 
                    $patient_id = $row->patient_id_id;
                    $doc_id = $row->doc_id_id;
                    // echo $patient_id;die;
                    $sql1 = "select * from accounts_doctor where id = '".$doc_id."'";
                    $recs_de1 = db_iquery($connection,$sql1) or die(mysqli_error());
                    if (mysqli_num_rows($recs_de1) > 0) 
                    { 
                        while ($row1 = mysqli_fetch_object($recs_de1)) 
                        {
                            $output1 = array($row1->id, $row1->first_name, $row1->hospital_id_id);
                        }   
                    } 
                    else
                    {
                        $output1 = array("","","");
                    }
                    $sql2 = "select * from accounts_patient where id = '".$patient_id."'";
                    $recs_de2 = db_iquery($connection,$sql2) or die(mysqli_error());
                    if (mysqli_num_rows($recs_de2) > 0) 
                    { 
                        while ($row2 = mysqli_fetch_object($recs_de2)) 
                        {
                            $output2 = array($row2->id, $row2->first_name, $row2->last_name,$row2->phone, $row2->email, $row2->age,$row2->gender, $row2->purpose);
                        }   
                    }   
                    else
                    {
                        $output2 = array("","","","","","","","");
                    } 
                    $array = array("appoint_id"=>$row->id,"date"=>$row->date,"feedback"=>$row->feedback,"delay"=>$row->delay,"app_fromtime"=>$row->from_time,"app_todtime"=>$row->tod_time,"reschdule_time"=>$row->reschdule_time,"app_totime"=>$row->to_time,"is_show"=>$row->is_show,"appis_completed"=>$row->is_completed,"doctor_id"=>$output1[0],"doctor_name"=>$output1[1],
                    "hospital_id"=>$output1[2],"id"=>$output2[0],
                    "first_name"=>$output2[1],"last_name"=>$output2[2],"phone"=>$output2[3],"email"=>$output2[4],"age"=>$output2[5],"gender"=>$output2[6],"purpose"=>$output2[7]);
                    $output[] = $array;
                }      
                $response['code'] = 1;
                $response['status'] = 200;
            
            }
            else 
            {
                $output[] = array("errmsg" => 'Invalid');
                $response['status'] = 403;
            } 
        }    
        else
        {
            $output[] = array("errmsg" => 'No doctors founds in hospital');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'No hospital founds');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get custom appointment --------------//
function custom_hospital_appoinments_mob()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";
    $sqls = "select * from accounts_hospital where user_id = '".$id."'";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    { 
        while ($row21 = mysqli_fetch_object($recs_des)) 
        {
            $output21[] = $row21;
        }     
        $sqls1 = "select * from accounts_doctor where hospital_id_id = '".$output21[0]->id."' and is_active=1";
        $recs_des1 = db_iquery($connection,$sqls1) or die(mysqli_error());
        if (mysqli_num_rows($recs_des1) > 0) 
        { 
            while ($row22 = mysqli_fetch_object($recs_des1)) 
            {
                $output22[] = $row22->id;
            }   
            $doc_idin = implode(",",$output22);
            $sql = "select * from accounts_appointment where doc_id_id IN (".$doc_idin.") order by from_time asc";
            $recs_de = db_iquery($connection,$sql) or die(mysqli_error());
            if (mysqli_num_rows($recs_de) > 0) 
            { 
                while ($row = mysqli_fetch_object($recs_de)) 
                { 
                    $patient_id = $row->patient_id_id;
                    $doc_id = $row->doc_id_id;
                    // echo $patient_id;die;
                    $sql1 = "select * from accounts_doctor where id = '".$doc_id."'";
                    $recs_de1 = db_iquery($connection,$sql1) or die(mysqli_error());
                    if (mysqli_num_rows($recs_de1) > 0) 
                    { 
                        while ($row1 = mysqli_fetch_object($recs_de1)) 
                        {
                            $output1 = array($row1->id, $row1->first_name, $row1->hospital_id_id);
                        }   
                    } 
                    else
                    {
                        $output1 = array("","","");
                    }
                    $sql2 = "select * from accounts_patient where id = '".$patient_id."'";
                    $recs_de2 = db_iquery($connection,$sql2) or die(mysqli_error());
                    if (mysqli_num_rows($recs_de2) > 0) 
                    { 
                        while ($row2 = mysqli_fetch_object($recs_de2)) 
                        {
                            $output2 = array($row2->id, $row2->first_name, $row2->last_name,$row2->phone, $row2->email, $row2->age,$row2->gender, $row2->purpose);
                        }   
                    }   
                    else
                    {
                        $output2 = array("","","","","","","","");
                    } 
                    $array = array("appoint_id"=>$row->id,"date"=>$row->date,"feedback"=>$row->feedback,"delay"=>$row->delay,"app_fromtime"=>$row->from_time,"reschdule_time"=>$row->reschdule_time,"app_totime"=>$row->to_time,"is_show"=>$row->is_show,"appis_completed"=>$row->is_completed,"doctor_id"=>$output1[0],"doctor_name"=>$output1[1],
                    "hospital_id"=>$output1[2],"id"=>$output2[0],
                    "first_name"=>$output2[1],"last_name"=>$output2[2],"phone"=>$output2[3],"email"=>$output2[4],"age"=>$output2[5],"gender"=>$output2[6],"purpose"=>$output2[7]);
                    $output[] = $array;
                }      
                $response['code'] = 1;
                $response['status'] = 200;
            
            }
            else 
            {
                $output[] = array("errmsg" => 'Invalid');
                $response['status'] = 403;
            } 
        }    
        else
        {
            $output[] = array("errmsg" => 'No doctors founds in hospital');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'No hospital founds');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Sms concept --------------//
function today_doctor_patient_sms()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id = $_REQUEST['doctor_id'];
    } 
    else $doctor_id = "";
    // $account_sid = '';
    // $auth_token = '';
    // $twilio_number = "+17752579977";
    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";

    $for1234 = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
    if(mysqli_num_rows($for1234) > 0)
    {
        while ($rowtime1 = mysqli_fetch_object($for1234)) 
        { 
            $time_zone_find = $rowtime1->time_zone;
            // if($time_zone_find == "India")
            // {
            //     date_default_timezone_set('Asia/Kolkata');
            // }
            // else
            // {
                date_default_timezone_set("$time_zone_find");
            // }
        }
    }    
    else
    {
        date_default_timezone_set('America/Chicago');
    }
    $date = date("m-d-Y");
    $recs_role = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."' and doc_id_id='".$doctor_id."' and is_completed=0 and is_show=0") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $outputs[] = $row->patient_id_id;
        }
        $patient_id = implode(",",$outputs);
        $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id IN (".$patient_id.")") or die(mysqli_error());
        if(mysqli_num_rows($recs_role1) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role1)) 
            {
                $output1[] = $row;
            }
        }
        foreach($output1 as $output2)
        {  
            $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE patient_id_id = '".$output2->id."'") or die(mysqli_error());
            if(mysqli_num_rows($recs_role12) > 0)
            {            
                while ($row12 = mysqli_fetch_object($recs_role12)) 
                {
                    $output1p = array($row12);
                }
            }
            /** For dynamic content for sms */
            $dynamic_content = db_iquery($connection, "SELECT * FROM  doctor_template WHERE doctor_id = '".$doctor_id."'") or die(mysqli_error());
            if(mysqli_num_rows($dynamic_content) > 0)
            {    
                while ($dynamic_content_row = mysqli_fetch_object($dynamic_content)) 
                {
                    $concat_name = $output2->first_name.' '.$output2->last_name;
                    $set_dynamic = str_replace("%%DATE%%",$output1p[0]->date,str_replace("%%TIME%%",$output1p[0]->from_time,str_replace("%%NAME%%",$concat_name,$dynamic_content_row->advance_sms_template)));        
                    if(!empty($set_dynamic)):
                        $name = Strip_tags($set_dynamic);
                    else:
                        $name  = 'Hi '.$output2->first_name.' '.$output2->last_name.', Your appointment today '.$output1p[0]->date.' at '.$output1p[0]->from_time.' Please come before 15 minutes. We look forward to seeing you.';
                    endif;
                }
            }
            else
            {
                $name  = 'Hi '.$output2->first_name.' '.$output2->last_name.', Your appointment today '.$output1p[0]->date.' at '.$output1p[0]->from_time.' Please come before 15 minutes. We look forward to seeing you.';
            }
            // echo $name;die;
            $tonumber = $output2->phone;
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $tonumber,
                array(
                    'from' => $twilio_number,
                    'body' => $name
                )
            );
        }
        
        $output[] = array("msg" => 'Sent message successfully');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'No patient available today');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Sms concept Cron job--------------//
function cron_today_doctor_patient_sms()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id = $_REQUEST['doctor_id'];
    } 
    else $doctor_id = "";
    $cur_time = date("H:i:s");
    // $account_sid = '';
    // $auth_token = '';
    // $twilio_number = "+17752579977";
    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";

    $for123456 = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE is_deleted=0 and is_active=1") or die(mysqli_error());
    if(mysqli_num_rows($for123456) > 0)
    {
        while ($rowtime12 = mysqli_fetch_object($for123456)) 
        { 
            $for1234 = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$rowtime12->id."'") or die(mysqli_error());
            if(mysqli_num_rows($for1234) > 0)
            {
                while ($rowtime1 = mysqli_fetch_object($for1234)) 
                { 
                    $time_zone_find = $rowtime1->time_zone;
                    // if($time_zone_find == "India")
                    // {
                    //     date_default_timezone_set('Asia/Kolkata');
                    // }
                    // else
                    // {
                        date_default_timezone_set("$time_zone_find");
                    // }
                }
            }    
            else
            {
                date_default_timezone_set('America/Chicago');
            }
            $date = date("m-d-Y");
            $recs_role = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."' and doc_id_id='".$rowtime12->id."' and is_completed=0 and is_show=0") or die(mysqli_error());
            if(mysqli_num_rows($recs_role) > 0)
            {            
                while ($row = mysqli_fetch_object($recs_role)) 
                {
                    $outputs[] = $row->patient_id_id;
                }
                $patient_id = implode(",",$outputs);
                $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id IN (".$patient_id.")") or die(mysqli_error());
                if(mysqli_num_rows($recs_role1) > 0)
                {            
                    while ($row = mysqli_fetch_object($recs_role1)) 
                    {
                        $output1[] = $row;
                    }
                }
                foreach($output1 as $output2)
                {  
                    $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE patient_id_id = '".$output2->id."'") or die(mysqli_error());
                    if(mysqli_num_rows($recs_role12) > 0)
                    {            
                        while ($row12 = mysqli_fetch_object($recs_role12)) 
                        {
                            $output1p = array($row12);
                        }
                    }
                    /** For dynamic content for sms */
                    $dynamic_content = db_iquery($connection, "SELECT * FROM  doctor_template WHERE doctor_id = '".$output1p[0]->doc_id_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($dynamic_content) > 0)
                    {
                        while ($dynamic_content_row = mysqli_fetch_object($dynamic_content)) 
                        {
                            $concat_name = $output2->first_name.' '.$output2->last_name;
                            $set_dynamic = str_replace("%%DATE%%",$output1p[0]->date,str_replace("%%TIME%%",$output1p[0]->from_time,str_replace("%%NAME%%",$concat_name,$dynamic_content_row->advance_sms_template)));        
                            if(!empty($set_dynamic)):
                                $name = Strip_tags($set_dynamic);
                            else:
                                $name  = 'Hi '.$output2->first_name.' '.$output2->last_name.', Your appointment today '.$output1p[0]->date.' at '.$output1p[0]->from_time.' Please come before 15 minutes. We look forward to seeing you.';
                            endif;
                        }
                    }
                    else
                    {
                        $name  = 'Hi '.$output2->first_name.' '.$output2->last_name.', Your appointment today '.$output1p[0]->date.' at '.$output1p[0]->from_time.' Please come before 15 minutes. We look forward to seeing you.';
                    }
                    // $name  = 'Hi '.$output2->first_name.' '.$output2->last_name.', Your appointment today '.$output1p[0]->date.' at '.$output1p[0]->from_time.' Please come before 15 minutes. We look forward to seeing you.';
                    if($cur_time<$output1p[0]->from_time):
                    $tonumber = $output2->phone;
                    $client = new Client($account_sid, $auth_token);
                    $client->messages->create(
                        $tonumber,
                        array(
                            'from' => $twilio_number,
                            'body' => $name
                        )
                    );
                    endif;
                }
                
                $output[] = array("msg" => 'Sent message successfully');
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else 
            {
                $output[] = array("errmsg" => 'No patient available today');
                $response['status'] = 403;
            }
        }
    }
    else 
    {
        $output[] = array("errmsg" => 'No patient available today');
        $response['status'] = 403;
    }       
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- custom_hospital_block_unblock --------------//
function custom_doctor_block_unblock()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['user_id'])) 
    {
        $user_id = $_REQUEST['user_id'];
    } 
    else $user_id = "";
    if (isset($_REQUEST['is_active'])) 
    {
        $is_active = $_REQUEST['is_active'];
    } 
    else $is_active = "";
    if($is_active == 1)
    {
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET is_active = 1 WHERE id='".$user_id."'") or die(mysqli_error());   
        $recs_update1 = db_iquery($connection, "UPDATE accounts_doctor SET is_active = 1 WHERE id='".$id."'") or die(mysqli_error());             
        $output[] = array("msg" => 'Suceesfully Updated');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else
    {
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET is_active = 0 WHERE id='".$user_id."'") or die(mysqli_error());        
        $recs_update1 = db_iquery($connection, "UPDATE accounts_doctor SET is_active = 0 WHERE id='".$id."'") or die(mysqli_error()); 
        $output[] = array("msg" => 'Suceesfully Updated');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- custom_doctor_delete --------------//
function custom_doctor_delete()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['user_id'])) 
    {
        $user_id = $_REQUEST['user_id'];
    } 
    else $user_id = "";
    $recs_role = db_iquery($connection, "delete from accounts_doctor where id = '".$id."'") or die(mysqli_error());
    $recs_role1 = db_iquery($connection, "delete from accounts_user where id = '".$user_id."'") or die(mysqli_error());
    $output[] = array("msg" => 'Suceesfully Deleted');
    $response['code'] = 1;
    $response['status'] = 200;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- custom_hospital_delete --------------//
function custom_hospital_delete()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['user_id'])) 
    {
        $user_id = $_REQUEST['user_id'];
    } 
    else $user_id = "";
    $recs_role = db_iquery($connection, "delete from accounts_hospital where id = '".$id."'") or die(mysqli_error());
    $recs_role1 = db_iquery($connection, "delete from accounts_user where id = '".$user_id."'") or die(mysqli_error());
    $recs_role2 = db_iquery($connection, "delete from accounts_doctor where hospital_id_id = '".$id."'") or die(mysqli_error());
    $output[] = array("msg" => 'Suceesfully Deleted');
    $response['code'] = 1;
    $response['status'] = 200;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- custom_hospital_block_unblock --------------//
function custom_hospital_block_unblock()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['user_id'])) 
    {
        $user_id = $_REQUEST['user_id'];
    } 
    else $user_id = "";
    if (isset($_REQUEST['is_active'])) 
    {
        $is_active = $_REQUEST['is_active'];
    } 
    else $is_active = "";
    if($is_active == 1)
    {
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET is_active = 0 WHERE id='".$user_id."'") or die(mysqli_error());   
        $recs_update1 = db_iquery($connection, "UPDATE accounts_hospital SET is_active = 1 WHERE id='".$id."'") or die(mysqli_error());             
        $output[] = array("msg" => 'Suceesfully Updated');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else
    {
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET is_active = 1 WHERE id='".$user_id."'") or die(mysqli_error());        
        $recs_update1 = db_iquery($connection, "UPDATE accounts_hospital SET is_active = 0 WHERE id='".$id."'") or die(mysqli_error()); 
        $output[] = array("msg" => 'Suceesfully Updated');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- add custom patient --------------//
function add_custom_patient()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['first_name'])) 
    {
        $first_name = $_REQUEST['first_name'];
    } 
    else $first_name = "";
    if (isset($_REQUEST['last_name'])) 
    {
        $last_name = $_REQUEST['last_name'];
    } 
    else $last_name = "";
    if (isset($_REQUEST['phone'])) 
    {
        $phone = "+".$_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (isset($_REQUEST['age'])) 
    {
        $age = $_REQUEST['age'];
    } 
    else $age = "";
    if (isset($_REQUEST['gender'])) 
    {
        $gender = $_REQUEST['gender'];
    } 
    else $gender = "";
    if (isset($_REQUEST['purpose'])) 
    {
        $purpose = $_REQUEST['purpose'];
    } 
    else $purpose = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";
    if (isset($_REQUEST['from_time'])) 
    {
        $from_time  = $_REQUEST['from_time'];
    } 
    else $from_time  = "";
    if (isset($_REQUEST['delay'])) 
    {
        $delay  = $_REQUEST['delay'];
    } 
    else $delay  = "";
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id  = $_REQUEST['doctor_id'];
    } 
    else $doctor_id  = "";
    if (isset($_REQUEST['is_lunch'])) 
    {
        $is_lunch  = $_REQUEST['is_lunch'];
    } 
    else $is_lunch  = "";
    if (isset($_REQUEST['tod_time'])) 
    {
        $tod_time  = $_REQUEST['tod_time'];
    } 
    else $tod_time  = "";
    $to_time = "";
    $is_completed = 0;
    $appointment_type = "Static Appointment";
    //Custom convert date
    $explode_date = explode("-",$date);
    $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];

    $find_doc = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
    if(mysqli_num_rows($find_doc) > 0)
    {
        while ($row_doc = mysqli_fetch_object($find_doc))
        {
            $output_doc[] = $row_doc;
        }
        $array_time_slot = custom_interval_time($output_doc[0]->from_time_break,$output_doc[0]->to_time_break,$output_doc[0]->consult_time,$output_doc[0]->intervel,$is_lunch);
        $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
        if(mysqli_num_rows($check_time) == 0)
        {
            $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
            if(mysqli_num_rows($check_time_reschedule) == 0)
            {  
                if(in_array($from_time,$array_time_slot)):
                    //insert
                    $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
                    $samedata=mysqli_insert_id($connection);
                    $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`tod_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`,`appointment_type`) values ('".$date."','".$from_time."','".$tod_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."','".$appointment_type."')") or die(mysqli_error());  // die ("invalid query");
                    $samedata1=mysqli_insert_id($connection);
                    if ($samedata1 > 0) 
                    {
                        $recs_role = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE id='".$samedata1."'") or die(mysqli_error());
                        if(mysqli_num_rows($recs_role) > 0)
                        {            
                            while ($row = mysqli_fetch_object($recs_role)) 
                            {
                                $output[] = $row;
                            }
                        }
                        $response['code'] = 1;
                        $response['status'] = 200;
                    } 
                    else
                    {
                        $output[] = array("errmsg" => 'Something error in csv file');
                        $response['status'] = 403;
                    }
                else:
                    $output[] = array("errmsg" => 'Check your Interval/Break time');
                    $response['status'] = 403;
                endif;    
            }    
            else
            {
                $output[] = array("errmsg" => "Slot not available, slot is already booked or its doctor's lunch time");
                $response['status'] = 403;
            }    
        }
        else
        {
            $output[] = array("errmsg" => "Slot not available, slot is already booked or its doctor's lunch time");
            $response['status'] = 403;
        }    
    }
    else
    {
        $output[] = array("errmsg" => 'There is no doctor with this id');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- add custom_doctor --------------//
function add_custom_doctor()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $password = uniqid();
    if (isset($_REQUEST['name'])) 
    {
        $name = $_REQUEST['name'];
    } 
    else $name = "";
    if (isset($_REQUEST['phone'])) 
    {
        $phone = "+".$_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (isset($_REQUEST['specility'])) 
    {
        $specility = $_REQUEST['specility'];
    } 
    else $specility = "";
    if (isset($_REQUEST['patient_interval'])) 
    {
        $patient_interval = $_REQUEST['patient_interval'];
    } 
    else $patient_interval = "";
    if (isset($_REQUEST['sms_intercal'])) 
    {
        $sms_intercal = $_REQUEST['sms_intercal'];
    } 
    else $sms_intercal = "";
    if (isset($_REQUEST['lunch_from'])) 
    {
        $lunch_from = $_REQUEST['lunch_from'];
    } 
    else $lunch_from = "";
    if (isset($_REQUEST['lunch_to'])) 
    {
        $lunch_to = $_REQUEST['lunch_to'];
    } 
    else $lunch_to = "";
    if (isset($_REQUEST['gender'])) 
    {
        $gender  = $_REQUEST['gender'];
    } 
    else $gender  = "";
    if (isset($_REQUEST['hospital_id'])) 
    {
        $hospital_id  = $_REQUEST['hospital_id'];
    } 
    else $hospital_id  = "";
    if (isset($_REQUEST['time_zone'])) 
    {
        $time_zone  = $_REQUEST['time_zone'];
    } 
    else $time_zone  = "";

    if (isset($_REQUEST['consult_time']))
    {
        $consult_time  = $_REQUEST['consult_time'];
    } 
    else $consult_time  = "";
    if (isset($_REQUEST['sms_count'])) 
    {
        $sms_count  = $_REQUEST['sms_count'];
    } 
    else $sms_count  = "";

    $encode_email = base64_encode($email);
    $recs_role3 = db_iquery($connection, "insert into accounts_user (`password`,`is_superuser`,`email`,`is_staff`,`is_active`,`is_doctor`) values ('".$password."','0','".$email."','0','0','1')") or die(mysqli_error());  // die ("invalid query");
    $samedata1=mysqli_insert_id($connection);
    $recs_role1 = db_iquery($connection, "insert into accounts_doctor (`first_name`,`phone`,`specility`,`consult_time`,`intervel`,`sms_intervel`,`sms_count`,`from_time_break`,`to_time_break`,`gender`,`hospital_id_id`,`user_id`,`time_zone`) values ('".$name."','".$phone."','".$specility."','".$consult_time."','".$patient_interval."','".$sms_intercal."','".$sms_count."','".$lunch_from."','".$lunch_to."','".$gender."','".$hospital_id."','".$samedata1."','".$time_zone."')") or die(mysqli_error());  // die ("invalid query");
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {

                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send = "<br></br>Login through this link https://webapp.realtimeappointment.com/TraKKerAppt/admin"; 
                $send .= "<br></br>Username: $email"; 
                $send .= "<br></br>Password: $password"; 
                $send .= "<br></br>Login through this link https://webapp.realtimeappointment.com/TraKKerAppt/admin";
                $send .= "<br></br>Reset password link: https://webapp.realtimeappointment.com/TraKKerAppt/reset_password/$encode_email"; 
                $headers      =  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "Doctor Login Details"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- add doctor --------------//
function add_doctor()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_POST['address'])) 
    {
        $address = $_POST['address'];
    } 
    else $address = "";
    if (isset($_POST['city'])) 
    {
        $city = $_POST['city'];
    } 
    else $city = "";
    if (isset($_POST['state'])) 
    {
        $state = $_POST['state'];
    } 
    else $state = "";
    if (isset($_POST['zip'])) 
    {
        $zip = $_POST['zip'];
    } 
    else $zip = "";
    if (isset($_POST['password'])) 
    {
        $password = $_POST['password'];
    } 
    else $password = "";
    // $password = uniqid();
    if (isset($_POST['name'])) 
    {
        $name = $_POST['name'];
    } 
    else $name = "";
    if (isset($_POST['phone'])) 
    {
        $phone = "+".$_POST['phone'];
    } 
    else $phone = "";
    if (isset($_POST['email'])) 
    {
        $email = $_POST['email'];
    } 
    else $email = "";
    if (isset($_POST['specility'])) 
    {
        $specility = $_POST['specility'];
    } 
    else $specility = "";
    if (isset($_POST['patient_interval'])) 
    {
        $patient_interval = $_POST['patient_interval'];
    } 
    else $patient_interval = "";
    if (isset($_POST['sms_intercal'])) 
    {
        $sms_intercal = $_POST['sms_intercal'];
    } 
    else $sms_intercal = "";
    if (isset($_POST['lunch_from'])) 
    {
        $lunch_from = $_POST['lunch_from'];
    } 
    else $lunch_from = "";
    if (isset($_POST['lunch_to'])) 
    {
        $lunch_to = $_POST['lunch_to'];
    } 
    else $lunch_to = "";
    if (isset($_POST['gender'])) 
    {
        $gender  = $_POST['gender'];
    } 
    else $gender  = "";
    if (isset($_POST['hospital_id'])) 
    {
        $hospital_id  = $_POST['hospital_id'];
    } 
    else $hospital_id  = "";
    if (isset($_POST['time_zone'])) 
    {
        $time_zone  = $_POST['time_zone'];
    } 
    else $time_zone  = "";

    if (isset($_POST['consult_time']))
    {
        $consult_time  = $_POST['consult_time'];
    } 
    else $consult_time  = "";
    if (isset($_POST['sms_count'])) 
    {
        $sms_count  = $_POST['sms_count'];
    } 
    else $sms_count  = "";
    if (isset($_POST['user_name'])) 
    {
        $user_name = $_REQUEST['user_name'];
    } 
    else $user_name = "";
    if (isset($_POST['is_lunch'])) 
    {
        $is_lunch = $_POST['is_lunch'];
    } 
    else $is_lunch = "";
    if (isset($_POST['time_type'])) 
    {
        $time_type = $_POST['time_type'];
    } 
    else $time_type = "";

    $encode_email = base64_encode($email);
    $recs_role3 = db_iquery($connection, "insert into accounts_user (`user_name`,`password`,`is_superuser`,`email`,`is_staff`,`is_active`,`is_doctor`,`phone`) values ('".$user_name."','".$password."','0','".$email."','0','1','1','".$phone."')") or die(mysqli_error());  // die ("invalid query");
    $samedata1=mysqli_insert_id($connection);
    $recs_role1 = db_iquery($connection, "insert into accounts_doctor (`first_name`,`phone`,`specility`,`address`,`city`,`state`,`zipcode`,`consult_time`,`intervel`,`sms_intervel`,`sms_count`,`from_time_break`,`to_time_break`,`gender`,`hospital_id_id`,`user_id`,`time_zone`,`is_active`,`is_lunch`,`time_type`) values ('".$name."','".$phone."','".$specility."','".$address."','".$city."','".$state."','".$zip."','".$consult_time."','".$patient_interval."','".$sms_intercal."','".$sms_count."','".$lunch_from."','".$lunch_to."','".$gender."','".$hospital_id."','".$samedata1."','".$time_zone."','1','".$is_lunch."','".$time_type."')") or die(mysqli_error());  // die ("invalid query");
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                $encode_iddoc = base64_encode($samedata1);
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send = "<br></br>Login through this link https://webapp.realtimeappointment.com/TraKKerAppt/admin"; 
                $send .= "<br></br>Username: $user_name"; 
                $send .= "<br></br>Password: $password"; 
                $send .= "<br></br>Login through this link https://webapp.realtimeappointment.com/TraKKerAppt/admin";
                $send .= "<br></br>Reset password link: https://webapp.realtimeappointment.com/TraKKerAppt/reset_password/$encode_iddoc"; 
                $headers      =  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "Doctor Login Details"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- add custom hospital --------------//
function add_custom_hospital()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['name'])) 
    {
        $hospital_name = $_REQUEST['name'];
    } 
    else $hospital_name = "";
    if (isset($_REQUEST['phone'])) 
    {
        $phone = $_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['reg_no'])) 
    {
        $reg_no = $_REQUEST['reg_no'];
    } 
    else $reg_no = "";
    if (isset($_REQUEST['img'])) 
    {
        $img = $_REQUEST['img'];
    } 
    else $img = "";
    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (isset($_REQUEST['specility'])) 
    {
        $specility = $_REQUEST['specility'];
    } 
    else $specility = "";
    if (isset($_REQUEST['street'])) 
    {
        $street = $_REQUEST['street'];
    } 
    else $street = "";
    if (isset($_REQUEST['landmark'])) 
    {
        $landmark = $_REQUEST['landmark'];
    } 
    else $landmark = "";
    if (isset($_REQUEST['city'])) 
    {
        $city = $_REQUEST['city'];
    } 
    else $city = "";
    if (isset($_REQUEST['state'])) 
    {
        $state = $_REQUEST['state'];
    } 
    else $state = "";
    if (isset($_REQUEST['password'])) 
    {
        $password  = $_REQUEST['password'];
    } 
    else $password  = "";
    $password1 = uniqid();
    $encode_email = base64_encode($email);
    $recs_role3 = db_iquery($connection, "insert into accounts_user (`password`,`is_superuser`,`email`,`is_staff`,`is_active`,`is_doctor`) values ('".$password1."','0','".$email."','0','1','0')") or die(mysqli_error());  // die ("invalid query");
    $samedata1=mysqli_insert_id($connection);
    $recs_role1 = db_iquery($connection, "insert into accounts_hospital (`name`,`phone`,`reg_no`,`img`,`email`,`specility`,`street`,`landmark`,`city`,`state`,`user_id`) values ('".$hospital_name."','".$phone."','".$reg_no."','".$img."','".$email."','".$specility."','".$street."','".$landmark."','".$city."','".$state."','".$samedata1."')") or die(mysqli_error());  // die ("invalid query");
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM accounts_hospital WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send .= "Hospital Name: $hospital_name"; 
                $send .= "<br><br>You can get your own application through this link where you can login with below credential";
                $send .= "<br></br>Login through this link https://webapp.realtimeappointment.com/TraKKerAppt/admin"; 
                $send .= "<br></br>Username: $email"; 
                $send .= "<br></br>Password: $password1"; 
                $send .= "<br></br>Appointments will list through this link"; 
                $send .= "<br></br>check appointment through this link https://webapp.realtimeappointment.com/TraKKerAppt/APPT/$samedata"; 
                $send .= "<br></br>Reset password link: https://webapp.realtimeappointment.com/TraKKerAppt/reset_password/$encode_email"; 
                $headers      .=  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;
                $mail->Port     = $outputmail[0]->port;
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "Hospital Details"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- add hospital --------------//
function add_hospital()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_POST['user_name'])) 
    {
        $user_name = $_POST['user_name'];
    } 
    else $user_name = "";
    if (isset($_POST['name'])) 
    {
        $hospital_name = $_POST['name'];
    } 
    else $hospital_name = "";
    if (isset($_POST['phone'])) 
    {
        $phone = "+".$_POST['phone'];
    } 
    else $phone = "";
    if (isset($_POST['reg_no'])) 
    {
        $reg_no = $_POST['reg_no'];
    } 
    else $reg_no = "";
    if (isset($_POST['img'])) 
    {
        $img = $_POST['img'];
    } 
    else $img = "";
    if (isset($_POST['email'])) 
    {
        $email = $_POST['email'];
    } 
    else $email = "";
    if (isset($_POST['specility'])) 
    {
        $specility = $_POST['specility'];
    } 
    else $specility = "";
    if (isset($_POST['street'])) 
    {
        $street = $_POST['street'];
    } 
    else $street = "";
    if (isset($_POST['landmark'])) 
    {
        $landmark = $_POST['landmark'];
    } 
    else $landmark = "";
    if (isset($_POST['city'])) 
    {
        $city = $_POST['city'];
    } 
    else $city = "";
    if (isset($_POST['state'])) 
    {
        $state = $_POST['state'];
    } 
    else $state = "";
    if (isset($_POST['password'])) 
    {
        $password  = $_POST['password'];
    } 
    else $password  = "";
    // $password1 = uniqid();
    $encode_email = base64_encode($email);
    $recs_role3 = db_iquery($connection, "insert into accounts_user (`user_name`,`password`,`is_superuser`,`email`,`is_staff`,`is_active`,`is_doctor`,`phone`) values ('".$user_name."','".$password."','0','".$email."','0','1','0','".$phone."')") or die(mysqli_error());  // die ("invalid query");
    $samedata1=mysqli_insert_id($connection);
    // echo "insert into accounts_hospital (`name`,`phone`,`reg_no`,`img`,`email`,`specility`,`street`,`landmark`,`city`,`state`,`user_id`) values ('".$hospital_name."','".$phone."','".$reg_no."','".$img."','".$email."','".$specility."','".$street."','".$landmark."','".$city."','".$state."','".$samedata1."')";die;
    $recs_role1 = db_iquery($connection, "insert into accounts_hospital (`name`,`phone`,`reg_no`,`img`,`email`,`specility`,`street`,`landmark`,`city`,`state`,`user_id`,`is_active`) values ('".$hospital_name."','".$phone."','".$reg_no."','".$img."','".$email."','".$specility."','".$street."','".$landmark."','".$city."','".$state."','".$samedata1."','0')") or die(mysqli_error());  // die ("invalid query");
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM accounts_hospital WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                $encode_idhos = base64_encode($samedata1);
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send = '';
                $send .= "Doctor's office Name: $hospital_name"; 
                $send .= "<br><br>You can get your own application through this link where you can login with below credential";
                $send .= "<br></br>Login through this link https://webapp.realtimeappointment.com/TraKKerAppt/admin"; 
                $send .= "<br></br>Username: $user_name"; 
                $send .= "<br></br>Password: $password"; 
                $send .= "<br></br>Appointments will list through this link"; 
                $send .= "<br></br>check appointment through this link https://webapp.realtimeappointment.com/TraKKerAppt/APPT/$samedata"; 
                $send .= "<br></br>Reset password link: https://webapp.realtimeappointment.com/TraKKerAppt/reset_password/$encode_idhos"; 
                $headers = '';
                $headers      .=  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "Doctor's office Details"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- custom appointment update --------------//
function custom_appointment_update1()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    // $account_sid = '';
    // $auth_token = '';
    // $twilio_number = "+17752579977";

    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";

    if (isset($_REQUEST['is_completed'])) 
    {
        $is_completed = $_REQUEST['is_completed'];
    } 
    else $is_completed = "";
    if (isset($_REQUEST['from_time'])) 
    {
        $from_time = $_REQUEST['from_time'];
    } 
    else $from_time = "";
    if (isset($_REQUEST['to_time'])) 
    {
        $to_time = $_REQUEST['to_time'];
    } 
    else $to_time = "";
    if (isset($_REQUEST['appointment_id'])) 
    {
        $appointment_id = $_REQUEST['appointment_id'];
    } 
    else $appointment_id = "";
    if (isset($_REQUEST['feedback'])) 
    {
        $feedback = $_REQUEST['feedback'];
    } 
    else $feedback = "";
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id = $_REQUEST['doctor_id'];
    } 
    else $doctor_id = "";

    if (isset($_REQUEST['intervel'])) 
    {
        $intervel = $_REQUEST['intervel'];
    } 
    else $intervel = "00:05:00";
    if (isset($_REQUEST['sms_intervel'])) 
    {
        $sms_intervel = $_REQUEST['sms_intervel'];
    } 
    else $sms_intervel = "00:05:00";
    if (isset($_REQUEST['no_sms'])) 
    {
        $no_sms = $_REQUEST['no_sms'];
    } 
    else $no_sms = "2";
    if (isset($_REQUEST['from_time_break'])) 
    {
        $from_time_break = $_REQUEST['from_time_break'];
    } 
    else $from_time_break = "";
    if (isset($_REQUEST['to_time_break'])) 
    {
        $to_time_break = $_REQUEST['to_time_break'];
    } 
    else $to_time_break = "";
    if (isset($_REQUEST['is_lunch'])) 
    {
        $is_lunch = $_REQUEST['is_lunch'];
    } 
    else $is_lunch = "";

    $found_one = $no_sms + 2;
    $found_one1 = $found_one - 2;


    if($is_lunch == 1):
        $is_complete_check = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."' and is_completed=1") or die(mysqli_error());
        if(mysqli_num_rows($is_complete_check) > 0)
        {
            $response['code'] = 0;
            $output[] = array("msg" => 'Already appointment completed');
            $response['status'] = 404;
        } 
        else
        {
            /** text custom code*/
            $for1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
            if(mysqli_num_rows($for1) > 0)
            {
                while ($rowtime = mysqli_fetch_object($for1)) 
                { 
                    $for1234 = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$rowtime->doc_id_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($for1234) > 0)
                    {
                        while ($rowtime1 = mysqli_fetch_object($for1234)) 
                        { 
                            $time_zone_find = $rowtime1->time_zone;
                            date_default_timezone_set("$time_zone_find");
                        }
                    }    
                    else
                    {
                        date_default_timezone_set('America/Chicago');
                    }
                }
            }    
            $date = date("m-d-Y");  
            $for189 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
            if(mysqli_num_rows($for189) > 0)
            {
                while ($row1 = mysqli_fetch_object($for189)) 
                { 
                    $for2 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id='".$row1->patient_id_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($for2) > 0)
                    {
                        while ($row2 = mysqli_fetch_object($for2)) 
                        { 
                            $phone_custom = $row2->phone;
                            $name  = 'Hi '.$row2->first_name.' '.$row2->last_name.', thanks for choosing RealTime Appointment. What was your experience with us? Please let us know: https://g.page/r/CVEoOxLT-lbwEB0/review';
                            $client = new Client($account_sid, $auth_token);
                            $client->messages->create(
                            $phone_custom,
                            array(
                                'from' => $twilio_number,
                                'body' => $name
                            ));
                        }
                    } 
                }
            } 
            $recs_role = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
            if(mysqli_num_rows($recs_role) > 0)
            {            
                while ($row = mysqli_fetch_object($recs_role)) 
                {
                    $outputs[] = $row;
                }
                // print_r($outputs);die;
                $delay = $outputs[0]->delay;
                $start_time = $to_time; 
                if(!empty($outputs[0]->reschdule_time))
                {
                    $current_time = $outputs[0]->reschdule_time;
                }
                else
                {
                    $current_time = $outputs[0]->from_time;
                }
                // echo $current_time;die;
                // $current_time = $outputs[0]->from_time;
                $start_t = new DateTime($start_time);
                $current_t = new DateTime($current_time);
                $difference = $start_t ->diff($current_t);
                $return_time = $difference ->format('%H:%I:%S');
                // echo $return_time;die;
                if($delay < $return_time)
                {
                    // reschdeule
                    $sms_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT 2,$no_sms") or die(mysqli_error());
                    $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT $found_one") or die(mysqli_error());
                    $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($recs_role1c) > 0)
                    {            
                        $recs_update312 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                        // calculate updated id time
                        $recs_roleu = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
                        if(mysqli_num_rows($recs_roleu) > 0)
                        {            
                            while ($rowu = mysqli_fetch_object($recs_roleu)) 
                            {
                                $outputsu[] = $rowu;
                            }
                        }    
                        $start_time1 = $to_time;
                        if(!empty($outputsu[0]->reschdule_time))
                        {
                            $current_time1 = $outputsu[0]->reschdule_time;
                        }
                        else
                        {
                            $current_time1 = $outputsu[0]->from_time;
                        }
                        /** Find difference from to-time and from-time*/
                        $delay1 = $outputsu[0]->delay;
                        $start_t1 = new DateTime($start_time1);
                        $current_t1 = new DateTime($current_time1);
                        $difference1 = $start_t1 ->diff($current_t1);
                        $return_time1 = $difference1 ->format('%H:%I:%S');
                        
                        /** Find difference from delay-time and found time*/
                        $start_t12 = new DateTime($return_time1);
                        $current_t12 = new DateTime($delay1);
                        $difference12 = $start_t12 ->diff($current_t12);
                        $return_time12 = $difference12 ->format('%H:%I:%S');

                        if(mysqli_num_rows($recs_role1) > 0):
                            while ($row1 = mysqli_fetch_object($recs_role1))
                            {
                                $outputs1[] = $row1;
                            }
                        else:
                            $outputs1[] ="";
                        endif;
                        if(mysqli_num_rows($sms_role1) > 0):
                            while ($cus_recs_row1 = mysqli_fetch_object($sms_role1)) 
                            {
                                $cus_recs_outputs[] = $cus_recs_row1->id;
                            }
                        else:
                            $cus_recs_outputs[] ="";
                        endif;
                        if(!empty($outputs1)):
                            $convert = 1;
                            foreach($outputs1 as $outputs12)
                            {
                                if(!empty($outputs12->reschdule_time))
                                {
                                    $addtime1 = $outputs12->reschdule_time;
                                }
                                else
                                {
                                    $addtime1 = $outputs12->from_time;
                                }
                                /** Add interve and delay */
                                $in = strtotime($intervel)-strtotime("00:00:00");
                                $find_intervel = date("H:i:s",strtotime($delay1)+$in);
                                /** End Add interve and delay */
                                /** End 2nd method */
                                if($convert == 1):
                                    /** Add interval with to_time */
                                    $secs1 = strtotime($intervel)-strtotime("00:00:00");
                                    $result1 = date("H:i:s",strtotime($start_time1)+$secs1);
                                else:
                                    $get_one = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id = '".$outputs1[0]->id."'") or die(mysqli_error());
                                    if(mysqli_num_rows($get_one) > 0)
                                    {    
                                        while ($get_one1 = mysqli_fetch_object($get_one)) 
                                        {
                                            $custom1[] = $get_one1;
                                        }
                                    }
                                    $cus_time = custom_time($find_intervel,$convert - 1);
                                    $added_cus = strtotime($cus_time)-strtotime("00:00:00");
                                    $result1 = date("H:i:s",strtotime($custom1[0]->reschdule_time)+$added_cus);
                                endif;   
                                /** End 2nd method */    
                                $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET reschdule_time ='".$result1."' WHERE id='".$outputs12->id."'") or die(mysqli_error());        
                                if (in_array($outputs12->id, $cus_recs_outputs)):
                                    /** find interval from-time to reshedule-time */
                                    $strt = $outputs12->from_time;
                                    $rest = $result1;
                                    $strt_t1 = new DateTime($strt);
                                    $curt_t1 = new DateTime($rest);
                                    $diff1 = $strt_t1 ->diff($curt_t1);
                                    $final_time = $diff1 ->format('%H:%I:%S');
                                    if($final_time>=$sms_intervel):
                                        if($outputs12->is_sms==0):
                                            $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id ='".$outputs12->patient_id_id."'") or die(mysqli_error());
                                            if(mysqli_num_rows($recs_role12) > 0)
                                            {            
                                                while ($row3 = mysqli_fetch_object($recs_role12)) 
                                                {
                                                    $output4 = $row3;
                                                    /** For dynamic content for sms */
                                                    $dynamic_content = db_iquery($connection, "SELECT * FROM  doctor_template WHERE doctor_id = '".$doctor_id."'") or die(mysqli_error());
                                                    if(mysqli_num_rows($dynamic_content) > 0)
                                                    {    
                                                        while ($dynamic_content_row = mysqli_fetch_object($dynamic_content)) 
                                                        {
                                                            $concat_name = $output4->first_name.' '.$output4->last_name;
                                                            $set_dynamic = str_replace("%%DATE%%",$result1,str_replace("%%TIME%%",$result1,str_replace("%%NAME%%",$concat_name,$dynamic_content_row->reschedule_sms_template)));        
                                                            if(!empty($set_dynamic)):
                                                                $name = Strip_tags($set_dynamic);
                                                            else:
                                                                $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                                            endif;
                                                        }
                                                    }
                                                    else
                                                    {
                                                        $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                                    }

                                                    // $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                                    $tonumber12 = $output4->phone;
                                                    $client = new Client($account_sid, $auth_token);
                                                    $client->messages->create(
                                                        $tonumber12,
                                                        array(
                                                            'from' => $twilio_number,
                                                            'body' => $name
                                                        )
                                                    );
                                                }
                                            } 
                                            $update_sms = db_iquery($connection, "UPDATE accounts_appointment SET is_sms = 1 WHERE id='".$outputs12->id."'") or die(mysqli_error());        
                                        endif;    
                                    endif;
                                endif;  
                                $convert++;
                            }
                        endif;
                    }
                    else
                    {
                        $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                    }
                    $response['code'] = 1;
                    $output[] = array("msg" => 'updated successfully');
                    $response['status'] = 200;
                }
                elseif(1 == 1)
                {
                    $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT $found_one1,2") or die(mysqli_error());
                    $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($recs_role1c) > 0)
                    {            
                        $recs_update312 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());           
                    }
                    else
                    {
                        $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                    }
                    $response['code'] = 1;
                    $output[] = array("msg" => 'updated successfully');
                    $response['status'] = 200;
                }
                else
                {
                    //update
                    $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                    $response['code'] = 1;
                    $output[] = array("msg" => 'updated successfully');
                    $response['status'] = 200;
                }
            } 
            else
            {
                $output[] = array("errmsg" => 'Invalid');
                $response['status'] = 400;
            }
        }
    else:
        $is_complete_check = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."' and is_completed=1") or die(mysqli_error());
        if(mysqli_num_rows($is_complete_check) > 0)
        {
            $response['code'] = 0;
            $output[] = array("msg" => 'Already appointment completed');
            $response['status'] = 404;
        } 
        else
        {
            /** text custom code*/
            $for1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
            if(mysqli_num_rows($for1) > 0)
            {
                while ($rowtime = mysqli_fetch_object($for1)) 
                { 
                    $for1234 = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$rowtime->doc_id_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($for1234) > 0)
                    {
                        while ($rowtime1 = mysqli_fetch_object($for1234)) 
                        { 
                            $time_zone_find = $rowtime1->time_zone;
                            // if($time_zone_find == "India")
                            // {
                            //     date_default_timezone_set('Asia/Kolkata');
                            // }
                            // else
                            // {
                                date_default_timezone_set("$time_zone_find");
                            // }
                        }
                    }    
                    else
                    {
                        date_default_timezone_set('America/Chicago');
                    }
                }
            }    
            $date = date("m-d-Y");  
            $for189 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
            if(mysqli_num_rows($for189) > 0)
            {
                while ($row1 = mysqli_fetch_object($for189)) 
                { 
                    $for2 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id='".$row1->patient_id_id."'") or die(mysqli_error());
                    if(mysqli_num_rows($for2) > 0)
                    {
                        while ($row2 = mysqli_fetch_object($for2)) 
                        { 
                            // $account_sid = '';
                            // $auth_token = '';
                            // $twilio_number = "+12818843247";

                            $phone_custom = $row2->phone;
                            $name  = 'Hi '.$row2->first_name.' '.$row2->last_name.', thanks for choosing RealTime Appointment. What was your experience with us? Please let us know: https://g.page/r/CVEoOxLT-lbwEB0/review';
                            $client = new Client($account_sid, $auth_token);
                            $client->messages->create(
                            $phone_custom,
                            array(
                                'from' => $twilio_number,
                                'body' => $name
                            ));
                        }
                    } 
                }
            } 
            /** Check with last id before lunch */
            $check_last_id = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and reschdule_time!='' and reschdule_time <'".$from_time_break."' order by from_time desc LIMIT 1") or die(mysqli_error());
            if(mysqli_num_rows($check_last_id) > 0)
            {  
                while ($check_last = mysqli_fetch_object($check_last_id)) 
                {
                    $cl[] = $check_last;
                }
            }
            else
            {
                $check_last_id = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' order by from_time desc LIMIT 1") or die(mysqli_error());
                if(mysqli_num_rows($check_last_id) > 0)
                {            
                    while ($check_last = mysqli_fetch_object($check_last_id)) 
                    {
                        $cl[] = $check_last;
                    }
                }
            }
            if(isset($cl) && $cl[0]->id == $appointment_id)
            {
                $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                $response['code'] = 1;
                $output[] = array("msg" => 'updated successfully');
                $response['status'] = 200;
            }
            else
            {
                $recs_role = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
                if(mysqli_num_rows($recs_role) > 0)
                {            
                    while ($row = mysqli_fetch_object($recs_role)) 
                    {
                        $outputs[] = $row;
                    }
                    // print_r($outputs);die;
                    $delay = $outputs[0]->delay;
                    $start_time = $to_time; 
                    if(!empty($outputs[0]->reschdule_time))
                    {
                        $current_time = $outputs[0]->reschdule_time;
                    }
                    else
                    {
                        $current_time = $outputs[0]->from_time;
                    }
                    // echo $current_time;die;
                    // $current_time = $outputs[0]->from_time;
                    $start_t = new DateTime($start_time);
                    $current_t = new DateTime($current_time);
                    $difference = $start_t ->diff($current_t);
                    $return_time = $difference ->format('%H:%I:%S');
                    // echo $return_time;die;
                    if($delay < $return_time)
                    {
                        // reschdeule
                        if($to_time<$from_time_break)
                        {   
                            // echo "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT 2,$no_sms";
                            // echo "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT $found_one";die;
                            $sms_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT 2,$no_sms") or die(mysqli_error());
                            $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT $found_one") or die(mysqli_error());
                            $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
                        }
                        else
                        {
                            $sms_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT 2,$no_sms") or die(mysqli_error());
                            $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT $found_one") or die(mysqli_error());
                            $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
                        }
                        if(mysqli_num_rows($recs_role1c) > 0)
                        {            
                            $recs_update312 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                            // calculate updated id time
                            $recs_roleu = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
                            if(mysqli_num_rows($recs_roleu) > 0)
                            {            
                                while ($rowu = mysqli_fetch_object($recs_roleu)) 
                                {
                                    $outputsu[] = $rowu;
                                }
                            }    
                            $start_time1 = $to_time;
                            if(!empty($outputsu[0]->reschdule_time))
                            {
                                $current_time1 = $outputsu[0]->reschdule_time;
                            }
                            else
                            {
                                $current_time1 = $outputsu[0]->from_time;
                            }
                            /** Find difference from to-time and from-time*/
                            $delay1 = $outputsu[0]->delay;
                            $start_t1 = new DateTime($start_time1);
                            $current_t1 = new DateTime($current_time1);
                            $difference1 = $start_t1 ->diff($current_t1);
                            $return_time1 = $difference1 ->format('%H:%I:%S');
                            
                            /** Find difference from delay-time and found time*/
                            $start_t12 = new DateTime($return_time1);
                            $current_t12 = new DateTime($delay1);
                            $difference12 = $start_t12 ->diff($current_t12);
                            $return_time12 = $difference12 ->format('%H:%I:%S');

                            if(mysqli_num_rows($recs_role1) > 0):
                                while ($row1 = mysqli_fetch_object($recs_role1))
                                {
                                    $outputs1[] = $row1;
                                }
                            else:
                                $outputs1[] ="";
                            endif;
                            if(mysqli_num_rows($sms_role1) > 0):
                                while ($cus_recs_row1 = mysqli_fetch_object($sms_role1)) 
                                {
                                    $cus_recs_outputs[] = $cus_recs_row1->id;
                                }
                            else:
                                $cus_recs_outputs[] ="";
                            endif;
                            if(!empty($outputs1)):
                                $convert = 1;
                                foreach($outputs1 as $outputs12)
                                {
                                    if(!empty($outputs12->reschdule_time))
                                    {
                                        $addtime1 = $outputs12->reschdule_time;
                                    }
                                    else
                                    {
                                        $addtime1 = $outputs12->from_time;
                                    }
                                    /** Add interve and delay */
                                    $in = strtotime($intervel)-strtotime("00:00:00");
                                    $find_intervel = date("H:i:s",strtotime($delay1)+$in);
                                    /** End Add interve and delay */

                                    /** 1st method */
                                    // if($return_time1>$find_intervel)
                                    // {
                                    //     /** Subtract find_interve from return_time1 */
                                    //     $find_add = strtotime($find_intervel)-strtotime("00:00:00");
                                    //     $find_minus = date("H:i:s",strtotime($return_time1)-$find_add);
                                    //     /** Add intervel and find_minus */
                                    //     $intervel_for = strtotime($intervel)-strtotime("00:00:00");
                                    //     $final_add_value = date("H:i:s",strtotime($find_minus)+$intervel_for);
                                    //     /**reschedule time */
                                    //     $secs1 = strtotime($final_add_value)-strtotime("00:00:00");
                                    //     $result1 = date("H:i:s",strtotime($addtime1)+$secs1);
                                    // }
                                    // else
                                    // {
                                    //     /** Subtract find_interve from return_time1 */
                                    //     $find_add = strtotime($return_time1)-strtotime("00:00:00");
                                    //     $find_minus = date("H:i:s",strtotime($find_intervel)-$find_add);
                                    //     /** subtract intervel and find_minus */
                                    //     $intervel_for = strtotime($find_minus)-strtotime("00:00:00");
                                    //     $final_add_value = date("H:i:s",strtotime($intervel)-$intervel_for);
                                    //     /**reschedule time */
                                    //     $secs1 = strtotime($final_add_value)-strtotime("00:00:00");
                                    //     $result1 = date("H:i:s",strtotime($addtime1)+$secs1);
                                    // }
                                    /** 1st method */
                                    /** End 2nd method */
                                    if($convert == 1):
                                        /** Add interval with to_time */
                                        $secs1 = strtotime($intervel)-strtotime("00:00:00");
                                        $result1 = date("H:i:s",strtotime($start_time1)+$secs1);
                                    else:
                                        $get_one = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id = '".$outputs1[0]->id."'") or die(mysqli_error());
                                        if(mysqli_num_rows($get_one) > 0)
                                        {    
                                            while ($get_one1 = mysqli_fetch_object($get_one)) 
                                            {
                                                $custom1[] = $get_one1;
                                            }
                                        }
                                        $cus_time = custom_time($find_intervel,$convert - 1);
                                        $added_cus = strtotime($cus_time)-strtotime("00:00:00");
                                        $result1 = date("H:i:s",strtotime($custom1[0]->reschdule_time)+$added_cus);
                                    endif;   
                                    /** End 2nd method */    
                                    /** Special concept for lunch. Code did on 02-06-23*/
                                    if($result1>$from_time_break && $result1<$to_time_break)
                                    {
                                        $find_totime = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date ='".$date."' and doc_id_id ='".$doctor_id."' and to_time = '".$to_time_break."' and is_show = 0 and is_completed = 0") or die(mysqli_error());
                                        if(mysqli_num_rows($find_totime) > 0):
                                        else:
                                            // $find_within_lunch = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date ='".$date."' and doc_id_id ='".$doctor_id."' and from_time < '".$from_time_break."' and id >='".$outputs12->id."' and is_show = 0 and is_completed = 0") or die(mysqli_error());
                                            $find_within_lunch = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date ='".$date."' and doc_id_id ='".$doctor_id."' and from_time < '".$from_time_break."' and from_time >='".$outputs12->from_time."' and is_show = 0 and is_completed = 0  ORDER by from_time ASC") or die(mysqli_error());
                                            $after_lunch_limit_data = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date ='".$date."' and doc_id_id ='".$doctor_id."' and from_time >= '".$from_time_break."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT $no_sms") or die(mysqli_error());
                                            $find_within_lunch1[] = "";
                                            $after_lunch_limit_data1[] = "";
                                            if(mysqli_num_rows($find_within_lunch) > 0):
                                                while ($rr1 = mysqli_fetch_object($find_within_lunch)) 
                                                {
                                                    $find_within_lunch1[] = $rr1;
                                                }
                                            endif; 
                                            if(mysqli_num_rows($after_lunch_limit_data) > 0):
                                                while ($rr2 = mysqli_fetch_object($after_lunch_limit_data)) 
                                                {
                                                    $after_lunch_limit_data1[] = $rr2;
                                                }
                                            endif;
                                            $final_arrays = array_merge($find_within_lunch1,$after_lunch_limit_data1);
                                            $final_arrays = array_filter($final_arrays);
                                            $z = 0;
                                            foreach($final_arrays as $final_array)
                                            {
                                                $check[] = $final_array->id;
                                                if($z == 0)
                                                {
                                                    $find_reschedule_time = $to_time_break;
                                                }
                                                else
                                                {
                                                    $multiple_one = custom_time($find_intervel,$z);
                                                    $added_one = strtotime($multiple_one)-strtotime("00:00:00");
                                                    $find_reschedule_time = date("H:i:s",strtotime($to_time_break)+$added_one);
                                                }
                                                $reschedule_update = db_iquery($connection, "UPDATE accounts_appointment SET reschdule_time ='".$find_reschedule_time."' WHERE id='".$final_array->id."'") or die(mysqli_error());        
                                                $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id ='".$final_array->patient_id_id."'") or die(mysqli_error());
                                                if(mysqli_num_rows($recs_role12) > 0)
                                                {            
                                                    while ($row3 = mysqli_fetch_object($recs_role12)) 
                                                    {
                                                        $output4 = $row3;
                                                        /** For dynamic content for sms */
                                                        $dynamic_content = db_iquery($connection, "SELECT * FROM  doctor_template WHERE doctor_id = '".$doctor_id."'") or die(mysqli_error());
                                                        if(mysqli_num_rows($dynamic_content) > 0)
                                                        {    
                                                            while ($dynamic_content_row = mysqli_fetch_object($dynamic_content)) 
                                                            {
                                                                $concat_name = $output4->first_name.' '.$output4->last_name;
                                                                $set_dynamic = str_replace("%%DATE%%",$find_reschedule_time,str_replace("%%TIME%%",$find_reschedule_time,str_replace("%%NAME%%",$concat_name,$dynamic_content_row->reschedule_sms_template)));        
                                                                if(!empty($set_dynamic)):
                                                                    $name = Strip_tags($set_dynamic);
                                                                else:
                                                                    $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$find_reschedule_time;
                                                                endif;
                                                            }
                                                        }
                                                        else
                                                        {
                                                            $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$find_reschedule_time;
                                                        }

                                                        // $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$find_reschedule_time;
                                                        $tonumber12 = $output4->phone;
                                                        $client = new Client($account_sid, $auth_token);
                                                        $client->messages->create(
                                                            $tonumber12,
                                                            array(
                                                                'from' => $twilio_number,
                                                                'body' => $name
                                                            )
                                                        );
                                                    }
                                                } 
                                                $update_sms = db_iquery($connection, "UPDATE accounts_appointment SET is_sms = 1 WHERE id='".$final_array->id."'") or die(mysqli_error());        
                                                $z++;
                                            }
                                            /** stop the process */
                                            $response['code'] = 1;
                                            $output[] = array("msg" => 'updated successfully');
                                            $response['status'] = 200;
                                            // print_r($check);
                                            // print_r($find_within_lunch1);
                                            die;
                                        endif;
                                    }
                                    /** End Special concept for lunch */
                                    else
                                    {
                                        $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET reschdule_time ='".$result1."' WHERE id='".$outputs12->id."'") or die(mysqli_error());        
                                        if (in_array($outputs12->id, $cus_recs_outputs)):
                                            /** find interval from-time to reshedule-time */
                                            $strt = $outputs12->from_time;
                                            $rest = $result1;
                                            $strt_t1 = new DateTime($strt);
                                            $curt_t1 = new DateTime($rest);
                                            $diff1 = $strt_t1 ->diff($curt_t1);
                                            $final_time = $diff1 ->format('%H:%I:%S');
                                            if($final_time>=$sms_intervel):
                                                if($outputs12->is_sms==0):
                                                    $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id ='".$outputs12->patient_id_id."'") or die(mysqli_error());
                                                    if(mysqli_num_rows($recs_role12) > 0)
                                                    {            
                                                        while ($row3 = mysqli_fetch_object($recs_role12)) 
                                                        {
                                                            $output4 = $row3;
                                                            /** For dynamic content for sms */
                                                            $dynamic_content = db_iquery($connection, "SELECT * FROM  doctor_template WHERE doctor_id = '".$doctor_id."'") or die(mysqli_error());
                                                            if(mysqli_num_rows($dynamic_content) > 0)
                                                            {    
                                                                while ($dynamic_content_row = mysqli_fetch_object($dynamic_content)) 
                                                                {
                                                                    $concat_name = $output4->first_name.' '.$output4->last_name;
                                                                    $set_dynamic = str_replace("%%DATE%%",$result1,str_replace("%%TIME%%",$result1,str_replace("%%NAME%%",$concat_name,$dynamic_content_row->reschedule_sms_template)));        
                                                                    if(!empty($set_dynamic)):
                                                                        $name = Strip_tags($set_dynamic);
                                                                    else:
                                                                        $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                                                    endif;
                                                                }
                                                            }
                                                            else
                                                            {
                                                                $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                                            }

                                                            // $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                                            $tonumber12 = $output4->phone;
                                                            $client = new Client($account_sid, $auth_token);
                                                            $client->messages->create(
                                                                $tonumber12,
                                                                array(
                                                                    'from' => $twilio_number,
                                                                    'body' => $name
                                                                )
                                                            );
                                                        }
                                                    } 
                                                    $update_sms = db_iquery($connection, "UPDATE accounts_appointment SET is_sms = 1 WHERE id='".$outputs12->id."'") or die(mysqli_error());        
                                                endif;    
                                            endif;
                                        endif;  
                                    }  
                                    $convert++;
                                }
                            endif;
                        }
                        else
                        {
                            $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                        }
                        $response['code'] = 1;
                        $output[] = array("msg" => 'updated successfully');
                        $response['status'] = 200;
                    }
                    elseif(1 == 1)
                    {
                        // reschdeule
                        if($to_time<$from_time_break)
                        {
                            $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT $found_one1,2") or die(mysqli_error());
                            $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
                        }
                        else
                        {
                            $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT $found_one1,2") or die(mysqli_error());
                            $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
                        }
                        if(mysqli_num_rows($recs_role1c) > 0)
                        {            
                            $recs_update312 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());           
                        }
                        else
                        {
                            $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                        }
                        $response['code'] = 1;
                        $output[] = array("msg" => 'updated successfully');
                        $response['status'] = 200;
                    }
                    else
                    {
                        //update
                        $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_completed ='".$is_completed."',to_time ='".$to_time."',feedback ='".$feedback."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
                        $response['code'] = 1;
                        $output[] = array("msg" => 'updated successfully');
                        $response['status'] = 200;
                    }
                } 
                else
                {
                    $output[] = array("errmsg" => 'Invalid');
                    $response['status'] = 400;
                }
            }
        }
    endif;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

function custom_time($find_intervel,$z)
{
    $maritime =$find_intervel;
    $seconds = strtotime("1970-01-01 $maritime UTC");
    $multiply = $seconds * $z;  #Here you can multiply with your dynamic value
    return gmdate("H:i:s",$multiply);
}

//--------------- custom appointment update --------------//
function custom_appointment_update1_noshow()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";

    if (isset($_REQUEST['is_show'])) 
    {
        $is_show = $_REQUEST['is_show'];
    } 
    else $is_show = "";
    if (isset($_REQUEST['from_time'])) 
    {
        $from_time = $_REQUEST['from_time'];
    } 
    else $from_time = "";
    if (isset($_REQUEST['to_time'])) 
    {
        $to_time = $_REQUEST['to_time'];
    } 
    else $to_time = "";
    if (isset($_REQUEST['appointment_id'])) 
    {
        $appointment_id = $_REQUEST['appointment_id'];
    } 
    else $appointment_id = "";
    if (isset($_REQUEST['feedback'])) 
    {
        $feedback = $_REQUEST['feedback'];
    } 
    else $feedback = "";
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id = $_REQUEST['doctor_id'];
    } 
    else $doctor_id = "";

    if (isset($_REQUEST['intervel'])) 
    {
        $intervel = $_REQUEST['intervel'];
    } 
    else $intervel = "00:05:00";
    if (isset($_REQUEST['sms_intervel'])) 
    {
        $sms_intervel = $_REQUEST['sms_intervel'];
    } 
    else $sms_intervel = "00:05:00";
    if (isset($_REQUEST['no_sms'])) 
    {
        $no_sms = $_REQUEST['no_sms'];
    } 
    else $no_sms = "2";
    if (isset($_REQUEST['from_time_break'])) 
    {
        $from_time_break = $_REQUEST['from_time_break'];
    } 
    else $from_time_break = "";
    if (isset($_REQUEST['to_time_break'])) 
    {
        $to_time_break = $_REQUEST['to_time_break'];
    } 
    else $to_time_break = "";

    $found_one = $no_sms + 2;
    $found_one1 = $found_one - 2;
    //text
    $for1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
    if(mysqli_num_rows($for1) > 0)
    {
        while ($rowtime = mysqli_fetch_object($for1)) 
        { 
            $for1234 = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$rowtime->doc_id_id."'") or die(mysqli_error());
            if(mysqli_num_rows($for1234) > 0)
            {
                while ($rowtime1 = mysqli_fetch_object($for1234)) 
                { 
                    $time_zone_find = $rowtime1->time_zone;
                    date_default_timezone_set("$time_zone_find");
                }
            }    
            else
            {
                date_default_timezone_set('America/Chicago');
            }
        }
    }    
    $date = date("m-d-Y");  
    $recs_role = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id='".$appointment_id."'") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        // reschdeule
        if($to_time<$from_time_break)
        {
            $sms_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT 2,$no_sms") or die(mysqli_error());
            $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 and from_time <'".$from_time_break."' ORDER by from_time ASC LIMIT $found_one") or die(mysqli_error());
            $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
        }
        else
        {
            $sms_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT 2,$no_sms") or die(mysqli_error());
            $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE from_time  <>'".$from_time."' and from_time  >'".$from_time."' and date ='".$date."' and doc_id_id ='".$doctor_id."' and is_show = 0 and is_completed = 0 ORDER by from_time ASC LIMIT $found_one") or die(mysqli_error());
            $recs_role1c = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE id ='".$appointment_id."'") or die(mysqli_error());
        }
        if(mysqli_num_rows($recs_role1c) > 0)
        {        
            while ($rowu = mysqli_fetch_object($recs_role1c)) 
            {
                $outputsu[] = $rowu;
            }  
            $recs_update312 = db_iquery($connection, "UPDATE accounts_appointment SET is_show ='".$is_show."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
            if(mysqli_num_rows($recs_role1) > 0):
                while ($row1 = mysqli_fetch_object($recs_role1))
                {
                    $outputs1[] = $row1;
                }
            else:
                $outputs1[]="";
            endif;        
            if(mysqli_num_rows($sms_role1) > 0):
                while ($cus_recs_row1 = mysqli_fetch_object($sms_role1)) 
                {
                    $cus_recs_outputs[] = $cus_recs_row1->id;
                }
            else:
                $cus_recs_outputs[]="";
            endif;
            /** Add interve and delay */
            $delay1 = $outputsu[0]->delay;
            $in = strtotime($intervel)-strtotime("00:00:00");
            $find_intervel = date("H:i:s",strtotime($delay1)+$in);
            $nos = 1;
            if(!empty($outputs1)):
            foreach($outputs1 as $outputs12)
            {
                if($nos == 1)
                {
                    $result1 = $to_time;
                }
                else
                {
                    // if(!empty($outputs12->reschdule_time))
                    // {
                    //     $addtime1 = $outputs12->reschdule_time;
                    // }
                    // else
                    // {
                    //     $addtime1 = $outputs12->from_time;
                    // }
                    // $inn = strtotime($addtime1)-strtotime("00:00:00");
                    // $result1 = date("H:i:s",strtotime($find_intervel)+$inn);
                    $cus_time = custom_time($find_intervel,$nos - 1);
                    $inn = strtotime($to_time)-strtotime("00:00:00");
                    $result1 = date("H:i:s",strtotime($cus_time)+$inn);
                }
                $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET reschdule_time ='".$result1."' WHERE id='".$outputs12->id."'") or die(mysqli_error());        
                if (in_array($outputs12->id, $cus_recs_outputs)):
                    /** find interval from-time to reshedule-time */
                    $strt = $outputs12->from_time;
                    $rest = $result1;
                    $strt_t1 = new DateTime($strt);
                    $curt_t1 = new DateTime($rest);
                    $diff1 = $strt_t1 ->diff($curt_t1);
                    $final_time = $diff1 ->format('%H:%I:%S');
                    if($final_time>=$sms_intervel):
                        if($outputs12->is_sms==0):
                            $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id ='".$outputs12->patient_id_id."'") or die(mysqli_error());
                            if(mysqli_num_rows($recs_role12) > 0)
                            {            
                                while ($row3 = mysqli_fetch_object($recs_role12)) 
                                {
                                    $output4 = $row3;
                                    /** For dynamic content for sms */
                                    $dynamic_content = db_iquery($connection, "SELECT * FROM  doctor_template WHERE doctor_id = '".$doctor_id."'") or die(mysqli_error());
                                    if(mysqli_num_rows($dynamic_content) > 0)
                                    {    
                                        while ($dynamic_content_row = mysqli_fetch_object($dynamic_content)) 
                                        {
                                            $concat_name = $output4->first_name.' '.$output4->last_name;
                                            $set_dynamic = str_replace("%%DATE%%",$result1,str_replace("%%TIME%%",$result1,str_replace("%%NAME%%",$concat_name,$dynamic_content_row->reschedule_sms_template)));        
                                            if(!empty($set_dynamic)):
                                                $name = Strip_tags($set_dynamic);
                                            else:
                                                $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                            endif;
                                        }
                                    }
                                    else
                                    {
                                        $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                    }
                                    // $name  = 'Hi '.$output4->first_name.' '.$output4->last_name.', We are sorry to inform you that we have to reschedule your appointment. Your reschedule appointment will be at: '.$result1;
                                    $tonumber12 = $output4->phone;
                                    $client = new Client($account_sid, $auth_token);
                                    $client->messages->create(
                                        $tonumber12,
                                        array(
                                            'from' => $twilio_number,
                                            'body' => $name
                                        )
                                    );
                                }
                            } 
                            $update_sms = db_iquery($connection, "UPDATE accounts_appointment SET is_sms = 1 WHERE id='".$outputs12->id."'") or die(mysqli_error());        
                        endif;    
                    endif;
                endif;  
                $nos++;  
            }
            endif;
        }
        else
        {
            $recs_update3 = db_iquery($connection, "UPDATE accounts_appointment SET is_show ='".$is_show."' WHERE id='".$appointment_id."'") or die(mysqli_error());        
        }
        $response['code'] = 1;
        $output[] = array("msg" => 'updated successfully');
        $response['status'] = 200;
    } 
    else
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 400;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//---------- custom appointment update for is_show --------//
function custom_appointment_isshow()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    // $account_sid = '';
    // $auth_token = '';
    // $twilio_number = "+17752579977";

    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";

    if (isset($_REQUEST['appointment_id'])) 
    {
        $appointment_id = $_REQUEST['appointment_id'];
    } 
    else $appointment_id = "";
    if (isset($_REQUEST['is_show'])) 
    {
        $is_show = $_REQUEST['is_show'];
    } 
    else $is_show = "";

    $recs_role1 = db_iquery($connection, "UPDATE accounts_appointment SET is_show ='".$is_show."' WHERE id='".$appointment_id."'") or die(mysqli_error());
    $output[] = array("msg" => 'Suceesfully Updated');
    $response['code'] = 1;
    $response['status'] = 200;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get custom appointment --------------//
function get_custom_appointment()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    
    if (isset($_REQUEST['doc_id'])) 
    {
        $doc_id = $_REQUEST['doc_id'];
    } 
    else $doc_id = "";
    // echo "select a.id as appoint_id, a.date, a.delay,a.from_time as app_fromtime,a.to_time as app_totime, a.is_completed as appis_completed, b.id as doctor_id,b.first_name as doctor_name,b.hospital_id_id  as hospital_id, c.* from accounts_appointment a, accounts_doctor b, accounts_patient c
    // where $doc_id = b.id and a.patient_id_id = c.id";die;
    $sql = "select * from accounts_appointment where doc_id_id = '".$doc_id."'";
    $recs_de = db_iquery($connection,$sql) or die(mysqli_error());
    if (mysqli_num_rows($recs_de) > 0) 
    { 
        while ($row = mysqli_fetch_object($recs_de)) 
        { 
            $patient_id = $row->patient_id_id;
            $sql1 = "select * from accounts_doctor where id = '".$doc_id."'";
            $recs_de1 = db_iquery($connection,$sql1) or die(mysqli_error());
            if (mysqli_num_rows($recs_de1) > 0) 
            { 
                while ($row1 = mysqli_fetch_object($recs_de1)) 
                {
                    $output1 = array($row1->id, $row1->first_name, $row1->hospital_id_id);
                }   
            } 
            else
            {
                $output1 = array("","","");
            }
            $sql2 = "select * from accounts_patient where id = '".$patient_id."'";
            $recs_de2 = db_iquery($connection,$sql2) or die(mysqli_error());
            if (mysqli_num_rows($recs_de2) > 0) 
            { 
                while ($row2 = mysqli_fetch_object($recs_de2)) 
                {
                    $output2 = array($row2->id, $row2->first_name, $row2->last_name,$row2->phone, $row2->email, $row2->age,$row2->gender, $row2->purpose);
                }   
            }   
            else
            {
                $output2 = array("","","","","","","","");
            } 
            $array = array("appoint_id"=>$row->id,"date"=>$row->date,"delay"=>$row->delay,"app_fromtime"=>$row->from_time,"reschdule_time"=>$row->reschdule_time,"app_totime"=>$row->to_time,"is_show"=>$row->is_show,"appis_completed"=>$row->is_completed,"feedback"=>$row->feedback,"doctor_id"=>$output1[0],"doctor_name"=>$output1[1],
            "hospital_id"=>$output1[2],"	id"=>$output2[0],
            "first_name"=>$output2[1],"last_name"=>$output2[2],"phone"=>$output2[3],"email"=>$output2[4],"age"=>$output2[5],"gender"=>$output2[6],"purpose"=>$output2[7]);
            $output[] = $array;
        }      
        $response['code'] = 1;
        $response['status'] = 200;
    
    }
    else if(mysqli_num_rows($recs_de) == 0)
    {
        $output = array();
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }   

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get custom appointment order by from time--------------//
function get_custom_appointment_fromtime()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    
    if (isset($_REQUEST['doc_id'])) 
    {
        $doc_id = $_REQUEST['doc_id'];
    } 
    else $doc_id = "";
    // echo "select a.id as appoint_id, a.date, a.delay,a.from_time as app_fromtime,a.to_time as app_totime, a.is_completed as appis_completed, b.id as doctor_id,b.first_name as doctor_name,b.hospital_id_id  as hospital_id, c.* from accounts_appointment a, accounts_doctor b, accounts_patient c
    // where $doc_id = b.id and a.patient_id_id = c.id";die;
    $sql = "select * from accounts_appointment where doc_id_id = '".$doc_id."' order by from_time asc";
    $recs_de = db_iquery($connection,$sql) or die(mysqli_error());
    if (mysqli_num_rows($recs_de) > 0) 
    { 
        while ($row = mysqli_fetch_object($recs_de)) 
        { 
            $patient_id = $row->patient_id_id;
            $sql1 = "select * from accounts_doctor where id = '".$doc_id."'";
            $recs_de1 = db_iquery($connection,$sql1) or die(mysqli_error());
            if (mysqli_num_rows($recs_de1) > 0) 
            { 
                while ($row1 = mysqli_fetch_object($recs_de1)) 
                {
                    $output1 = array($row1->id, $row1->first_name, $row1->hospital_id_id);
                }   
            } 
            else
            {
                $output1 = array("","","");
            }
            $sql2 = "select * from accounts_patient where id = '".$patient_id."'";
            $recs_de2 = db_iquery($connection,$sql2) or die(mysqli_error());
            if (mysqli_num_rows($recs_de2) > 0) 
            { 
                while ($row2 = mysqli_fetch_object($recs_de2)) 
                {
                    $output2 = array($row2->id, $row2->first_name, $row2->last_name,$row2->phone, $row2->email, $row2->age,$row2->gender, $row2->purpose);
                }   
            }   
            else
            {
                $output2 = array("","","","","","","","");
            } 
            $array = array("appoint_id"=>$row->id,"date"=>$row->date,"delay"=>$row->delay,"app_fromtime"=>$row->from_time,"reschdule_time"=>$row->reschdule_time,"app_totime"=>$row->to_time,"is_show"=>$row->is_show,"appis_completed"=>$row->is_completed,"feedback"=>$row->feedback,"doctor_id"=>$output1[0],"doctor_name"=>$output1[1],
            "hospital_id"=>$output1[2],"	id"=>$output2[0],
            "first_name"=>$output2[1],"last_name"=>$output2[2],"phone"=>$output2[3],"email"=>$output2[4],"age"=>$output2[5],"gender"=>$output2[6],"purpose"=>$output2[7]);
            $output[] = $array;
        }      
        $response['code'] = 1;
        $response['status'] = 200;
    
    }
    else if(mysqli_num_rows($recs_de) == 0)
    {
        $output = array();
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }   

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get custom appointment order by to time des--------------//
function get_custom_appointment_completetime()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    
    if (isset($_REQUEST['doc_id'])) 
    {
        $doc_id = $_REQUEST['doc_id'];
    } 
    else $doc_id = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";
    // echo "select a.id as appoint_id, a.date, a.delay,a.from_time as app_fromtime,a.to_time as app_totime, a.is_completed as appis_completed, b.id as doctor_id,b.first_name as doctor_name,b.hospital_id_id  as hospital_id, c.* from accounts_appointment a, accounts_doctor b, accounts_patient c
    // where $doc_id = b.id and a.patient_id_id = c.id";die;
    $sql = "select * from accounts_appointment where doc_id_id = '".$doc_id."' and date = '".$date."' order by to_time desc";
    $recs_de = db_iquery($connection,$sql) or die(mysqli_error());
    if (mysqli_num_rows($recs_de) > 0) 
    { 
        while ($row = mysqli_fetch_object($recs_de)) 
        { 
            $patient_id = $row->patient_id_id;
            $sql1 = "select * from accounts_doctor where id = '".$doc_id."'";
            $recs_de1 = db_iquery($connection,$sql1) or die(mysqli_error());
            if (mysqli_num_rows($recs_de1) > 0) 
            { 
                while ($row1 = mysqli_fetch_object($recs_de1)) 
                {
                    $output1 = array($row1->id, $row1->first_name, $row1->hospital_id_id);
                }   
            } 
            else
            {
                $output1 = array("","","");
            }
            $sql2 = "select * from accounts_patient where id = '".$patient_id."'";
            $recs_de2 = db_iquery($connection,$sql2) or die(mysqli_error());
            if (mysqli_num_rows($recs_de2) > 0) 
            { 
                while ($row2 = mysqli_fetch_object($recs_de2)) 
                {
                    $output2 = array($row2->id, $row2->first_name, $row2->last_name,$row2->phone, $row2->email, $row2->age,$row2->gender, $row2->purpose);
                }   
            }   
            else
            {
                $output2 = array("","","","","","","","");
            } 
            $array = array("appoint_id"=>$row->id,"date"=>$row->date,"delay"=>$row->delay,"app_fromtime"=>$row->from_time,"reschdule_time"=>$row->reschdule_time,"app_totime"=>$row->to_time,"is_show"=>$row->is_show,"appis_completed"=>$row->is_completed,"feedback"=>$row->feedback,"doctor_id"=>$output1[0],"doctor_name"=>$output1[1],
            "hospital_id"=>$output1[2],"	id"=>$output2[0],
            "first_name"=>$output2[1],"last_name"=>$output2[2],"phone"=>$output2[3],"email"=>$output2[4],"age"=>$output2[5],"gender"=>$output2[6],"purpose"=>$output2[7]);
            $output[] = $array;
        }      
        $response['code'] = 1;
        $response['status'] = 200;
    
    }
    else if(mysqli_num_rows($recs_de) == 0)
    {
        $output = array();
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }   

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get custom appointment By Date--------------//
function get_custom_appointment_by_date()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['doc_id'])) 
    {
        $doc_id = $_REQUEST['doc_id'];
    } 
    else $doc_id = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";

    $sql = "select * from accounts_appointment where doc_id_id = '".$doc_id."' and date in($date) order by from_time asc";
    $recs_de = db_iquery($connection,$sql) or die(mysqli_error());
    if (mysqli_num_rows($recs_de) > 0) 
    { 
        while ($row = mysqli_fetch_object($recs_de)) 
        { 
            $patient_id = $row->patient_id_id;
            $sql1 = "select * from accounts_doctor where id = '".$doc_id."'";
            $recs_de1 = db_iquery($connection,$sql1) or die(mysqli_error());
            if (mysqli_num_rows($recs_de1) > 0) 
            { 
                while ($row1 = mysqli_fetch_object($recs_de1)) 
                {
                    $output1 = array($row1->id, $row1->first_name, $row1->hospital_id_id);
                }   
            } 
            else
            {
                $output1 = array("","","");
            }
            $sql2 = "select * from accounts_patient where id = '".$patient_id."'";
            $recs_de2 = db_iquery($connection,$sql2) or die(mysqli_error());
            if (mysqli_num_rows($recs_de2) > 0) 
            { 
                while ($row2 = mysqli_fetch_object($recs_de2)) 
                {
                    $output2 = array($row2->id, $row2->first_name, $row2->last_name,$row2->phone, $row2->email, $row2->age,$row2->gender, $row2->purpose);
                }   
            }   
            else
            {
                $output2 = array("","","","","","","","");
            } 
            $array = array("appoint_id"=>$row->id,"date"=>$row->date,"delay"=>$row->delay,"app_fromtime"=>$row->from_time,"app_todtime"=>$row->tod_time,"reschdule_time"=>$row->reschdule_time,"app_totime"=>$row->to_time,"is_show"=>$row->is_show,"appis_completed"=>$row->is_completed,"doctor_id"=>$output1[0],"doctor_name"=>$output1[1],
            "hospital_id"=>$output1[2],"id"=>$output2[0],
            "first_name"=>$output2[1],"last_name"=>$output2[2],"phone"=>$output2[3],"email"=>$output2[4],"age"=>$output2[5],"gender"=>$output2[6],"purpose"=>$output2[7]);
            $output[] = $array;
        }      
        $response['code'] = 1;
        $response['status'] = 200;
    
    }
    elseif(mysqli_num_rows($recs_de) == 0)
    {
        $output = [];
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }     

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Import file --------------//
function import_file()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_FILES['file']['name'])) 
    {
        // move_uploaded_file($_FILES['file']['tmp_name'],'./csv/'. $_FILES['file']['name']);
        $to_unlink = "csv/trackkerimport.csv";
        $file_val = file("https://trackappt.desss-portfolio.com/dynamic/csv/trackkerimport.csv");
        $counts = count($file_val);
        if(!empty($file_val))
        { 
	        $sd = 1;
	        $ins_values = "";
	        foreach($file_val as $files)
	        {
		        if($sd == 1)
		        {
		        	$remove_one = str_replace('"',"'",$files);
		        	$ins_values = explode(",",$remove_one);
		        }
		        else
		        {
			        $remove_one = str_replace("'","",$files);
			        $remove_two = str_replace('"',"'",$remove_one);
			        $remove_two = str_replace('"',"'",$remove_one);
					$remove_two1 = rtrim($remove_two);
			        $ins_values = explode(",",$remove_two1);
			        $ins_values_two = array_values($ins_values);
			        $ins_values_three = implode(",",$ins_values_two);
                    $t = str_replace(",","','",$ins_values_three);
			        if($sd < $counts)
			        	{
			        		$comm = ",";		
			        	}
			        else{ $comm = ""; }
                    $dot = "'";
			        $b .='('.$dot.$t.$dot.')'.$comm.'';
		        }
	            $sd++;
	        }
            $qry = "INSERT INTO `test_import`(`name`,`age`,`gender`) values ".$b."";
            $recs_role = db_iquery($connection, $qry) or die(mysqli_error());
            $samedata=mysqli_insert_id($connection);
            if ($samedata > 0) 
            {
                $output[] = array("msg" => 'Successfully Imported');
                $response['code'] = 1;
                $response['status'] = 200;
            } 
            unlink($to_unlink);
        }
        else
        {
            $output[] = array("errmsg" => 'There is no file');
            $response['status'] = 400;
        }
    } 
    else
    {
        $output[] = array("errmsg" => 'Please give file');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}  

//--------------- Sms concept --------------//
function today_twilio_sms()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $date = date("m-d-Y");

    // $account_sid = '';
    // $auth_token = '';
    // $twilio_number = "+17752579977";
    $account_sid = TWILIO_ACCOUNT_SID;
    $auth_token = TWILIO_AUTH_TOKEN;
    $twilio_number = "+12818843247";

    $recs_role = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."'") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $outputs[] = $row->patient_id_id;
        }
        $patient_id = implode(",",$outputs);
        $recs_role1 = db_iquery($connection, "SELECT * FROM  accounts_patient WHERE id IN (".$patient_id.")") or die(mysqli_error());
        if(mysqli_num_rows($recs_role1) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role1)) 
            {
                $output1[] = $row;
            }
        } 
        foreach($output1 as $output2)
        {
            $recs_role12 = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE patient_id_id = '".$output2->id."'") or die(mysqli_error());
            if(mysqli_num_rows($recs_role12) > 0)
            {            
                while ($row12 = mysqli_fetch_object($recs_role12)) 
                {
                    $output1p[] = $row12;
                }
            }
            $name  = 'Hi '.$output2->first_name.' '.$output2->last_name.',<br> Your appointment today '.$output1p[0]->date.' at '.$output1p[0]->from_time.'<br>Please come before 15 minutes. We look forward to seeing you.';
            $tonumber = $output2->phone;
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $tonumber,
                array(
                    'from' => $twilio_number,
                    'body' => $name
                )
            );
        }
        
        $output[] = array("msg" => 'Sent message successfully');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'No patient available today');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 


//--------------- Import file for two tables --------------//
function import_file_patient()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $issues_times = [];
    $all_time = [];
    if (isset($_FILES['file']['name'])) 
    {
        // Allowed mime types
        $excelMimes = array('text/xls', 'text/xlsx', 'application/excel', 'application/vnd.msexcel', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // $csvMimes = array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', 'text/plain');
        // Validate whether selected file is a CSV file
        if(!empty($_FILES['file']['name']) && in_array($_FILES['file']['type'], $excelMimes))
        {
            // If the file is uploaded
            if(is_uploaded_file($_FILES['file']['tmp_name']))
            {
                $reader = new Xlsx(); 
                $spreadsheet = $reader->load($_FILES['file']['tmp_name']); 
                $worksheet = $spreadsheet->getActiveSheet();  
                $worksheet_arr = $worksheet->toArray(); 
                $worksheet_arr1 = $worksheet->toArray(); 
                // Open uploaded CSV file with read-only mode
                // $csvFile = fopen($_FILES['file']['tmp_name'], 'r');
                // $csvFile1 = fopen($_FILES['file']['tmp_name'], 'r');
                // Skip the first line
                // fgetcsv($csvFile);
                // fgetcsv($csvFile1);
                unset($worksheet_arr[0]);
                unset($worksheet_arr1[0]);
                // print_r($worksheet_arr1);die;
                /** For Find intervaltime error and lunchtime error */
                // while(($line = fgetcsv($worksheet_arr)) !== FALSE)
                foreach($worksheet_arr as $line)
                {  
                    if(!empty($line[0])):
                        // Get row data
                        $first_name   = $line[0];
                        $last_name  = $line[1];
                        $phone  = "+".$line[2].$line[3];
                        $email = $line[4];
                        $age   = "";
                        $gender  = "";
                        $purpose  = "";
                        $str_replace_date = array("/",".");
                        $date = str_replace($str_replace_date,"-",$line[5]);
                        $from_time = $line[6];
                        $doctor_id = $line[7];
                        $to_time = "";
                        $is_completed = 0;
                        /** validation for date and time */
                        // if (str_contains($line[5], '/')) 
                        if (strpos($line[5], '/') !== false)
                        {
                            $output[] = array("errmsg" => 'Please check date format');
                            $response['status'] = 400;
                            $response['data'] = $output;
                            sendResponse($response['status'], json_encode($response), $contenttype);
                            die;
                        }
                        // elseif(str_contains($line[5], '.'))
                        if (strpos($line[5], '.') !== false) 
                        {
                            $output[] = array("errmsg" => 'Please check date format');
                            $response['status'] = 400;
                            $response['data'] = $output;
                            sendResponse($response['status'], json_encode($response), $contenttype);
                            die;
                        }
                        if (strpos($line[5], '-') !== false) 
                        {
                            $explode_1 = explode("-",$line[5]);
                            $find_exp_count = count($explode_1);
                            if(strlen($explode_1[0])<2):
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            endif;
                            if(strlen($explode_1[1])<2):
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            endif;    
                            if(strlen($explode_1[2])<4):
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;    
                            endif;

                        }
                        // elseif(str_contains($line[6], 'AM'))
                        if (strpos($line[6], 'AM') !== false) 
                        {
                            $output[] = array("errmsg" => 'Please check time format');
                            $response['status'] = 400;
                            $response['data'] = $output;
                            sendResponse($response['status'], json_encode($response), $contenttype);
                            die;
                        }
                        // elseif(str_contains($line[6], 'PM'))
                        if (strpos($line[6], 'PM') !== false) 
                        {
                            $output[] = array("errmsg" => 'Please check time format');
                            $response['status'] = 400;
                            $response['data'] = $output;
                            sendResponse($response['status'], json_encode($response), $contenttype);
                            die;
                        }
                        if (strpos($line[6], '.') !== false)
                        {
                            $output[] = array("errmsg" => 'Please check time format');
                            $response['status'] = 400;
                            $response['data'] = $output;
                            sendResponse($response['status'], json_encode($response), $contenttype);
                            die;
                        }
                        /** End validation for date and time */
                        //Cusotm converting
                        $explode_date = explode("-",$date);
                        $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                        $recs_role = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
                        if(mysqli_num_rows($recs_role) > 0)
                        { 
                            while ($row = mysqli_fetch_object($recs_role)) 
                            {
                                $output12[] = $row;
                            }
                        $addtime1 = $output12[0]->consult_time;
                        $delay = $addtime1;
                        $in = strtotime($addtime1)-strtotime("00:00:00");
                        $adding_time = date("H:i:s",strtotime($output12[0]->intervel)+$in);
                        $array_time_slot = custom_interval_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                        }   
                        else
                        {
                            $delay = "00:15:00";
                            $adding_time = "00:00:00";
                        } 
                        $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                        if(mysqli_num_rows($check_time) == 0)
                        {
                            $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                            if(mysqli_num_rows($check_time_reschedule) == 0):
                                $all_time[] = $from_time; 
                                if(in_array($from_time,$array_time_slot)):
                                else:
                                    $issues_times[] =  $from_time; 
                                endif;    
                            endif;    
                        }   
                    endif;
                }
                // if(count($all_time)>1)
                // {  
                //     $start_t = new DateTime($all_time[1]);
                //     $current_t = new DateTime($all_time[0]);
                //     $difference = $start_t->diff($current_t);
                //     $return_time_custome = $difference->format('%H:%I:%S');
                //     if($return_time_custome != $adding_time)
                //     {
                //         $response['code'] = 0;
                //         $output[] = array("msg" => 'Check time interval');
                //         $response['status'] = 400;
                //         $response['data'] = $output;
                //         sendResponse($response['status'], json_encode($response), $contenttype);
                //         die;
                //     }
                // }    
                if(!empty($issues_times)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Check lunch time',"lunch_time_issues"=>$issues_times);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                else:
                    // Parse data from CSV file line by line
                    // while(($line = fgetcsv($worksheet_arr1)) !== FALSE)
                    foreach($worksheet_arr1 as $line)
                    {  
                        if(!empty($line[0])):
                            // Get row data
                            $first_name   = $line[0];
                            $last_name  = $line[1];
                            $phone  = "+".$line[2].$line[3];
                            $email = $line[4];
                            $age   = "";
                            $gender  = "";
                            $purpose  = "";
                            $str_replace_date = array("/",".");
                            $date = str_replace($str_replace_date,"-",$line[5]);
                            $from_time = $line[6];
                            $doctor_id = $line[7];
                            $to_time = "";
                            $is_completed = 0;
                            /** validation for date and time */
                            // if (str_contains($line[5], '/')) 
                            if (strpos($line[5], '/') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            // elseif(str_contains($line[5], '.'))
                            if (strpos($line[5], '.') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '-') !== false) 
                            {
                                $explode_1 = explode("-",$line[5]);
                                $find_exp_count = count($explode_1);
                                if(strlen($explode_1[0])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;
                                if(strlen($explode_1[1])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;    
                                if(strlen($explode_1[2])<4):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;    
                                endif;

                            }
                            // elseif(str_contains($line[6], 'AM'))
                            if (strpos($line[6], 'AM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            // elseif(str_contains($line[6], 'PM'))
                            if (strpos($line[6], 'PM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], '.') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            /** End validation for date and time */
                            //Cusotm converting
                            $explode_date = explode("-",$date);
                            $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                            $recs_role = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
                            if(mysqli_num_rows($recs_role) > 0)
                            { 
                                while ($row = mysqli_fetch_object($recs_role)) 
                                {
                                    $output12[] = $row;
                                }
                            $addtime1 = $output12[0]->consult_time;
                            $delay = $addtime1;
                            $array_time_slot = custom_interval_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                            }   
                            else
                            {
                                $delay = "00:15:00";
                            } 
                            $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                            if(mysqli_num_rows($check_time) == 0)
                            {
                                $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                                if(mysqli_num_rows($check_time_reschedule) == 0):
                                    if(in_array($from_time,$array_time_slot)):
                                        $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
                                        $samedata=mysqli_insert_id($connection);
                                        $recs_role_appoitnment = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."' and from_time='".$from_time."'and doc_id_id='".$doctor_id."'") or die(mysqli_error());
                                        if(mysqli_num_rows($recs_role_appoitnment) > 0)
                                        { 
                                        }   
                                        else
                                        {
                                            $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`) values ('".$date."','".$from_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."')") or die(mysqli_error());  // die ("invalid query");
                                        } 
                                    else:
                                        $issues_times[] =  $from_time; 
                                    endif;    
                                endif;    
                            }   
                        endif;
                    }
                    // Close opened CSV file
                    // fclose($csvFile);
                    $response['code'] = 1;
                    $output[] = array("msg" => 'Successfully Imported',"lunch_time_issues"=>$issues_times);
                    $response['status'] = 200;
                endif;    
            }
        }
    } 
    else
    {
        $output[] = array("errmsg" => 'Please give file');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}  


//--------------- create data --------------//

function test_create()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $keys[] = $x;
        $values[] = $x_value;
    }
    $key_length = count($keys);
    $value_length = count($values);
    for($i=2;$i<$key_length;$i++)
    {
        $fieldsname[] = $keys[$i];
    }
    for($i=2;$i<$key_length;$i++)
    {
        $fieldsvalues[] = '"'.$values[$i].'"';
    }
    $field_namestring = implode(",",$fieldsname);
    $field_valuestring = implode(",",$fieldsvalues);
    $table = $values[1];

    $recs_role = db_iquery($connection, "insert into $table($field_namestring) values ($field_valuestring)") or die(mysqli_error());
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM $table WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Get data ----------------//
function test_read()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $keys[] = $x;
        $values[] = $x_value;
    }
    $key_length = count($keys);
    $value_length = count($values);
    $table = $values[1];
    if($key_length == 2)
    {
        $recs_role = db_iquery($connection, "SELECT * FROM  $table") or die(mysqli_error());
    }
    else if($key_length == 3)
    {
        $where1 = $keys[2];
        $where1value = $values[2];
        $recs_role = db_iquery($connection, "SELECT * FROM  $table where $where1='".$where1value."'") or die(mysqli_error());
    }
    else if($key_length == 4)
    {
        $where1 = $keys[2];
        $where1value = $values[2];
        $where2 = $keys[3];
        $where2value = $values[3];
        $recs_role = db_iquery($connection, "SELECT * FROM  $table where $where1='".$where1value."' and $where2='".$where2value."'") or die(mysqli_error());
    }
    else if($key_length == 5)
    {
        $where1 = $keys[2];
        $where1value = $values[2];
        $where2 = $keys[3];
        $where2value = $values[3];
        $where3 = $keys[4];
        $where3value = $values[4];
        $recs_role = db_iquery($connection, "SELECT * FROM  $table where $where1='".$where1value."' and $where2='".$where2value."' and $where3='".$where3value."'") or die(mysqli_error());
    }
    else
    {
        echo "sorry";die;
    }
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $output[] = $row;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else if(mysqli_num_rows($recs_role) == 0)
    {
        $output = array();
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Update data --------------//
function test_update()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $key[] = $x;
        $value[] = "{$x} = '{$x_value}'";
        $values[] = $x_value;
    }
    $key_length = count($key);
    $value_length = count($values);
    for($i=3;$i<count($key);$i++)
    {
        $quote = '"';
        $a[] = $key[$i].'='.$quote.$values[$i].$quote;
    }
    $tableupdate = implode(", ",$a);
    $table = $values[1];
    $where = $key[2];
    $wherevalue = $values[2];

    $recs_role = db_iquery($connection, "update $table set $tableupdate where $where='".$wherevalue."'") or die(mysqli_error());
    $recs_role = db_iquery($connection, "SELECT * FROM $table WHERE $where='".$wherevalue."'") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $output[] = $row;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Delete data --------------//
function test_delete()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $keys[] = $x;
        $values[] = $x_value;
    }
    $key_length = count($keys);
    $value_length = count($values);
    $table = $values[1];
    $delete_value = $values[2];
    $where1 = $keys[2];
    $where1value = $values[2];
    if(!empty($delete_value))
    {
        $recs_role1 = db_iquery($connection, "delete from $table where $where1 = '".$where1value."'") or die(mysqli_error());
        $recs_role = db_iquery($connection, "SELECT * FROM $table WHERE $where1='".$where1value."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) == 0)
        {            
            $response['code'] = 1;
            $output[] = array("errmsg" => 'Deleted');
            $response['status'] = 200;
        }
        else 
        {
            $output[] = array("errmsg" => 'Invalid');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Please give value for id');
        $response['status'] = 404;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Get Multiple table----------------//
function test_multipleread()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $keys[] = $x;
        $values[] = $x_value;
    }
    $table1 = $values[1];
    $table2 = $values[3];
    $table1where = $values[2];
    $table2where = $values[4];
    $join = $values[5];
    $recs_role = db_iquery($connection, "SELECT $table1.*,$table2.* FROM  $table1 INNER JOIN $table2 ON $table1.id = $table2.id") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $output[] = $row;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else if(mysqli_num_rows($recs_role) == 0)
    {            
        $output = array();
        $response['status'] = 200;
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Delete multiple data --------------//
function test_multipledelete()
{ 
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $keys[] = $x;
        $values[] = $x_value;
    }
    $table1 = $values[1];
    $table2 = $values[3];
    $table1id = $values[2];
    $table2id = $values[4];
    // echo $table2id; echo $table1id;die;
    if(!empty($table1id) && !empty($table2id))
    {
        $recs_role1 = db_iquery($connection, "delete from $table1 where id = $table1id") or die(mysqli_error());
        $recs_role2 = db_iquery($connection, "delete from $table2 where id = $table2id") or die(mysqli_error());
        $recs_role_find1 = db_iquery($connection, "SELECT * FROM $table1 WHERE id='".$table1id."'") or die(mysqli_error());
        $recs_role_find2 = db_iquery($connection, "SELECT * FROM $table2 WHERE id='".$table2id."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role_find1) == 0 && mysqli_num_rows($recs_role_find2) == 0)
        {            
            $response['code'] = 1;
            $output[] = array("errmsg" => 'Deleted');
            $response['status'] = 200;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Please give value for id');
        $response['status'] = 404;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- create multiple data --------------//
function test_multiplecreate()
{ 
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $key[] = $x;
        $value[] = $x_value;
    }
    $count_key = count($key);
    $find_index  = array_search("table1",$key);
    $first_array_key = array_slice($key,0,$find_index+1);
    $second_array_key = array_slice($key,$find_index+1,$count_key);
    $first_array_value = array_slice($value,0,$find_index+1);
    $second_array_value = array_slice($value,$find_index+1,$count_key);
    //---- First table ------//
    for($i=1;$i<count($first_array_key)-1;$i++)
    {
        $fieldsnametable1[] = $first_array_key[$i];
    }
    for($i=1;$i<count($first_array_value)-1;$i++)
    {
        $fieldsvaluestable1[] = '"'.$first_array_value[$i].'"';
    }
    //---- Second table ------//
    for($i=0;$i<count($second_array_key)-1;$i++)
    {
        $fieldsnametable2[] = $second_array_key[$i];
    }
    for($i=0;$i<count($second_array_value)-1;$i++)
    {
        $fieldsvaluestable2[] = '"'.$second_array_value[$i].'"';
    }
    $table1field_namestring = implode(",",$fieldsnametable1);
    $table1field_valuestring = implode(",",$fieldsvaluestable1);
    $table2field_namestring = implode(",",$fieldsnametable2);
    $table2field_valuestring = implode(",",$fieldsvaluestable2);
    //----- Table names ------//
    $table_name1 = $first_array_value[count($first_array_value) - 1]; 
    $table_name2 = $second_array_value[count($second_array_value) - 1]; 
    
    $recs_role = db_iquery($connection, "insert into $table_name1($table1field_namestring) values ($table1field_valuestring)") or die(mysqli_error());
    $samedata1=mysqli_insert_id($connection);
    $recs_role = db_iquery($connection, "insert into $table_name2($table2field_namestring) values ($table2field_valuestring)") or die(mysqli_error());
    $samedata2=mysqli_insert_id($connection);
    if ($samedata1 > 0 && $samedata2 > 0 ) 
    {
        $recs_role1 = db_iquery($connection, "SELECT * FROM $table_name1 WHERE id='".$samedata1."'") or die(mysqli_error());
        $recs_role2 = db_iquery($connection, "SELECT * FROM $table_name2 WHERE id='".$samedata2."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role1) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role1)) 
            {
                $output[] = $row;
            }
        }
        if(mysqli_num_rows($recs_role2) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role2)) 
            {
                $output[] = $row;
            }
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- create multiple Update --------------//
function test_multipleupdate()
{ 
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    foreach ($_REQUEST as $x => $x_value) {
        $key[] = $x;
        $value[] = $x_value;
        $value1[] = $x_value;
    }
    array_pop($key);
    array_pop($key);
    array_pop($value);
    array_pop($value);
    $count_key = count($key);
    $find_index  = array_search("table1",$key);
    $first_array_key = array_slice($key,0,$find_index+1);
    $second_array_key = array_slice($key,$find_index+1,$count_key);
    $first_array_value = array_slice($value,0,$find_index+1);
    $second_array_value = array_slice($value,$find_index+1,$count_key);
    //---- First table ------//
    for($i=1;$i<count($first_array_key)-1;$i++)
    {
        $quote = '"';
        $a[] = $first_array_key[$i].'='.$quote.$first_array_value[$i].$quote;
    }
    $table1update = implode(", ",$a);
    //---- Second table ------//
    for($i=0;$i<count($second_array_key)-1;$i++)
    {
        $quote = '"';
        $b[] = $second_array_key[$i].'='.$quote.$second_array_value[$i].$quote;
    }
    $table2update = implode(", ",$b);
    //----- Table names ------//
    $table_name1 = $first_array_value[count($first_array_value) - 1]; 
    $table_name2 = $second_array_value[count($second_array_value) - 1]; 

    $total_length = count($value1);
    $where1 =  $value1[$total_length-2];
    $where2 =  $value1[$total_length-1];

    $recs_role1 = db_iquery($connection, "update $table_name1 set $table1update where id=$where1") or die(mysqli_error());
    $recs_role2 = db_iquery($connection, "update $table_name2 set $table2update where id=$where2") or die(mysqli_error());
    $rec1 = db_iquery($connection, "SELECT * FROM $table_name1 WHERE id=$where1") or die(mysqli_error());
    $rec2 = db_iquery($connection, "SELECT * FROM $table_name2 WHERE id=$where2") or die(mysqli_error());
    if(mysqli_num_rows($rec1) > 0 && mysqli_num_rows($rec2) > 0)
    {            
        while ($row1 = mysqli_fetch_object($rec1)) 
        {
            $output[] = $row1;
        }
        while ($row2 = mysqli_fetch_object($rec2)) 
        {
            $output[] = $row2;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);

}

//--------------- Get all appointment----------------//
function test_all_appointment()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $recs_role = db_iquery($connection, "SELECT accounts_appointment.id as appointmentid,accounts_appointment.date as appointmentdate,accounts_appointment.from_time as appointmentfromtime,accounts_appointment.to_time as appointmenttotime,accounts_appointment.is_completed as appointmentiscompleted,accounts_appointment.delay as appointmentdelay, 
    accounts_doctor.id as doctorid,accounts_doctor.first_name as doctorfirstname,accounts_doctor.last_name as doctorlastname,accounts_doctor.phone as doctorphone,accounts_doctor.gender as doctorgender,accounts_doctor.img as doctorimg,accounts_doctor.specility as doctorspecility,accounts_doctor.city as doctorscity,accounts_doctor.state as doctorstate,
    accounts_doctor.zipcode as doctorzipcode,accounts_doctor.from_time as doctorfrom_time,accounts_doctor.to_time as doctorto_time,accounts_doctor.intervel as doctorintervel,accounts_doctor.sms_intervel as doctorsms_intervel,accounts_doctor.from_time_break as doctorfrom_time_break,accounts_doctor.to_time_break as doctorto_time_break,accounts_doctor.experience as doctorexperience,
    accounts_doctor.licence as doctorlicence,accounts_doctor.joined_date as doctorjoined_date,accounts_doctor.hospital_id_id as doctorhospital_id_id,accounts_doctor.user_id  as doctoruser_id,
    accounts_patient.id as patientid,accounts_patient.first_name as patientfirst_name,accounts_patient.last_name as patientlast_name,accounts_patient.phone as patientphone,accounts_patient.email as patientemail,accounts_patient.age as patientage,accounts_patient.gender as patientgender,accounts_patient.purpose as patientpurpose         
    FROM  accounts_appointment INNER JOIN accounts_doctor ON accounts_appointment.doc_id_id = accounts_doctor.id INNER JOIN accounts_patient ON accounts_appointment.patient_id_id = accounts_patient.id and accounts_appointment.is_completed = 0") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $output[] = $row;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else if(mysqli_num_rows($recs_role) == 0)
    {            
        $output = array();
        $response['status'] = 200;
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Get all appointment----------------//
function test_completd_all_appointment()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    // $recs_role = db_iquery($connection, "SELECT accounts_appointment.*,accounts_doctor.*,accounts_patient.* FROM  accounts_appointment INNER JOIN accounts_doctor ON accounts_appointment.doc_id_id = accounts_doctor.id INNER JOIN accounts_patient ON accounts_appointment.patient_id_id = accounts_patient.id where accounts_appointment.is_completed = 1") or die(mysqli_error());
    $recs_role = db_iquery($connection, "SELECT accounts_appointment.id as appointmentid,accounts_appointment.date as appointmentdate,accounts_appointment.from_time as appointmentfromtime,accounts_appointment.to_time as appointmenttotime,accounts_appointment.is_completed as appointmentiscompleted,accounts_appointment.delay as appointmentdelay, 
    accounts_doctor.id as doctorid,accounts_doctor.first_name as doctorfirstname,accounts_doctor.last_name as doctorlastname,accounts_doctor.phone as doctorphone,accounts_doctor.gender as doctorgender,accounts_doctor.img as doctorimg,accounts_doctor.specility as doctorspecility,accounts_doctor.city as doctorscity,accounts_doctor.state as doctorstate,
    accounts_doctor.zipcode as doctorzipcode,accounts_doctor.from_time as doctorfrom_time,accounts_doctor.to_time as doctorto_time,accounts_doctor.intervel as doctorintervel,accounts_doctor.sms_intervel as doctorsms_intervel,accounts_doctor.from_time_break as doctorfrom_time_break,accounts_doctor.to_time_break as doctorto_time_break,accounts_doctor.experience as doctorexperience,
    accounts_doctor.licence as doctorlicence,accounts_doctor.joined_date as doctorjoined_date,accounts_doctor.hospital_id_id as doctorhospital_id_id,accounts_doctor.user_id  as doctoruser_id,
    accounts_patient.id as patientid,accounts_patient.first_name as patientfirst_name,accounts_patient.last_name as patientlast_name,accounts_patient.phone as patientphone,accounts_patient.email as patientemail,accounts_patient.age as patientage,accounts_patient.gender as patientgender,accounts_patient.purpose as patientpurpose         
    FROM  accounts_appointment INNER JOIN accounts_doctor ON accounts_appointment.doc_id_id = accounts_doctor.id INNER JOIN accounts_patient ON accounts_appointment.patient_id_id = accounts_patient.id and accounts_appointment.is_completed = 1") or die(mysqli_error());
    if(mysqli_num_rows($recs_role) > 0)
    {            
        while ($row = mysqli_fetch_object($recs_role)) 
        {
            $output[] = $row;
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else if(mysqli_num_rows($recs_role) == 0)
    {            
        $output = array();
        $response['status'] = 200;
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- add to cart --------------//
function add_to_cart()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_REQUEST['user'])) 
    {
        $user = $_REQUEST['user'];
    } 
    else $user = "";
    if (isset($_REQUEST['unique_pipe_number'])) 
    {
        $unique_pipe_number = $_REQUEST['unique_pipe_number'];
    } 
    else $unique_pipe_number = "";
    if (isset($_REQUEST['heat_number'])) 
    {
        $heat_number = $_REQUEST['heat_number'];
    } 
    else $heat_number = "";
    if (isset($_REQUEST['over_all_length'])) 
    {
        $over_all_length = $_REQUEST['over_all_length'];
    } 
    else $over_all_length = "";
    if (isset($_REQUEST['od'])) 
    {
        $od = $_REQUEST['od'];
    } 
    else $od = "";
    if (isset($_REQUEST['weight_ppf'])) 
    {
        $weight_ppf = $_REQUEST['weight_ppf'];
    } 
    else $weight_ppf = "";
    if (isset($_REQUEST['wall_thickness'])) 
    {
        $wall_thickness = $_REQUEST['wall_thickness'];
    } 
    else $wall_thickness = "";
    if (isset($_REQUEST['grade'])) 
    {
        $grade = $_REQUEST['grade'];
    } 
    else $grade = "";
    if (isset($_REQUEST['connection'])) 
    {
        $connection1  = $_REQUEST['connection'];
    } 
    else $connection1  = "";
    if (isset($_REQUEST['drift_diameter'])) 
    {
        $drift_diameter  = $_REQUEST['drift_diameter'];
    } 
    else $drift_diameter  = "";
    if (isset($_REQUEST['mill'])) 
    {
        $mill  = $_REQUEST['mill'];
    } 
    else $mill  = "";
    if (isset($_REQUEST['type'])) 
    {
        $type  = $_REQUEST['type'];
    } 
    else $type  = "";
    if (isset($_REQUEST['weight'])) 
    {
        $weight  = $_REQUEST['weight'];
    } 
    else $weight  = "";
    if (isset($_REQUEST['tally_name'])) 
    {
        $tally_name  = $_REQUEST['tally_name'];
    } 
    else $tally_name  = "";
    $recs_role3 = db_iquery($connection, "insert into pipe_mylist (`user`,`unique_pipe_number`,`heat_number`,`over_all_length`,`od`,`weight_ppf`,`wall_thickness`,`grade`,`connection`,`drift_diameter`,`mill`,`type`,`weight`,`tally_name`) values ('".$user."','".$unique_pipe_number."','".$heat_number."','".$over_all_length."','".$od."','".$weight_ppf."','".$wall_thickness."','".$grade."','".$$connection1."','".$drift_diameter."','".$mill."','".$type."','".$weight."','".$tally_name."')") or die(mysqli_error());  // die ("invalid query");
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM pipe_mylist WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $response['code'] = 1;
        $response['status'] = 200;
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Get Product based on tally id--------------//
function custom_pipe_product()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    $sqls = "select * from pipe_tallies_header where id = '".$id."'";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    {  
        while ($row21 = mysqli_fetch_object($recs_des)) 
        { 
            $find_tally_name = $row21->Tally_name;
        }     
        $sqls1 = "select * from pipe_products where Tally_name = '".$find_tally_name."'";
        $recs_des1 = db_iquery($connection,$sqls1) or die(mysqli_error());
        if (mysqli_num_rows($recs_des1) > 0) 
        { 
            while ($row22 = mysqli_fetch_object($recs_des1)) 
            {
                $output[] = $row22;
                $response['code'] = 1;
                $response['status'] = 200;
            }   
        }    
        else
        {
            $output[] = array("errmsg" => 'Invalid');
            $response['status'] = 403;
        }
    }
    else
    {
        $output[] = array("errmsg" => 'No Tallies found');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Register custom_doctor for mobileteam--------------//
function register_doctor()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    // $password = uniqid();
    if (isset($_POST['password'])) 
    {
        $password = $_POST['password'];
    } 
    else $password = "";
    if (isset($_POST['name'])) 
    {
        $name = $_POST['name'];
    } 
    else $name = "";
    if (isset($_POST['phone'])) 
    {
        $phone = "+".$_POST['phone'];
    } 
    else $phone = "";
    if (isset($_POST['email'])) 
    {
        $email = $_POST['email'];
    } 
    else $email = "";
    if (isset($_POST['specility'])) 
    {
        $specility = $_POST['specility'];
    } 
    else $specility = "";
    if (isset($_POST['patient_interval'])) 
    {
        $patient_interval = $_POST['patient_interval'];
    } 
    else $patient_interval = "";
    if (isset($_POST['sms_intercal'])) 
    {
        $sms_intercal = $_POST['sms_intercal'];
    } 
    else $sms_intercal = "";
    if (isset($_POST['lunch_from'])) 
    {
        $lunch_from = $_POST['lunch_from'];
    } 
    else $lunch_from = "";
    if (isset($_POST['lunch_to'])) 
    {
        $lunch_to = $_POST['lunch_to'];
    } 
    else $lunch_to = "";
    if (isset($_POST['gender'])) 
    {
        $gender  = $_POST['gender'];
    } 
    else $gender  = "";
    if (isset($_POST['hospital_id'])) 
    {
        $hospital_id  = $_POST['hospital_id'];
    } 
    else $hospital_id  = "";
    if (isset($_POST['hospital_name'])) 
    {
        $hospital_name  = $_POST['hospital_name'];
    } 
    else $hospital_name  = "";
    if (isset($_POST['hostpital_email'])) 
    {
        $hostpital_email  = $_POST['hostpital_email'];
    } 
    else $hostpital_email  = "";
    if (isset($_POST['time_zone'])) 
    {
        $time_zone  = $_POST['time_zone'];
    } 
    else $time_zone  = "";

    if (isset($_POST['sms_count'])) 
    {
        $sms_count  = $_POST['sms_count'];
    } 
    else $sms_count  = "";
    if (isset($_POST['consult_time'])) 
    {
        $consult_time  = $$_POST['consult_time'];
    } 
    else $consult_time  = "";
    // echo  "insert into accounts_doctor (`first_name`,`phone`,`specility`,`intervel`,`sms_intervel`,`from_time_break`,`to_time_break`,`gender`,`hospital_id_id`,`user_id`) values ('".$name."','".$phone."','".$specility."','".$patient_interval."','".$sms_intercal."','".$lunch_from."','".$lunch_to."','".$gender."','".$hospital_id."','".$samedata1."')";die;
    $encode_email = base64_encode($email);
    $recs_role3 = db_iquery($connection, "insert into accounts_user (`password`,`is_superuser`,`email`,`is_staff`,`is_active`,`is_doctor`) values ('".$password."','0','".$email."','0','0','1')") or die(mysqli_error());  // die ("invalid query");
    $samedata1=mysqli_insert_id($connection);
    $recs_role1 = db_iquery($connection, "insert into accounts_doctor (`first_name`,`phone`,`specility`,`consult_time`,`intervel`,`sms_intervel`,`sms_count`,`from_time_break`,`to_time_break`,`gender`,`hospital_id_id`,`user_id`,`time_zone`) values ('".$name."','".$phone."','".$specility."','".$consult_time."','".$patient_interval."','".$sms_intercal."','".$sms_count."','".$lunch_from."','".$lunch_to."','".$gender."','".$hospital_id."','".$samedata1."','".$time_zone."')") or die(mysqli_error());  // die ("invalid query");
    $samedata=mysqli_insert_id($connection);
    if ($samedata > 0) 
    {
        $recs_role = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE id='".$samedata."'") or die(mysqli_error());
        if(mysqli_num_rows($recs_role) > 0)
        {            
            while ($row = mysqli_fetch_object($recs_role)) 
            {
                $output[] = $row;
            }
        }
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                /** For hostpital acknoldegement */
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send = "Please give approval for below doctor"; 
                $send .= "<br></br>Name: $name"; 
                $send .= "<br>Email: $email"; 
                $headers      =  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($hostpital_email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "New Doctor"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';

                /** For register person */
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send = "Thanks for Registering with Realtime Appointment, Please wait for the Hospital Approval to Login"; 
                $send .= "<br></br>Hospital: $hospital_name"; 
                $send .= "<br>Email: $email"; 
                $send .= "<br>Password: $password"; 
                $headers      =  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;          
                $mail->Port     = $outputmail[0]->port;              
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email;       
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com'); 
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);                                
                $mail->Subject  =  "Doctor Login Details"; 
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Check is_user ----------------//

function test_check_is_user()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_REQUEST['email'])) {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    
    if (isset($_REQUEST['phone'])) {
        $phone = "+".ltrim($_REQUEST['phone']);
    } else $phone = "";
    $recs_check = db_iquery($connection, "SELECT * FROM accounts_user WHERE email='".$email."' and is_deleted=0") or die(mysqli_error());
    $recs_check1 = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE phone='".$phone."' and is_deleted=0") or die(mysqli_error());
    // $recs_check3 = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE email='".$email."' and phone='".$phone."'") or die(mysqli_error());
    if (mysqli_num_rows($recs_check) > 0 && mysqli_num_rows($recs_check1) > 0) 
    {
        $output[] = array("msg" => 'Email and Phone Exist');
        $response['status'] = 400;
    } 
    else if (mysqli_num_rows($recs_check) > 0)
    {
        $output[] = array("msg" => 'Email Exist');
        $response['status'] = 400;
    } 
    elseif (mysqli_num_rows($recs_check1) > 0) 
    {
        $output[] = array("msg" => 'Phone Exist');
        $response['status'] = 400;
    }
    else 
    {
        $output[] = array("msg" => 'You can go ahead');
        $response['status'] = 200;
        $response['code'] = 1;
    }   
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Check is_hospital_doctor ----------------//
function check_is_hospital_doctor()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_REQUEST['user_name'])) {
        $user_name = $_REQUEST['user_name'];
    } 
    else $user_name = "";
    if (isset($_REQUEST['based_on'])) {
        $based_on = $_REQUEST['based_on'];
    } else $based_on = "";
    // if($based_on == "doctor")
    // {
    //     $recs_check = db_iquery($connection, "SELECT * FROM accounts_user WHERE user_name='".$user_name."' and is_superuser=0 and is_staff=0 and is_active=1 and is_doctor=1 and is_deleted=0") or die(mysqli_error());
    //     if (mysqli_num_rows($recs_check) > 0)
    //     {
    //         $output[] = array("msg" => 'Username already Exist');
    //         $response['status'] = 400;
    //     } 
    //     else 
    //     {
    //         $output[] = array("msg" => 'You can go ahead');
    //         $response['status'] = 200;
    //         $response['code'] = 1;
    //     }   
    // }
    // else if($based_on == "hospital")
    // {
    //     $recs_check = db_iquery($connection, "SELECT * FROM accounts_user WHERE user_name='".$user_name."' and is_superuser=0 and is_staff=0 and is_active=1 and is_doctor=0 and is_deleted=0") or die(mysqli_error());
    //     if (mysqli_num_rows($recs_check) > 0)
    //     {
    //         $output[] = array("msg" => 'Username already Exist');
    //         $response['status'] = 400;
    //     } 
    //     else 
    //     {
    //         $output[] = array("msg" => 'You can go ahead');
    //         $response['status'] = 200;
    //         $response['code'] = 1;
    //     }   
    // }
    // else
    // {
    //     $output[] = array("msg" => 'Sorry');
    //     $response['status'] = 400;
    // }
    $recs_check = db_iquery($connection, "SELECT * FROM accounts_user WHERE user_name='".$user_name."' and is_deleted=0") or die(mysqli_error());
    if (mysqli_num_rows($recs_check) > 0)
    {
        $output[] = array("msg" => 'Username already Exist');
        $response['status'] = 400;
    } 
    else 
    {
        $output[] = array("msg" => 'You can go ahead');
        $response['status'] = 200;
        $response['code'] = 1;
    }  
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- create multiple Update --------------//
function custom_update_user_doctor()
{ 
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_REQUEST['hospital_id_id'])) 
    {
        $hospital_id_id = $_REQUEST['hospital_id_id'];
    } 
    else $hospital_id_id = "";
    if (isset($_REQUEST['user_id'])) 
    {
        $user_id = $_REQUEST['user_id'];
    } 
    else $user_id = "";
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id = $_REQUEST['doctor_id'];
    } 
    else $doctor_id = "";
    $recs_role1 = db_iquery($connection, "update accounts_doctor set is_active = 1,hospital_id_id = '".$hospital_id_id."' where id='".$doctor_id."'") or die(mysqli_error());
    $recs_role2 = db_iquery($connection, "update accounts_user set is_active = 1 where id='".$user_id."'") or die(mysqli_error());
    $rec2 = db_iquery($connection, "SELECT * FROM accounts_user WHERE id='".$user_id."'") or die(mysqli_error());
    if(mysqli_num_rows($rec2) > 0)
    {            
        while ($row = mysqli_fetch_object($rec2)) 
        {
            $output[] = $row;
        }
        $email =  $output[0]->email;
        // $email =  "yuvaraj.p@desss.com";
        $password = $output[0]->password;
        $recs_mail = db_iquery($connection,"select * from zcms_mail_configuration") or die(mysqli_error());
        if (mysqli_num_rows($recs_mail) > 0)
        {
            while ($rowmail = mysqli_fetch_object($recs_mail)) 
            {
                $outputmail[] = $rowmail;
            }
            if (!empty($outputmail[0]->host)&&!empty($outputmail[0]->port)&&!empty($outputmail[0]->email)&&!empty($outputmail[0]->password)&&!empty($outputmail[0]->mail_from)&&!empty($outputmail[0]->from_name)) 
            {
                require_once '/var/www/vhosts/desss-portfolio.com/trackappt.desss-portfolio.com/admin/application/third_party/PHPMailer/vendor/autoload.php';
                $mail        = new PHPMailer();
                $send .= "<br></br>You are approved.Please use below credential for login."; 
                $send .= "<br></br>Email: $email"; 
                $send .= "<br></br>Password: $password"; 
                $headers      .=  'MIME-Version: 1.0' . "\r\n";
                $headers      .=  'Content-type: text/html; charset=iso-8859-1' . "\r\n";
                $mail->IsSMTP();  
                $mail->SetLanguage("en", 'mailer/language/'); 
                $mail->Host     = $outputmail[0]->host;
                $mail->Port     = $outputmail[0]->port;   
                $mail->SMTPAuth = true; 
                $mail->Username = $outputmail[0]->email; 
                $mail->Password = $outputmail[0]->password;
                $mail->AddAddress($email);
                // $mail->AddBCC('yuvaraj.p@desss.com');
                $mail->From     = $outputmail[0]->mail_from;
                $mail->FromName = $outputmail[0]->from_name;
                $mail->IsHTML(true);
                $mail->IsHTML(true);    
                $mail->Subject  =  "Doctor Login Details";
                $mail->Body     =  $send;
                $mail->Send();
                $mail->ClearAddresses();
                $attachment = '';
                $response['code'] = 1;
                $response['status'] = 200;
            }
            else
            {
                $output[] = array("errmsg" => 'Inform developer to check mail configuration');
                $response['status'] = 403;
            }
        }
        else
        {
            $output[] = array("errmsg" => 'Inform developer to check mail configuration');
            $response['status'] = 403;
        }
    } 
    else 
    {
        $output[] = array("errmsg" => 'Invalid');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);

}

//--------------- Forget Password --------------//
function set_forgot_pass()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (isset($_REQUEST['password'])) 
    {
        $password = $_REQUEST['password'];
    } 
    else $password = "";
    $sqls = "select * from accounts_user where email = '".$email."' and is_active=1";
    $recs_des = db_iquery($connection,$sqls) or die(mysqli_error());
    if (mysqli_num_rows($recs_des) > 0) 
    { 
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET password = '".$password."' WHERE email='".$decode_email."'") or die(mysqli_error());   
        $output[] = array("msg" => 'Password set successfully');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else
    {
        $output[] = array("errmsg" => 'Something went wrong no email found');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- custom_is_user_delete --------------//
function is_user_delete()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['id'])) 
    {
        $id = $_REQUEST['id'];
    } 
    else $id = "";
    if (isset($_REQUEST['user_id'])) 
    {
        $user_id = $_REQUEST['user_id'];
    } 
    else $user_id = "";
    $recs_role = db_iquery($connection, "update accounts_doctor set is_deleted = 1  where id = '".$id."'") or die(mysqli_error());
    $recs_role1 = db_iquery($connection, "update accounts_user set is_deleted = 1  where id = '".$user_id."'") or die(mysqli_error());
    // $recs_role = db_iquery($connection, "delete from accounts_doctor where id = '".$id."'") or die(mysqli_error());
    // $recs_role1 = db_iquery($connection, "delete from accounts_user where id = '".$user_id."'") or die(mysqli_error());
    $output[] = array("msg" => 'Suceesfully Deleted');
    $response['code'] = 1;
    $response['status'] = 200;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Sample Export --------------//
function get_atr_data_export()
{
    $final_ary[] = array('Chandler','Dev','1','7135578001','dev@desss.com','02-02-2023','14:15:00','5');
    $delimiter = ",";
    $filename = "sample.csv"; // Create file name
    //create a file pointer
    $f = fopen('php://memory', 'w'); 
    $header = array('first_name','last_name','country_code','phone','email','date','from_time','doctor_id');
    $fields = $header;
    fputcsv($f, $fields, $delimiter);
    $list = $final_ary;
    foreach ($list as $fields) 
    {
        fputcsv($f, $fields);
    }
    fseek($f, 0);
    //set headers to download file rather than displayed
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '";');
    //output all remaining data on a file pointer
    fpassthru($f);
}

//----------------- Check Template to doctor -----------//
function add_edit_doctor_template(){
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    if (isset($_POST['id'])) {
        $id = $_POST['id'];
    } else $id = "";
    if (isset($_POST['doctor_id'])) {
        $doctor_id = $_POST['doctor_id'];
    } else $doctor_id = "";
    if (isset($_POST['advance_sms_template'])) {
        $advance_sms_template = $_POST['advance_sms_template'];
    } else $advance_sms_template = "";
    if (isset($_POST['reschedule_sms_template'])) {
        $reschedule_sms_template = $_POST['reschedule_sms_template'];
    } else $reschedule_sms_template = "";
    $status = 1;
    $is_deleted = 0;

    if(empty($id)):
        $recs_item = db_iquery($connection, "insert into doctor_template (`doctor_id`,`advance_sms_template`,`reschedule_sms_template`,`status`) values ('".$doctor_id."','".$advance_sms_template."','".$reschedule_sms_template."','".$status."')") or die(mysqli_error());  // die ("invalid query");
        $samedata=mysqli_insert_id($connection);
        if ($samedata > 0) 
        {
            $recs_take3 = db_iquery($connection, "SELECT * FROM doctor_template WHERE id='".$samedata."'") or die(mysqli_error());
            while ($row = mysqli_fetch_object($recs_take3)) 
            {
                $output[] = $row;
            }       
            $response['code'] = 1;
            $response['status'] = 200;
        } 
        else 
        {
            $output[] = array("errmsg" => 'Invalid');
            $response['status'] = 400;
        }   
    else:
        $recs_updateitem = db_iquery($connection, "UPDATE doctor_template SET doctor_id ='".$doctor_id."',advance_sms_template='".$advance_sms_template."',reschedule_sms_template='".$reschedule_sms_template."' WHERE id='".$id."'") or die(mysqli_error());       
        $recs_take3 = db_iquery($connection, "SELECT * FROM doctor_template WHERE id='".$id."'") or die(mysqli_error());
        if (mysqli_num_rows($recs_take3) > 0) 
        {
            while ($row = mysqli_fetch_object($recs_take3)) 
            {
                $output[] = $row;
            }       
            $response['code'] = 1;
            $response['status'] = 200;
        }
        else 
        {
            $output[] = array("errmsg" => 'Invalid');
            $response['status'] = 400;
        }
    endif;
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- IP address --------------//
function ip_address()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['number'])) 
    {
        $number = $_REQUEST['number'];
    } 
    else $number = "";
    $output = file_get_contents("http://ip-api.com/json/$number");
    print_r($output);die;
}

function custom_interval_time($from_time_break,$to_time_break,$consult_time,$intervel,$is_lunch)
{ 
    if($is_lunch == 0):
        $in = strtotime($consult_time)-strtotime("00:00:00");
        $delay = date("H:i:s",strtotime($intervel)+$in);
        /** For spliting from hhmmss to minutes */
        $time=$delay;
        $timesplit=explode(':',$time);
        $min=($timesplit[0]*60)+($timesplit[1])+($timesplit[2]>30?1:0);
        $dur = $min;
        /** For converting from hhmmss to hms */
        //lunch from
        $date = DateTime::createFromFormat('H:i:s', $from_time_break);  
        $lun_start = ($date->format('h:i A'));
        //lunch to
        $date = DateTime::createFromFormat('H:i:s', $to_time_break);  
        $lun_end = ($date->format('h:i A'));

        $duration         = $dur;  // split 
        $lunch_start      = strtotime($lun_start);
        $lunch_end		  = strtotime($lun_end);
        $start_time       = strtotime("12:00 AM"); //change to strtotime
        $end_time         = strtotime("11:45 PM"); //change to strtotime
        $remove_last_one  = date ("H:i:s", $end_time);
        $add_lunch_one    = date ("H:i:s", $lunch_end);
        $add_mins         = $duration * 60;

        // while($lunch_start <= $lunch_end)
        // {
        //     $array_of_lunch[] = date ("H:i:s", $lunch_start);
        //     $lunch_start += $add_mins;
        // }
        $start_time1       = strtotime("12:00 AM"); //change to strtotime
        $end_time1         = strtotime("11:45 PM"); //change to strtotime
        while($start_time1 <= $end_time1)
        {
            $array_of_time = date ("H:i:s", $start_time1);
            if($to_time_break==$array_of_time):
                $array_of_lunch[] = $array_of_time;
            elseif($from_time_break==$array_of_time):
                $array_of_lunch[] = $array_of_time;
            elseif($to_time_break>$array_of_time && $from_time_break<$array_of_time):
                $array_of_lunch[] = $array_of_time;
            endif;
            $start_time1 += $add_mins; 
        }
        // print_r($array_of_lunch);die;
        array_unshift($array_of_lunch, $remove_last_one);
        array_pop($array_of_lunch);
        while($start_time <= $end_time)
        {
            $array_of_time = date ("H:i:s", $start_time);
            if(!in_array($array_of_time,$array_of_lunch)):
                $array_of_lunch1[] = date ("H:i:s", $start_time);
            endif;
            $start_time += $add_mins; 
        }
        return $array_of_lunch1;
    else:
        $in = strtotime($consult_time)-strtotime("00:00:00");
        $delay = date("H:i:s",strtotime($intervel)+$in);
        /** For spliting from hhmmss to minutes */
        $time=$delay;
        $timesplit=explode(':',$time);
        $min=($timesplit[0]*60)+($timesplit[1])+($timesplit[2]>30?1:0);
        $dur = $min;
        $duration         = $dur;  // split 
        $start_time       = strtotime("12:00 AM"); //change to strtotime
        $end_time         = strtotime("11:45 PM"); //change to strtotime
        $add_mins         = $duration * 60;
        while($start_time <= $end_time)
        {
            $array_of_lunch1[] = date ("H:i:s", $start_time);
            $start_time += $add_mins; 
        }
        return $array_of_lunch1;
    endif;    
}

function custom_interval_lunch_time($from_time_break,$to_time_break,$consult_time,$intervel,$is_lunch)
{ 
    if($is_lunch == 0):
        $in = strtotime($consult_time)-strtotime("00:00:00");
        $delay = date("H:i:s",strtotime($intervel)+$in);
        /** For spliting from hhmmss to minutes */
        $time=$delay;
        $timesplit=explode(':',$time);
        $min=($timesplit[0]*60)+($timesplit[1])+($timesplit[2]>30?1:0);
        $dur = $min;
        /** For converting from hhmmss to hms */
        //lunch from
        $date = DateTime::createFromFormat('H:i:s', $from_time_break);  
        $lun_start = ($date->format('h:i A'));
        //lunch to
        $date = DateTime::createFromFormat('H:i:s', $to_time_break);  
        $lun_end = ($date->format('h:i A'));

        $duration         = $dur;  // split 
        $lunch_start      = strtotime($lun_start);
        $lunch_end		  = strtotime($lun_end);
        $start_time       = strtotime("12:00 AM"); //change to strtotime
        $end_time         = strtotime("11:45 PM"); //change to strtotime
        $remove_last_one  = date ("H:i:s", $end_time);
        $add_lunch_one    = date ("H:i:s", $lunch_end);
        $add_mins         = $duration * 60;

        while($lunch_start <= $lunch_end)
        {
            $array_of_lunch1[] = date ("H:i:s", $lunch_start);
            $lunch_start += $add_mins;
        }
        array_pop($array_of_lunch1);
        return $array_of_lunch1;
    else:
        $array_of_lunch1 = array();
        return $array_of_lunch1;
    endif;    
}

//--------------- auth update --------------//
function authupdate()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_POST['auth_refid'])) 
    {
        $auth_refid = $_POST['auth_refid'];
    } 
    else $auth_refid = "";
    if (isset($_POST['auth_subscriptionid'])) 
    {
        $auth_subscriptionid = $_POST['auth_subscriptionid'];
    } 
    else $auth_subscriptionid = "";
    if (isset($_POST['auth_exp_date'])) 
    {
        $auth_exp_date = $_POST['auth_exp_date'];
    } 
    else $auth_exp_date = "";
    if (isset($_POST['auth_start_date'])) 
    {
        $auth_start_date = $_POST['auth_start_date'];
    } 
    else $auth_start_date = "";
    if (isset($_POST['auth_start_full_date'])) 
    {
        $auth_start_full_date = $_POST['auth_start_full_date'];
    } 
    else $auth_start_full_date = "";
    if (isset($_POST['auth_exp_full_date'])) 
    {
        $auth_exp_full_date = $_POST['auth_exp_full_date'];
    } 
    else $auth_exp_full_date = "";
    if (isset($_POST['plan_active'])) 
    {
        $plan_active = $_POST['plan_active'];
    } 
    else $plan_active = "";
    if (isset($_POST['plan_id'])) 
    {
        $plan_id = $_POST['plan_id'];
    } 
    else $plan_id = "";
    if (isset($_POST['id'])) 
    {
        $id = $_POST['id'];
    } 
    else $id = "";
    if (!empty($auth_refid) && !empty($auth_subscriptionid) && !empty($id))
    { 
        $recs_update = db_iquery($connection, "UPDATE accounts_user SET plan_active = '".$plan_active."',plan_id = '".$plan_id."', auth_subscriptionid = '".$auth_subscriptionid."',auth_refid = '".$auth_refid."',auth_start_date = '".$auth_start_date."',auth_start_full_date = '".$auth_start_full_date."',auth_exp_date = '".$auth_exp_date."',auth_exp_full_date = '".$auth_exp_full_date."' WHERE id='".$id."'") or die(mysqli_error());   
        $output[] = array("msg" => 'Auth Updated successfully');
        $response['code'] = 1;
        $response['status'] = 200;
    }
    else
    {
        $output[] = array("errmsg" => 'Paremeter missed');
        $response['status'] = 403;
    }

    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Import file for two tables --------------//
function import_file_patient_new_temp()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $issues_times = [];
    $issues_times_row = [];
    $issues_slots_row = [];
    $issues_slots = [];
    $all_time = [];
    $date_issue = [];
    $time_issue = [];
    $doctor_id_issue = [];
    $line_err = [];

    $doctor_id_issue_line = [];
    $time_issue_line = [];
    $date_issue_line = [];
    if (isset($_FILES['file']['name'])) 
    {
        /** Allowed mime types */
        $excelMimes = array('text/xls', 'text/xlsx', 'application/excel', 'application/vnd.msexcel', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        /** Validate whether selected file is a CSV file */
        if(!empty($_FILES['file']['name']) && in_array($_FILES['file']['type'], $excelMimes))
        {
            /** If the file is uploaded */
            if(is_uploaded_file($_FILES['file']['tmp_name']))
            {
                $reader = new Xlsx(); 
                $spreadsheet = $reader->load($_FILES['file']['tmp_name']); 
                $worksheet = $spreadsheet->getActiveSheet();  
                $worksheet_arr = $worksheet->toArray(); 
                $worksheet_arr1 = $worksheet->toArray(); 
                unset($worksheet_arr[0]);
                unset($worksheet_arr1[0]);
                $uv = 2;
                foreach($worksheet_arr as $line)
                {  
                    if(!empty($line[0])):
                        $line_err[] = $uv;
                        /** Get row data */
                        $first_name   = $line[0];
                        $last_name  = $line[1];
                        $phone  = "+".$line[2].$line[3];
                        $email = $line[4];
                        $age   = "";
                        $gender  = "";
                        $purpose  = "";
                        $str_replace_date = array("/",".");
                        $date = str_replace($str_replace_date,"-",$line[5]);
                        $from_time = $line[6];
                        $doctor_id = $line[7];
                        $to_time = "";
                        $is_completed = 0;
                        /** validation for date and time */
                        $date_issue_find = date_error($line[5]);
                        if($date_issue_find == "Yes")
                        {
                            $date_issue[] = $date_issue_find;
                            $date_issue_line[] = $uv;
                        }
                        $time_issue_find = time_error($line[6]);
                        if($time_issue_find == "Yes")
                        {
                            $time_issue[] = $time_issue_find;
                            $time_issue_line[] = $uv;
                        }
                        /** End validation for date and time */
                        /** Cusotm converting */
                        $explode_date = explode("-",$date);
                        $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                        $recs_role = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
                        if(mysqli_num_rows($recs_role) > 0)
                        { 
                            while ($row = mysqli_fetch_object($recs_role)) 
                            {
                                $output12[] = $row;
                            }
                            $addtime1 = $output12[0]->consult_time;
                            $delay = $addtime1;
                            $in = strtotime($addtime1)-strtotime("00:00:00");
                            $adding_time = date("H:i:s",strtotime($output12[0]->intervel)+$in);
                            $array_time_slot = custom_interval_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                            $array_lunch_slot = custom_interval_lunch_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                            // print_r($array_time_slot);
                            // print_r($array_lunch_slot);die;
                        }   
                        else
                        {
                            $doctor_id_issue[] = "Yes";
                            $doctor_id_issue_line[] = $uv;
                        } 
                        if(mysqli_num_rows($recs_role) > 0):
                            $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                            if(mysqli_num_rows($check_time) == 0)
                            {
                                $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                                if(mysqli_num_rows($check_time_reschedule) == 0):
                                    $all_time[] = $from_time; 
                                    if(in_array($from_time,$array_time_slot)):
                                    else:
                                        if(in_array($from_time,$array_lunch_slot)):
                                            $issues_times_row[] = $uv; 
                                            $issues_times[] =  $from_time; 
                                        else:
                                            $issues_slots_row[] = $uv; 
                                            $issues_slots[] =  $from_time; 
                                        endif;
                                    endif;    
                                endif;    
                            }  
                        endif;
                        $uv++;
                    endif;
                    
                }  
                if(in_array("Yes",$date_issue)||in_array("Yes",$time_issue)||in_array("Yes",$doctor_id_issue)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Issues in date and time',"date_issue"=>$date_issue,"date_issue_line"=>$date_issue_line,"time_issue"=>$time_issue,"time_issue_line"=>$time_issue_line,"doctor_id_issue"=>$doctor_id_issue,"doctor_id_issue_line"=>$doctor_id_issue_line);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                elseif(!empty($issues_times)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Check lunch time',"lunch_time_issues"=>$issues_times,"row"=>$issues_times_row);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                elseif(!empty($issues_slots)):
                        $response['code'] = 0;
                        $output[] = array("msg" => 'Check slot time',"slot_time_issues"=>$issues_slots,"row"=>$issues_slots_row);
                        $response['status'] = 400;
                        $response['data'] = $output;
                        sendResponse($response['status'], json_encode($response), $contenttype);
                        die;
                else:
                    /** Parse data from CSV file line by line */
                    foreach($worksheet_arr1 as $line)
                    {
                        if(!empty($line[0])):
                            /** Get row data */
                            $first_name   = $line[0];
                            $last_name  = $line[1];
                            $phone  = "+".$line[2].$line[3];
                            $email = $line[4];
                            $age   = "";
                            $gender  = "";
                            $purpose  = "";
                            $str_replace_date = array("/",".");
                            $date = str_replace($str_replace_date,"-",$line[5]);
                            $from_time = $line[6];
                            $doctor_id = $line[7];
                            $to_time = "";
                            $is_completed = 0;
                            /** validation for date and time */
                            if (strpos($line[5], '/') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '.') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '-') !== false) 
                            {
                                $explode_1 = explode("-",$line[5]);
                                $find_exp_count = count($explode_1);
                                if(strlen($explode_1[0])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;
                                if(strlen($explode_1[1])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;    
                                if(strlen($explode_1[2])<4):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;    
                                endif;

                            }
                            if (strpos($line[6], 'AM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], 'PM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], '.') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            /** End validation for date and time */
                            /** Cusotm converting */
                            $explode_date = explode("-",$date);
                            $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                            $recs_role = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
                            if(mysqli_num_rows($recs_role) > 0)
                            { 
                                while ($row = mysqli_fetch_object($recs_role)) 
                                {
                                    $output12[] = $row;
                                }
                            $addtime1 = $output12[0]->consult_time;
                            $delay = $addtime1;
                            /** Add consult time and interval */
                            $secs_con = strtotime($output12[0]->intervel)-strtotime("00:00:00");
                            $exact_tod_cal = date("H:i:s",strtotime($output12[0]->consult_time)+$secs_con);
                            $array_time_slot = custom_interval_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                            }   
                            else
                            {
                                $delay = "00:15:00";
                                $exact_tod_cal = "00:15:00";
                            } 
                            $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                            if(mysqli_num_rows($check_time) == 0)
                            {
                                $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                                if(mysqli_num_rows($check_time_reschedule) == 0):
                                    if(in_array($from_time,$array_time_slot)):
                                        $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
                                        $samedata=mysqli_insert_id($connection);
                                        $recs_role_appoitnment = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."' and from_time='".$from_time."'and doc_id_id='".$doctor_id."'") or die(mysqli_error());
                                        if(mysqli_num_rows($recs_role_appoitnment) > 0)
                                        { 
                                        }   
                                        else
                                        {
                                            $secs_con12 = strtotime($exact_tod_cal)-strtotime("00:00:00");
                                            $tod_time = date("H:i:s",strtotime($from_time)+$secs_con12);
                                            $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`tod_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`) values ('".$date."','".$from_time."','".$tod_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."')") or die(mysqli_error());  // die ("invalid query");
                                        } 
                                    else:
                                        $issues_times[] =  $from_time; 
                                    endif;    
                                endif;    
                            }   
                        endif;
                    }
                    $response['code'] = 1;
                    $output[] = array("msg" => 'Successfully Imported',"lunch_time_issues"=>$issues_times);
                    $response['status'] = 200;
                endif;    
            }
        }
    } 
    else
    {
        $output[] = array("errmsg" => 'Please give file');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

function time_error($time)
{
    $err  = "No";
    if (strpos($time, 'AM') !== false) 
    {
        $err  = "Yes";return $err;
    }
    if (strpos($time, 'PM') !== false) 
    {
        $err  = "Yes";return $err;
    }
    if (strpos($time, '.') !== false)
    {
        $err  = "Yes";return $err;
    }
    return $err;
}

function date_error($date)
{
    $err  = "No";
    if (strpos($date, '/') !== false)
    {
        $err  = "Yes";return $err;
    }
    if (strpos($date, '.') !== false) 
    {
        $err  = "Yes";return $err;
    }
    if (strpos($date, '-') !== false) 
    {
        $explode_1 = explode("-",$date);
        $find_exp_count = count($explode_1);
        if(strlen($explode_1[0])<2):
            $err  = "Yes";return $err;
        endif;
        if(strlen($explode_1[1])<2):
            $err  = "Yes";return $err;
        endif;    
        if(strlen($explode_1[2])<4):
            $err  = "Yes";return $err;
        endif;
    }
    return $err;
}



//--------------- Import file for two tables --------------//
function import_file_patient_new_temp_dynamic()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $issues_times = [];
    $issues_times_row = [];
    $issues_slots_row = [];
    $issues_slots = [];
    $all_time = [];
    $date_issue = [];
    $time_issue = [];
    $doctor_id_issue = [];
    $line_err = [];

    $doctor_id_issue_line = [];
    $time_issue_line = [];
    $date_issue_line = [];
    if (isset($_FILES['file']['name'])) 
    {
        /** Allowed mime types */
        $excelMimes = array('text/xls', 'text/xlsx', 'application/excel', 'application/vnd.msexcel', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        /** Validate whether selected file is a CSV file */
        if(!empty($_FILES['file']['name']) && in_array($_FILES['file']['type'], $excelMimes))
        {
            /** If the file is uploaded */
            if(is_uploaded_file($_FILES['file']['tmp_name']))
            {
                $reader = new Xlsx(); 
                $spreadsheet = $reader->load($_FILES['file']['tmp_name']); 
                $worksheet = $spreadsheet->getActiveSheet();  
                $worksheet_arr = $worksheet->toArray(); 
                $worksheet_arr1 = $worksheet->toArray(); 
                unset($worksheet_arr[0]);
                unset($worksheet_arr1[0]);
                $uv = 2;
                foreach($worksheet_arr as $line)
                {  
                    // print_r($line);die;
                    if(!empty($line[0])):
                        $line_err[] = $uv;
                        /** Get row data */
                        $first_name   = $line[0];
                        $last_name  = $line[1];
                        $phone  = "+".$line[2].$line[3];
                        $email = $line[4];
                        $age   = "";
                        $gender  = "";
                        $purpose  = "";
                        $str_replace_date = array("/",".");
                        $date = str_replace($str_replace_date,"-",$line[5]);
                        $from_time = $line[6];
                        $doctor_id = $line[8];
                        $tod_time = $line[7];
                        $to_time = "";
                        $is_completed = 0;
                        /** validation for date and time */
                        $date_issue_find = date_error($line[5]);
                        if($date_issue_find == "Yes")
                        {
                            $date_issue[] = $date_issue_find;
                            $date_issue_line[] = $uv;
                        }
                        $time_issue_find = time_error($line[6]);
                        if($time_issue_find == "Yes")
                        {
                            $time_issue[] = $time_issue_find;
                            $time_issue_line[] = $uv;
                        }
                        /** End validation for date and time */
                        /** Cusotm converting */
                        $explode_date = explode("-",$date);
                        $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                        $recs_role = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
                        if(mysqli_num_rows($recs_role) > 0)
                        { 
                            while ($row = mysqli_fetch_object($recs_role)) 
                            {
                                $output12[] = $row;
                            }
                            // $addtime1 = $output12[0]->consult_time;
                            // $delay = $addtime1;
                            // $in = strtotime($addtime1)-strtotime("00:00:00");
                            // $adding_time = date("H:i:s",strtotime($output12[0]->intervel)+$in);
                            // $array_time_slot = custom_interval_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                            // $array_lunch_slot = custom_interval_lunch_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);


                            // print_r($array_time_slot);
                            // print_r($array_lunch_slot);die;
                            if($from_time == $output12[0]->from_time_break)
                            {
                                $issues_times_row[] = $uv; 
                                $issues_times[] =  $from_time; 
                            }
                            if($from_time > $output12[0]->from_time_break && $from_time < $output12[0]->to_time_break)
                            {
                                $issues_times_row[] = $uv; 
                                $issues_times[] =  $from_time; 
                            }
                        }   
                        else
                        {
                            $doctor_id_issue[] = "Yes";
                            $doctor_id_issue_line[] = $uv;
                        } 
                        // if(mysqli_num_rows($recs_role) > 0):
                        //     $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                        //     if(mysqli_num_rows($check_time) == 0)
                        //     {
                        //         $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                        //         if(mysqli_num_rows($check_time_reschedule) == 0):
                        //             $all_time[] = $from_time; 
                        //             if(in_array($from_time,$array_time_slot)):
                        //             else:
                        //                 if(in_array($from_time,$array_lunch_slot)):
                        //                     $issues_times_row[] = $uv; 
                        //                     $issues_times[] =  $from_time; 
                        //                 else:
                        //                     $issues_slots_row[] = $uv; 
                        //                     $issues_slots[] =  $from_time; 
                        //                 endif;
                        //             endif;    
                        //         endif;    
                        //     }  
                        // endif;
                        $uv++;
                    endif;
                    
                }  
                if(in_array("Yes",$date_issue)||in_array("Yes",$time_issue)||in_array("Yes",$doctor_id_issue)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Issues in date and time',"date_issue"=>$date_issue,"date_issue_line"=>$date_issue_line,"time_issue"=>$time_issue,"time_issue_line"=>$time_issue_line,"doctor_id_issue"=>$doctor_id_issue,"doctor_id_issue_line"=>$doctor_id_issue_line);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                elseif(!empty($issues_times)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Check lunch time',"lunch_time_issues"=>$issues_times,"row"=>$issues_times_row);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                // elseif(!empty($issues_slots)):
                //         $response['code'] = 0;
                //         $output[] = array("msg" => 'Check slot time',"slot_time_issues"=>$issues_slots,"row"=>$issues_slots_row);
                //         $response['status'] = 400;
                //         $response['data'] = $output;
                //         sendResponse($response['status'], json_encode($response), $contenttype);
                //         die;
                else:
                    /** Parse data from CSV file line by line */
                    foreach($worksheet_arr1 as $line)
                    {
                        if(!empty($line[0])):
                            /** Get row data */
                            $first_name   = $line[0];
                            $last_name  = $line[1];
                            $phone  = "+".$line[2].$line[3];
                            $email = $line[4];
                            $age   = "";
                            $gender  = "";
                            $purpose  = "";
                            $str_replace_date = array("/",".");
                            $date = str_replace($str_replace_date,"-",$line[5]);
                            $from_time = $line[6];
                            $doctor_id = $line[8];
                            $tod_time = $line[7];
                            $to_time = "";
                            $is_completed = 0;
                            /** validation for date and time */
                            if (strpos($line[5], '/') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '.') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '-') !== false) 
                            {
                                $explode_1 = explode("-",$line[5]);
                                $find_exp_count = count($explode_1);
                                if(strlen($explode_1[0])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;
                                if(strlen($explode_1[1])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;    
                                if(strlen($explode_1[2])<4):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;    
                                endif;

                            }
                            if (strpos($line[6], 'AM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], 'PM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], '.') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            /** End validation for date and time */
                            /** Cusotm converting */
                            $explode_date = explode("-",$date);
                            $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                            $delay = "00:00:00";

                            $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                            $check_time_between = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time<'".$from_time."' and tod_time>'".$from_time."'") or die(mysqli_error());
                            if(mysqli_num_rows($check_time) == 0 && mysqli_num_rows($check_time_between) == 0)
                            {
                                $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                                $check_time_reschedule_between = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time<'".$from_time."' and reschdule_time>'".$from_time."'") or die(mysqli_error());
                                if(mysqli_num_rows($check_time_reschedule) == 0 && mysqli_num_rows($check_time_reschedule_between) == 0):
                                        $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
                                        $samedata=mysqli_insert_id($connection);
                                        $recs_role_appoitnment = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."' and from_time='".$from_time."'and doc_id_id='".$doctor_id."'") or die(mysqli_error());
                                        if(mysqli_num_rows($recs_role_appoitnment) > 0)
                                        {
                                        }
                                        else
                                        {
                                            $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`tod_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`) values ('".$date."','".$from_time."','".$tod_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."')") or die(mysqli_error());  // die ("invalid query");
                                        }
                                else:
                                    $issues_times[] =  $from_time;
                                endif;   
                            }
                            else
                            {
                                $issues_times[] =  $from_time;
                            }
                        endif;
                    }
                    $response['code'] = 1;
                    $output[] = array("msg" => 'Successfully Imported',"time_issues"=>$issues_times);
                    $response['status'] = 200;
                endif;    
            }
        }
    } 
    else
    {
        $output[] = array("errmsg" => 'Please give file');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- Import file for two tables --------------//
function import_file_patient_new_temp_multiple()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    $issues_times = [];
    $issues_times_row = [];
    $issues_slots_row = [];
    $issues_slots = [];
    $all_time = [];
    $date_issue = [];
    $time_issue = [];
    $doctor_id_issue = [];
    $line_err = [];

    $doctor_id_issue_line = [];
    $time_issue_line = [];
    $date_issue_line = [];
    if (isset($_FILES['file']['name'])) 
    {
        /** Allowed mime types */
        $excelMimes = array('text/xls', 'text/xlsx', 'application/excel', 'application/vnd.msexcel', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        /** Validate whether selected file is a CSV file */
        if(!empty($_FILES['file']['name']) && in_array($_FILES['file']['type'], $excelMimes))
        {
            /** If the file is uploaded */
            if(is_uploaded_file($_FILES['file']['tmp_name']))
            {
                $reader = new Xlsx(); 
                $spreadsheet = $reader->load($_FILES['file']['tmp_name']); 
                $worksheet = $spreadsheet->getActiveSheet();  
                $worksheet_arr = $worksheet->toArray(); 
                $worksheet_arr1 = $worksheet->toArray(); 
                unset($worksheet_arr[0]);
                unset($worksheet_arr1[0]);
                $uv = 2;
                foreach($worksheet_arr as $line)
                {  
                    // print_r($line);die;
                    if(!empty($line[0])):
                        $line_err[] = $uv;
                        /** Get row data */
                        $first_name   = $line[0];
                        $last_name  = $line[1];
                        $phone  = "+".$line[2].$line[3];
                        $email = $line[4];
                        $age   = "";
                        $gender  = "";
                        $purpose  = "";
                        $str_replace_date = array("/",".");
                        $date = str_replace($str_replace_date,"-",$line[5]);
                        $from_time = $line[6];
                        $doctor_id = $line[8];
                        $tod_time = $line[7];
                        $to_time = "";
                        $is_completed = 0;
                        /** validation for date and time */
                        $date_issue_find = date_error($line[5]);
                        if($date_issue_find == "Yes")
                        {
                            $date_issue[] = $date_issue_find;
                            $date_issue_line[] = $uv;
                        }
                        $time_issue_find = time_error($line[6]);
                        if($time_issue_find == "Yes")
                        {
                            $time_issue[] = $time_issue_find;
                            $time_issue_line[] = $uv;
                        }
                        /** End validation for date and time */
                        /** Cusotm converting */
                        $explode_date = explode("-",$date);
                        $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                        $recs_role = db_iquery($connection, "SELECT * FROM  accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
                        if(mysqli_num_rows($recs_role) > 0)
                        { 
                            while ($row = mysqli_fetch_object($recs_role)) 
                            {
                                $output12[] = $row;
                            }
                            // $addtime1 = $output12[0]->consult_time;
                            // $delay = $addtime1;
                            // $in = strtotime($addtime1)-strtotime("00:00:00");
                            // $adding_time = date("H:i:s",strtotime($output12[0]->intervel)+$in);
                            // $array_time_slot = custom_interval_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);
                            // $array_lunch_slot = custom_interval_lunch_time($output12[0]->from_time_break,$output12[0]->to_time_break,$output12[0]->consult_time,$output12[0]->intervel,$output12[0]->is_lunch);


                            // print_r($array_time_slot);
                            // print_r($array_lunch_slot);die;
                            if($from_time == $output12[0]->from_time_break)
                            {
                                $issues_times_row[] = $uv; 
                                $issues_times[] =  $from_time; 
                            }
                            if($from_time > $output12[0]->from_time_break && $from_time < $output12[0]->to_time_break)
                            {
                                $issues_times_row[] = $uv; 
                                $issues_times[] =  $from_time; 
                            }
                        }   
                        else
                        {
                            $doctor_id_issue[] = "Yes";
                            $doctor_id_issue_line[] = $uv;
                        } 
                        // if(mysqli_num_rows($recs_role) > 0):
                        //     $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                        //     if(mysqli_num_rows($check_time) == 0)
                        //     {
                        //         $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                        //         if(mysqli_num_rows($check_time_reschedule) == 0):
                        //             $all_time[] = $from_time; 
                        //             if(in_array($from_time,$array_time_slot)):
                        //             else:
                        //                 if(in_array($from_time,$array_lunch_slot)):
                        //                     $issues_times_row[] = $uv; 
                        //                     $issues_times[] =  $from_time; 
                        //                 else:
                        //                     $issues_slots_row[] = $uv; 
                        //                     $issues_slots[] =  $from_time; 
                        //                 endif;
                        //             endif;    
                        //         endif;    
                        //     }  
                        // endif;
                        $uv++;
                    endif;
                    
                }  
                if(in_array("Yes",$date_issue)||in_array("Yes",$time_issue)||in_array("Yes",$doctor_id_issue)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Issues in date and time',"date_issue"=>$date_issue,"date_issue_line"=>$date_issue_line,"time_issue"=>$time_issue,"time_issue_line"=>$time_issue_line,"doctor_id_issue"=>$doctor_id_issue,"doctor_id_issue_line"=>$doctor_id_issue_line);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                elseif(!empty($issues_times)):
                    $response['code'] = 0;
                    $output[] = array("msg" => 'Check lunch time',"lunch_time_issues"=>$issues_times,"row"=>$issues_times_row);
                    $response['status'] = 400;
                    $response['data'] = $output;
                    sendResponse($response['status'], json_encode($response), $contenttype);
                    die;
                // elseif(!empty($issues_slots)):
                //         $response['code'] = 0;
                //         $output[] = array("msg" => 'Check slot time',"slot_time_issues"=>$issues_slots,"row"=>$issues_slots_row);
                //         $response['status'] = 400;
                //         $response['data'] = $output;
                //         sendResponse($response['status'], json_encode($response), $contenttype);
                //         die;
                else:
                    /** Parse data from CSV file line by line */
                    foreach($worksheet_arr1 as $line)
                    {
                        if(!empty($line[0])):
                            /** Get row data */
                            $first_name   = $line[0];
                            $last_name  = $line[1];
                            $phone  = "+".$line[2].$line[3];
                            $email = $line[4];
                            $age   = "";
                            $gender  = "";
                            $purpose  = "";
                            $str_replace_date = array("/",".");
                            $date = str_replace($str_replace_date,"-",$line[5]);
                            $from_time = $line[6];
                            $doctor_id = $line[8];
                            $tod_time = $line[7];
                            $to_time = "";
                            $is_completed = 0;
                            /** validation for date and time */
                            if (strpos($line[5], '/') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '.') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check date format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[5], '-') !== false) 
                            {
                                $explode_1 = explode("-",$line[5]);
                                $find_exp_count = count($explode_1);
                                if(strlen($explode_1[0])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;
                                if(strlen($explode_1[1])<2):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;
                                endif;    
                                if(strlen($explode_1[2])<4):
                                    $output[] = array("errmsg" => 'Please check date format');
                                    $response['status'] = 400;
                                    $response['data'] = $output;
                                    sendResponse($response['status'], json_encode($response), $contenttype);
                                    die;    
                                endif;

                            }
                            if (strpos($line[6], 'AM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], 'PM') !== false) 
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            if (strpos($line[6], '.') !== false)
                            {
                                $output[] = array("errmsg" => 'Please check time format');
                                $response['status'] = 400;
                                $response['data'] = $output;
                                sendResponse($response['status'], json_encode($response), $contenttype);
                                die;
                            }
                            /** End validation for date and time */
                            /** Cusotm converting */
                            $explode_date = explode("-",$date);
                            $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
                            $delay = "00:00:00";

                            // $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
                            $check_time_between = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time<'".$from_time."' and tod_time>'".$from_time."'") or die(mysqli_error());
                            // if(mysqli_num_rows($check_time) == 0 && mysqli_num_rows($check_time_between) == 0)
                            if(mysqli_num_rows($check_time_between) == 0)
                            {
                                // $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
                                // $check_time_reschedule_between = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time<'".$from_time."' and reschdule_time>'".$from_time."'") or die(mysqli_error());
                                // if(mysqli_num_rows($check_time_reschedule) == 0 && mysqli_num_rows($check_time_reschedule_between) == 0):
                                        
                                        $recs_role_appoitnment = db_iquery($connection, "SELECT * FROM  accounts_appointment WHERE date='".$date."' and from_time='".$from_time."'and doc_id_id='".$doctor_id."'") or die(mysqli_error());
                                        if(mysqli_num_rows($recs_role_appoitnment) > 0)
                                        {
                                        }
                                        else
                                        {
                                            $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
                                            $samedata=mysqli_insert_id($connection);
                                            $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`tod_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`) values ('".$date."','".$from_time."','".$tod_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."')") or die(mysqli_error());  // die ("invalid query");
                                        }
                                // else:
                                //     $issues_times[] =  $from_time;
                                // endif;
                            }
                            else
                            {
                                $issues_times[] =  $from_time;
                            }
                        endif;
                    }
                    $response['code'] = 1;
                    $output[] = array("msg" => 'Successfully Imported',"time_issues"=>$issues_times);
                    $response['status'] = 200;
                endif;    
            }
        }
    } 
    else
    {
        $output[] = array("errmsg" => 'Please give file');
        $response['status'] = 400;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
} 

//--------------- add custom patient --------------//
function add_custom_patient_dynamic()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';
    
    if (isset($_REQUEST['first_name'])) 
    {
        $first_name = $_REQUEST['first_name'];
    } 
    else $first_name = "";
    if (isset($_REQUEST['last_name'])) 
    {
        $last_name = $_REQUEST['last_name'];
    } 
    else $last_name = "";
    if (isset($_REQUEST['phone'])) 
    {
        $phone = "+".$_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (isset($_REQUEST['age'])) 
    {
        $age = $_REQUEST['age'];
    } 
    else $age = "";
    if (isset($_REQUEST['gender'])) 
    {
        $gender = $_REQUEST['gender'];
    } 
    else $gender = "";
    if (isset($_REQUEST['purpose'])) 
    {
        $purpose = $_REQUEST['purpose'];
    } 
    else $purpose = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";
    if (isset($_REQUEST['from_time'])) 
    {
        $from_time  = $_REQUEST['from_time'];
    } 
    else $from_time  = "";
    if (isset($_REQUEST['tod_time'])) 
    {
        $tod_time  = $_REQUEST['tod_time'];
    } 
    else $tod_time  = "";
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id  = $_REQUEST['doctor_id'];
    } 
    else $doctor_id  = "";
    if (isset($_REQUEST['is_lunch'])) 
    {
        $is_lunch  = $_REQUEST['is_lunch'];
    } 
    else $is_lunch  = "";
    $to_time = "";
    $is_completed = 0;
    $delay = "";
    $appointment_type = "Dynamic Appointment";
    //Custom convert date
    $explode_date = explode("-",$date);
    $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];

    $find_doc = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
    if(mysqli_num_rows($find_doc) > 0)
    {
        while ($row_doc = mysqli_fetch_object($find_doc))
        {
            $output_doc[] = $row_doc;
        }
        
        if($from_time == $output_doc[0]->from_time_break)
        {
            $output[] = array("errmsg" => 'The time is being between lunch time');
            $response['status'] = 403;
            $response['data'] = $output;
            sendResponse($response['status'], json_encode($response), $contenttype);
            die;
        }
        if($from_time > $output_doc[0]->from_time_break && $from_time < $output_doc[0]->to_time_break)
        {
            $output[] = array("errmsg" => 'The time is being between lunch time');
            $response['status'] = 403;
            $response['data'] = $output;
            sendResponse($response['status'], json_encode($response), $contenttype);
            die;
        }

        $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."'") or die(mysqli_error());
        $check_time_between = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time<'".$from_time."' and tod_time>'".$from_time."'") or die(mysqli_error());
        if(mysqli_num_rows($check_time) == 0 && mysqli_num_rows($check_time_between) == 0)
        {
            $check_time_reschedule = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time='".$from_time."'") or die(mysqli_error());
            $check_time_reschedule_between = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and reschdule_time<'".$from_time."' and reschdule_time>'".$from_time."'") or die(mysqli_error());
            if(mysqli_num_rows($check_time_reschedule) == 0 && mysqli_num_rows($check_time_reschedule_between) == 0)
            {  
                //insert
                $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
                $samedata=mysqli_insert_id($connection);
                $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`tod_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`,`appointment_type`) values ('".$date."','".$from_time."','".$tod_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."','".$appointment_type."')") or die(mysqli_error());  // die ("invalid query");
                $samedata1=mysqli_insert_id($connection);
                if ($samedata1 > 0) 
                {
                    $recs_role = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE id='".$samedata1."'") or die(mysqli_error());
                    if(mysqli_num_rows($recs_role) > 0)
                    {            
                        while ($row = mysqli_fetch_object($recs_role)) 
                        {
                            $output[] = $row;
                        }
                    }
                    $response['code'] = 1;
                    $response['status'] = 200;
                } 
                else
                {
                    $output[] = array("errmsg" => 'Something error in csv file');
                    $response['status'] = 403;
                }
            }    
            else
            {
                $output[] = array("errmsg" => "Slot not available, slot is already booked or its doctor's lunch time");
                $response['status'] = 403;
            }    
        }
        else
        {
            $output[] = array("errmsg" => "Slot not available, slot is already booked or its doctor's lunch time");
            $response['status'] = 403;
        }    
    }
    else
    {
        $output[] = array("errmsg" => 'There is no doctor with this id');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- add custom multiple appointment --------------//
function add_custom_multiple_appointment()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_REQUEST['appointment_type'])) 
    {
        $appointment_type = $_REQUEST['appointment_type'];
    } 
    else $appointment_type = "";
    if (isset($_REQUEST['first_name'])) 
    {
        $first_name = $_REQUEST['first_name'];
    } 
    else $first_name = "";
    if (isset($_REQUEST['last_name'])) 
    {
        $last_name = $_REQUEST['last_name'];
    } 
    else $last_name = "";
    if (isset($_REQUEST['phone'])) 
    {
        $phone = "+".$_REQUEST['phone'];
    } 
    else $phone = "";
    if (isset($_REQUEST['email'])) 
    {
        $email = $_REQUEST['email'];
    } 
    else $email = "";
    if (isset($_REQUEST['age'])) 
    {
        $age = $_REQUEST['age'];
    } 
    else $age = "";
    if (isset($_REQUEST['gender'])) 
    {
        $gender = $_REQUEST['gender'];
    } 
    else $gender = "";
    if (isset($_REQUEST['purpose'])) 
    {
        $purpose = $_REQUEST['purpose'];
    } 
    else $purpose = "";
    if (isset($_REQUEST['date'])) 
    {
        $date = $_REQUEST['date'];
    } 
    else $date = "";
    if (isset($_REQUEST['from_time'])) 
    {
        $from_time  = $_REQUEST['from_time'];
    } 
    else $from_time  = "";
    if (isset($_REQUEST['to_time'])) 
    {
        $to_time  = $_REQUEST['to_time'];
    } 
    else $to_time  = "";
    if (isset($_REQUEST['doctor_id'])) 
    {
        $doctor_id  = $_REQUEST['doctor_id'];
    } 
    else $doctor_id  = "";
    if (isset($_REQUEST['is_lunch'])) 
    {
        $is_lunch  = $_REQUEST['is_lunch'];
    } 
    else $is_lunch  = "";
    $tod_time = "";
    $is_completed = 0;
    $delay = "";
    //Custom convert date
    $explode_date = explode("-",$date);
    $cus_date = $explode_date[2].'-'.$explode_date[0].'-'.$explode_date[1];
    $find_doc = db_iquery($connection, "SELECT * FROM accounts_doctor WHERE id='".$doctor_id."'") or die(mysqli_error());
    if(mysqli_num_rows($find_doc) > 0)
    {
        while ($row_doc = mysqli_fetch_object($find_doc))
        {
            $output_doc[] = $row_doc;
        }
        
        if($from_time == $output_doc[0]->from_time_break)
        {
            $output[] = array("errmsg" => 'The time is being between lunch time');
            $response['status'] = 403;
            $response['data'] = $output;
            sendResponse($response['status'], json_encode($response), $contenttype);
            die;
        }
        if($from_time > $output_doc[0]->from_time_break && $from_time < $output_doc[0]->to_time_break)
        {
            $output[] = array("errmsg" => 'The time is being between lunch time');
            $response['status'] = 403;
            $response['data'] = $output;
            sendResponse($response['status'], json_encode($response), $contenttype);
            die;
        }

        // $check_time = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE doc_id_id='".$doctor_id."' and date='".$date."' and from_time='".$from_time."' and appointment_type='".$appointment_type."'") or die(mysqli_error());
        // if(mysqli_num_rows($check_time) == 0)
        // {
            //insert
            $recs = db_iquery($connection, "insert into accounts_patient (`first_name`,`last_name`,`phone`,`email`,`age`,`gender`,`purpose`) values ('".$first_name."','".$last_name."','".$phone."','".$email."','".$age."','".$gender."','".$purpose."')") or die(mysqli_error());  // die ("invalid query");
            $samedata=mysqli_insert_id($connection);
            $recs1 = db_iquery($connection, "insert into accounts_appointment (`date`,`from_time`,`tod_time`,`to_time`,`is_completed`,`delay`,`doc_id_id`,`patient_id_id`,`cus_date`,`appointment_type`) values ('".$date."','".$from_time."','".$tod_time."','".$to_time."','".$is_completed."','".$delay."','".$doctor_id."','".$samedata."','".$cus_date."','".$appointment_type."')") or die(mysqli_error());  // die ("invalid query");
            $samedata1=mysqli_insert_id($connection);
            if ($samedata1 > 0) 
            {
                $recs_role = db_iquery($connection, "SELECT * FROM accounts_appointment WHERE id='".$samedata1."'") or die(mysqli_error());
                if(mysqli_num_rows($recs_role) > 0)
                {            
                    while ($row = mysqli_fetch_object($recs_role)) 
                    {
                        $output[] = $row;
                    }
                }
                $response['code'] = 1;
                $response['status'] = 200;
            } 
            else
            {
                $output[] = array("errmsg" => 'Something error in csv file');
                $response['status'] = 403;
            }   
        // }
        // else
        // {
        //     $output[] = array("errmsg" => "Slot not available, slot is already booked or its doctor's lunch time");
        //     $response['status'] = 403;
        // }    
    }
    else
    {
        $output[] = array("errmsg" => 'There is no doctor with this id');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}

//--------------- Custom get patient Rosters --------------//
function patient_rosters()
{
    $connection = db_iconnect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    or die ("could not connect to database");
    // Set default HTTP response of 'ok'
    $response['code'] = 0;
    $response['status'] = 404;
    $response['data'] = NULL;
    $contenttype = 'application/json; charset=utf-8';

    if (isset($_GET['phone'])) 
    {
        $phone = $_GET['phone'];
    } 
    else $phone = "";
    if (isset($_GET['hospital'])) 
    {
        $hospital = $_GET['hospital'];
    } 
    else $hospital = "";
    if(!empty($phone) && !empty($hospital))
    {
        // First Query: Check attender_phone match
        $sqls1 = "SELECT * FROM zcms_patient_rosters
                WHERE hospital = '".$hospital."'
                AND attender_phone LIKE '%".$phone."%'
                AND status = 1
                AND is_deleted = 0";
        $recs_des1 = db_iquery($connection, $sqls1) or die(mysqli_error($connection));
        if(mysqli_num_rows($recs_des1) > 0){
            while ($row = mysqli_fetch_object($recs_des1)) {
                $output[] = $row;
            }
            $response['code'] = 1;
            $response['status'] = 200;
        } 
        else 
        {
            // Second Query: Check phone match if no attender_phone match
            $sqls2 = "SELECT * FROM zcms_patient_rosters
                    WHERE hospital = '".$hospital."'
                    AND phone LIKE '%".$phone."%'
                    AND status = 1
                    AND is_deleted = 0";
            $recs_des2 = db_iquery($connection, $sqls2) or die(mysqli_error($connection));
            if(mysqli_num_rows($recs_des2) > 0){

                while ($row = mysqli_fetch_object($recs_des2)) {
                    $output[] = $row;
                }

                $response['code'] = 1;
                $response['status'] = 200;
            } else {
                $output[] = array("errmsg" => 'no data found');
                $response['status'] = 403;
                $response['code'] = 0;
            }
        }
    }
    else
    {
        $output[] = array("errmsg" => 'Data missed');
        $response['status'] = 403;
    }
    $response['data'] = $output;
    sendResponse($response['status'], json_encode($response), $contenttype);
}





function defa()
{
    echo "welcome to DYNAMIC WEB SERVICE and please give exact action name";
    die;
}

//---------------------SendResponse  is coomon for all----------------------------------

function sendResponse($status = 200, $body = '', $content_type = 'text/html')
{
    $status_header = 'HTTP/1.1 ' . $status . ' ' . getStatusCodeMessage($status);
    header($status_header);
    header('Content-type: ' . $content_type);
    echo $body;
}

function getStatusCodeMessage($status)
{
    // Status code example 
    $codes = Array(
        200 => 'OK',
        301 => 'Moved Permanently',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        408 => 'Request Timeout',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        413 => 'Request Entity Too Large',
        414 => 'Request-URI Too Long',
        415 => 'Unsupported Media Type',
        416 => 'Requested Range Not Satisfiable',
        417 => 'Expectation Failed',
        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Timeout',
        505 => 'HTTP Version Not Supported'
    );
    return (isset($codes[$status])) ? $codes[$status] : '';
}

?>