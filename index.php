<?php
$connect = mysqli_connect("localhost","root","","URL_shortener");
if(!$connect){
    die("Error: ". mysqli_connect_error());
}
$sql_total_clicks = "SELECT IFNULL(SUM(clicks),0) as s from url_table";
$result_total_clicks = mysqli_query($connect,$sql_total_clicks);
$total_clicks  = mysqli_fetch_assoc($result_total_clicks)['s'];
$sql_total_links = "SELECT IFNULL(count(shorten_url),0) as c from url_table";
$result_total_links = mysqli_query($connect,$sql_total_links);
$total_links  = mysqli_fetch_assoc($result_total_links)['c'];

if(isset($_GET['u'])){
    $shorten_url = $_GET['u'];
    $sql = "UPDATE URL_table  set clicks = clicks + 1 where shorten_url = '$shorten_url'";
    $result= mysqli_query($connect,$sql);
    $sql = "SELECT original_url from url_table where shorten_url = '$shorten_url'";
    $result= mysqli_query($connect,$sql);
    $original_url = mysqli_fetch_assoc($result)['original_url'];
    header("location:".$original_url);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="icon" href="logo.png">
    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>
    <title>URL Shortener</title>
</head>
<body>
    <div class="main">
        <div class="url-form">
            <input type="url" name="url" placeholder="Enter your URL here" id="original-URL-input">
            <button id="shorten">Shorten</button>
        </div>
        <div class="total-clearAll">
            <p>Total Links:<span id="total-links"><?php echo $total_links ?></span>
            & Toatl Clicks:<span id="total-clicks"><?php echo $total_clicks ?></span></p>
            <button class="" id="delete-all">Delete All</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Original URL</th>
                    <th>Shorten URL</th>
                    <th>Clicks</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody id="container">

            </tbody>
        </table>
    </div>
    <div class="wrapper">
        <span class="close">x</span>
        <p class="message success">
           Your shortened link is ready. You can now copy and save it.
        </p>
        <div class="url-form">
            <label for="shorten-URL-input">your shorten URL</label>
            <div>
                <input type="url" name="" id="shorten-URL-input"  disabled>
                <img src="copy.png" id = "copy" alt="">
            </div>
            <button id="save">Save</button>
        </div>
    </div>
</body>
</html>