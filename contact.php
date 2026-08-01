<?php
// database connection code
if(isset($_POST['txtName']))
{
    // $con = mysqli_connect('localhost', 'database_user', 'database_password','database');
    $con = mysqli_connect('localhost', 'root', '','mindcare');

    // get the post records and escape them to prevent SQL syntax errors from single quotes
    $txtName = mysqli_real_escape_string($con, $_POST['txtName']);
    $txtEmail = mysqli_real_escape_string($con, $_POST['txtEmail']);
    $txtMessage = mysqli_real_escape_string($con, $_POST['txtMessage']);

    // database insert SQL code
    $sql = "INSERT INTO `contacts`( `name`, `email`, `message`) VALUES ( '$txtName', '$txtEmail', '$txtMessage')";

    // insert in database 
    $rs = mysqli_query($con, $sql);
    if($rs)
    {
        header("Location: contact.html");
        exit();
    }
}
else
{
    echo "Are you a genuine visitor?";
}
?>