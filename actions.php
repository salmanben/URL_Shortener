<?php
$connect = mysqli_connect("localhost","root","","URL_shortener");
if(!$connect){
    exit;
}
if(isset($_GET['id'])){
    $id = $_GET['id'];
    $sql = "SELECT  url_id , original_url, shorten_url,clicks from url_table  where user_id = '$id' order by url_id desc";
    $result = mysqli_query($connect, $sql);
    $row = mysqli_fetch_All($result, MYSQLI_ASSOC);
    $row = json_encode($row);
    echo $row;
}
if(isset($_GET['checkURL'])){
  $input = file_get_contents("php://input");
  $url = json_decode($input,true);
  $original_url  = mysqli_real_escape_string($connect,$url['url'] );
  if(filter_var($original_url,FILTER_VALIDATE_URL)){
     while(1){
        $shorten_url = substr(md5(microtime()),rand(0,28),5);
        $sql = "SELECT shorten_url from url_table where shorten_url = '$shorten_url'";
        $result = mysqli_query($connect,$sql);
        if(mysqli_num_rows($result) == 0)
            break;
     }
     echo $shorten_url;
  }else{
    echo 'Invalid URL';
  }
}
if(isset($_GET['save'])){
    $id = $_GET['save'];
    $input = file_get_contents("php://input");
    $url = json_decode($input,true);
    $original_url = $url['o_url'];
    $shorten_url = $url['s_url'];
    $sql = "INSERT INTO url_table (user_id, original_url, shorten_url) VALUES ('$id','$original_url', '$shorten_url')";
    $result = mysqli_query($connect, $sql);
    if ($result) {
         $sql = "SELECT url_id from url_table where shorten_url = '$shorten_url' ";
         $result = mysqli_query($connect, $sql);
         echo mysqli_fetch_assoc($result)['url_id'];
    } else {
        echo  0; 
    }
}
if(isset($_GET['delete'])){
    if($_GET['delete'] == 'all'){   
        $id  = $_GET['user_id'];
        $sql = "DELETE FROM URL_table where user_id = '$id'";
        if(mysqli_query($connect,$sql))
            echo 1;
        else
          echo mysqli_error($connect);
    }else{
        $id = $_GET['delete'];
        $sql = "DELETE FROM URL_table where url_id = '$id'";
        if(mysqli_query($connect,$sql))
            echo 1;
        else
           echo 0;
    }

}
if(isset($_GET['checkId'])){
    $id = $_GET['checkId'];
    $sql = "SELECT user_id from url_table where user_id = '$id'";
    $result = mysqli_query($connect, $sql);
    if(mysqli_num_rows($result) > 0){
        echo 0;
    }else{
        echo 1;
    }
}


?>
