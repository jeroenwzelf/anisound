var CORS_PROXY = "https://cors.io/?"
var XC_ENDPOINT = "https://www.xeno-canto.org/api/2/recordings";
var httprequest_old = false;

var map;
var map_inited = false;

var markerCluster;

function enableLoad() {
	document.getElementById("loader").style.display = "block";
}

function disableLoad() {
	document.getElementById("loader").style.display = "none";
}

function httpGetAsync(url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
	    if (xmlHttp.readyState == 4) {
	    	disableLoad();
	    	if (xmlHttp.status == 200) callback(JSON.parse(xmlHttp.responseText));
	    	else callback(null);
		}
	}
	enableLoad();
	xmlHttp.open("GET", url, true); // true for asynchronous 
	xmlHttp.send(null);
}

function XenoCantoEntryThread(page) {
	var SW = map.getBounds().getSouthWest();
	var NE = map.getBounds().getNorthEast();
	var box = " box:" + SW.lat() + "," + SW.lng() + "," + NE.lat() + "," + NE.lng();
	var query = "?query=" + document.getElementById("searchbar").value;
	var httprequest = CORS_PROXY + XC_ENDPOINT + query + box;
	if (!httprequest_old) httprequest_old = httprequest;
	httpGetAsync(httprequest + "&page=" + page, function(data) {
		var nextpage = page+1;
		if (data != null) {
			var markers = [];
			for (var i=0; i<data.recordings.length; i++) {
				var entry = data.recordings[i];
				entry.type = "birds";
				markers.push(getXenoCantoMarkerFromJson(entry));
			}
			markerCluster.addMarkers(markers, true, document.getElementById("searchbar").value.toLowerCase());
			if (httprequest != httprequest_old || nextpage >= data.numPages) nextpage = 1;
		}
		else nextpage = 1;
		httprequest_old = httprequest;
		XenoCantoEntryThread(nextpage);
	});
}

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
	context.strokeStyle = getSpeciesColor(dataEntry.type);
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

function getSampleDataMarkerFromJson(dataEntry) {
	var marker = new google.maps.Marker({
    	name_en: dataEntry.en,
    	name_la: dataEntry.gen + " " + dataEntry.sp,
    	type: dataEntry.type,
    	country: dataEntry.cnt,
    	loc: dataEntry.loc,
    	url: dataEntry.file.slice(2),
    	animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(dataEntry.lat,
	    	dataEntry.lng),
        icon: getMarkerIcon(dataEntry)
	});
	return marker;
}

function getXenoCantoMarkerFromJson(dataEntry) {
	var marker = new google.maps.Marker({
    	name_en: dataEntry.en,
    	name_la: dataEntry.gen + " " + dataEntry.sp,
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

function init_map(mapstyle) {
	var center = new google.maps.LatLng(37.4419, -122.1419);
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: center,
		mapTypeId: 'styled_map',
		mapTypeControl: false
	});
	map.mapTypes.set('styled_map', mapstyle);
	map.setMapTypeId('styled_map');

	google.maps.event.addListener(map,'tilesloaded', function () {
		google.maps.event.clearListeners(map, 'tilesloaded');
		var markers = [];
		markerCluster = new MarkerClusterer(map, data, markers);
		XenoCantoEntryThread(1);
	});
}

function filter_clicked_birds_(cb) {
	if (cb.checked) {
		
	}
	else {
		for (var i = 0, marker; marker = markerCluster.getMarkers()[i]; i++) {
			if (marker.type == "birds") {
				if (markerCluster.removeMarker(marker)) i--;
			}
		}
	}
}

function filter_clicked_felines_(cb) {
	
}

function filter_clicked_primates_(cb) {
	
}

function getSpeciesColor(species) {
	switch (species) {
		case "birds": 		return "rgba(198, 200,   0, 1)";
		case "felines": 	return "rgba(235,  63, 119, 1)";
		case "primates": 	return "rgba( 50, 208,  52, 1)";
	}
}