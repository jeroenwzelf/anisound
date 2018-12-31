var CORS_PROXY = "https://cors.io/?"
var XC_ENDPOINT = "https://www.xeno-canto.org/api/2/recordings";
var PAGE_LIMIT = 2;
var pages_loaded;

var map;
var map_inited = false;

var markerCluster;

function httpGetAsync(url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
	    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	        callback(JSON.parse(xmlHttp.responseText));
	}
	xmlHttp.open("GET", url, true); // true for asynchronous 
	xmlHttp.send(null);
}

// gets all entries from page
function getXenoCantoPages(page) {
	var SW = map.getBounds().getSouthWest();
	var NE = map.getBounds().getNorthEast();
	var query = "?query=" + opt_string.toLowerCase();
	var box = " box:" + SW.lat() + "," + SW.lng() + "," + NE.lat() + "," + NE.lng();
	httpGetAsync(CORS_PROXY + XC_ENDPOINT + query + box + "&page=" + page, function(data) {
		if (pages_loaded < data.numPages && pages_loaded < PAGE_LIMIT) {
			alert(CORS_PROXY + XC_ENDPOINT + query + box + "&page=" + page);
			var markers = [];
			// save current page
			for (var i=0; i < data.recordings.length; i++) {
				var entry = data.recordings[i];
				entry.type = "birds";
				markers.push(getXenoCantoMarkerFromJson(entry));
			}
			markerCluster.addMarkers(markers, true, document.getElementById("searchbar").value);
			pages_loaded++;
			if (!markerCluster.almostFilled()) {
				var rnd; while ((rnd = Math.floor(Math.random() * data.numPages)) == page);
				getXenoCantoPages(rnd);
			}
		}
	});
}

function getXenoCantoEntries() {
	pages_loaded = 0;
	getXenoCantoPages(1);
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
		getXenoCantoEntries(document.getElementById("searchbar").value.toLowerCase());
		window.setInterval(function() {
			getXenoCantoEntries(document.getElementById("searchbar").value.toLowerCase());
		}, 12000);
		var markers = [];
		markerCluster = new MarkerClusterer(map, data, markers);
	});
}

function getTestEntries() {
	var markers = [];
	markers = markers.concat(getBirds(), getFelines(), getPrimates());
	return markers;
}

function getBirds() {
	var markers = [];
	for (var i = 0; i < data.entries.length; i++) {
		if (data.entries[i].type == 'birds') {
		    markers.push(getSampleDataMarkerFromJson(data.entries[i]));
		}
	}
	return markers;
}

function getFelines() {
	var markers = [];
	for (var i = 0; i < data.entries.length; i++) {
		if (data.entries[i].type == 'felines') {
		    markers.push(getSampleDataMarkerFromJson(data.entries[i]));
		}
	}
	return markers;	
}

function getPrimates() {
	var markers = [];
	for (var i = 0; i < data.entries.length; i++) {
		if (data.entries[i].type == 'primates') {
		    markers.push(getSampleDataMarkerFromJson(data.entries[i]));
		}
	}
	return markers;
}

function filter_clicked_birds(cb) {
	if (cb.checked) {
		markerCluster.addMarkers(getBirds());
		getXenoCantoEntries();
	}
	else {
		for (var i = 0, marker; marker = markerCluster.getMarkers()[i]; i++) {
			if (marker.type == 'birds') {
				if (markerCluster.removeMarker(marker)) i--;
			}
		}
	}
}

function filter_clicked_felines(cb) {
	if (cb.checked) {
		markerCluster.addMarkers(getFelines());
	}
	else {
		for (var i = 0, marker; marker = markerCluster.getMarkers()[i]; i++) {
			if (marker.type == 'felines') {
				if (markerCluster.removeMarker(marker)) i--;
			}
		}
	}
}

function filter_clicked_primates(cb) {
	if (cb.checked) {
		markerCluster.addMarkers(getPrimates());
	}
	else {
		for (var i = 0, marker; marker = markerCluster.getMarkers()[i]; i++) {
			if (marker.type == 'primates') {
				if (markerCluster.removeMarker(marker)) i--;
			}
		}
	}
}

function getSpeciesColor(species) {
	switch (species) {
		case "birds": 		return "rgba(198, 200,   0, 1)";
		case "felines": 	return "rgba(235,  63, 119, 1)";
		case "primates": 	return "rgba( 50, 208,  52, 1)";
	}
}