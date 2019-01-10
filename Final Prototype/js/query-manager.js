/* 
 * @name query-manager.js
 * @author Jeroen Donkers
 * @fileoverview
 * This file has functionality to repeatedly query the xeno-canto API for new entries.
*/

var CORS_PROXY = "https://cors.io/?"
var XC_ENDPOINT = "https://www.xeno-canto.org/api/2/recordings";
var httprequest_old = false;

/* -- Performs an asynchronous http request -- */
function httpGetAsync(url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
	    if (xmlHttp.readyState == 4) {
	    	disableLoad();
	    	if (xmlHttp.status == 200) callback(JSON.parse(xmlHttp.responseText));
	    	else callback(null);
		}
	}
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

/* -- A sophisticated algorithm ensuring that entries get loaded from the
	  xeno-canto API. It continuously requests pages from the API and it
	  updates its query using the current Map viewport, the searchbar contents
	  and the selected genera in the genus filter. -- */
function GetXenoCantoEntries(page) {
	var SW = map.getBounds().getSouthWest();
	var NE = map.getBounds().getNorthEast();
	var box = " box:" + SW.lat() + "," + SW.lng() + "," + NE.lat() + "," + NE.lng();
	var query = "?query=" + document.getElementById("searchbar").value;
	var gen = getQueryGen();

	var httprequest = CORS_PROXY + XC_ENDPOINT + query + box + gen;
	if (!httprequest_old) httprequest_old = httprequest;
	enableLoad(document.getElementById("searchbar").value, getGen(gen));
	httpGetAsync(httprequest + "&page=" + page, function(data) {
		var nextpage = page+1;
		if (data != null) {
			var markers = [];
			for (var i=0, dataEntry; dataEntry = data.recordings[i]; i++) {
				dataEntry.type = "birds";
				markers.push(getXenoCantoMarkerFromJson(dataEntry));
			}
			markerCluster.addMarkers(markers, true, document.getElementById("searchbar").value.toLowerCase());
			if (httprequest != httprequest_old || nextpage >= data.numPages) nextpage = 1;
		}
		else nextpage = 1;
		httprequest_old = httprequest;
		GetXenoCantoEntries(nextpage);
	});
}

/* -- Creates a Google Maps Marker for dataEntry -- */
function getXenoCantoMarkerFromJson(dataEntry) {
	var marker = new google.maps.Marker({
    	name_en: dataEntry.en,
    	name_la: dataEntry.gen + " " + dataEntry.sp,
    	gen: dataEntry.gen,
    	type: dataEntry.type,
    	country: dataEntry.cnt,
    	loc: dataEntry.loc,
    	url: "https://" + dataEntry.file.slice(2),
    	animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(dataEntry.lat,
	    	dataEntry.lng),
        icon: getMarkerIcon(dataEntry)
	});
	return marker;
}

/* -- Creates a 2D icon for dataEntry. -- */
function getMarkerIcon(dataEntry) {
	var width = 50; var height = 50; var radius = 20; var imgscale = 15;
	var canvas, context;

	// Creating canvas
	canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	// Create white background
	context = canvas.getContext("2d");
	context.clearRect(0, 0, width, height);

	// Create colored circle
	context.fillStyle = "rgba(255, 255, 255, 1)";
	context.strokeStyle = getColor(dataEntry.gen);
	context.lineWidth = 4;
	context.beginPath();
	context.arc(width/2, height/2, radius, 0, 2*Math.PI);
	context.closePath();

	// Draw context
	context.fill();	// background
	context.drawImage(document.getElementById(dataEntry.type), imgscale/2, imgscale/2, width-imgscale, height-imgscale);	// image
	context.stroke();	// colored circle

	return canvas.toDataURL();
}

/* -- Sets up the genus query parameter -- */
function getQueryGen() {
	var enabledGenera = getAllEnabledGenera();
	if (enabledGenera.indexOf("Other") > -1) return "";
	var rnd = Math.floor(Math.random() * enabledGenera.length);
	return " gen:" + enabledGenera[rnd];
}

/* -- Gets the genus from a certain genus query parameter -- */
function getGen(queryGen) {
	if (queryGen.length > 0) return queryGen.split(':')[1];
	return "";
}