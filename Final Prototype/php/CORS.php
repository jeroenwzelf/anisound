<?php
	$url = 'https://www.xeno-canto.org/api/2/recordings';
	$query = urlencode($_GET['query']));    //Need to url encode
	$response = file_get_contents($url .'?query=' .$song);

	echo json_encode($response); //Return the response back to AJAX, assuming it is already returned as JSON. Else encode it json_encode($response)
?>