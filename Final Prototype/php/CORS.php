<?php
/*
	$url = 'https://www.xeno-canto.org/api/2/recordings';
	$query = urlencode($_GET['query']));    //Need to url encode
	$response = file_get_contents($url .'?query=' .$song);

	echo json_encode($response); //Return the response back to AJAX, assuming it is already returned as JSON. Else encode it json_encode($response)
*/

	$json_url = "https://localhost:8666/web1/popupData/dataWeekly.php";  
	$crl = curl_init();
	curl_setopt($crl, CURLOPT_URL, $json_url);
	curl_setopt($crl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, FALSE); 
	$json = curl_exec($crl);
	curl_close($crl);
	$emp = json_decode($json, TRUE);

?>