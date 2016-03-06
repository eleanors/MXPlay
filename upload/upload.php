<?php

header('Content-Type:text/html;charset=utf-8');
$second_file = $_FILES['file']; 
$uploads_dir = '/mxplay/upload';
if ($second_file['error'] == UPLOAD_ERR_OK){
    $temp_name = $second_file['tmp_name'];
    $file_name = $second_file['name'];
    move_uploaded_file($temp_name, $file_name);
    echo '上传成功';
}else {
    echo '上传失败';
}
?>