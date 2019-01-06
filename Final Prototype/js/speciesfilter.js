var CORS_PROXY = "https://cors.io/?"
var XC_ENDPOINT = "https://www.xeno-canto.org/api/2/recordings";
var httprequest_old = false;

var map;
var map_inited = false;

var markerCluster;

function enableLoad(name, gen) {
	var loader = document.getElementById("loader");
	if (gen.length > 0) gen = " (" + gen + ")";
	loader.style.display = "block";
	loader.title = "Ani-Sound is currently loading " + name + gen + " entries from the online Xeno-canto database.";
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
	xmlHttp.open("GET", url, true); // true for asynchronous 
	xmlHttp.send(null);
}

function getQueryGen() {
	var enabledGenera = getAllEnabledGenera();
	if (enabledGenera.indexOf("Other") > -1) return "";
	var rnd = Math.floor(Math.random() * enabledGenera.length);
	return " gen:" + enabledGenera[rnd];
}

function getGen(queryGen) {
	if (queryGen.length > 0) return queryGen.split(':')[1];
	return "";
}

function XenoCantoEntryThread(page) {
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

function getSampleDataMarkerFromJson(dataEntry) {
	var marker = new google.maps.Marker({
    	name_en: dataEntry.en,
    	name_la: dataEntry.gen + " " + dataEntry.sp,
    	gen: dataEntry.gen,
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
		document.getElementById("loader").style.display = "block";
		XenoCantoEntryThread(1);
	});
}

function getInnerHtmlFilterList() {
	var innerHTML = "";
	for (var i = 0; i < filtergenera.genera.length; i++)
    	innerHTML = innerHTML + getInnerHtmlFilterCheckBox(filtergenera.genera[i].name);
	document.getElementById('genuslist').innerHTML = innerHTML;
	for (var i = 0; i < filtergenera.genera.length; i++)
		document.getElementById(getColorDivId(filtergenera.genera[i].name)).style.borderLeftColor = filtergenera.genera[i].color;
}

function getInnerHtmlFilterCheckBox(genus) {
	var innerHtml =
	'<div style="padding: 5px 15px;">'+
		'<div style="height: 35px; display: flex; flex-flow: column; justify-content: center; border-left: 6px solid black; padding: 0px 15px;" id = "' + getColorDivId(genus) + '">'+
			'<label for="' + getCheckBoxId(genus) + '" class="label-cbx">'+
				'<input id="' + getCheckBoxId(genus) + '" type="checkbox" onclick="filter_clicked(this)" class="invisible" checked>'+
				'<div class="checkbox">'+
					'<svg width="60px" height="60px" viewBox="0 0 40 40">'+
						'<path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>'+
						'<polyline points="4 11 8 15 16 6"></polyline>'+
					'</svg>'+
				'</div>'+
				'<div class="cbxlabel" style="height: 30px; display: table; padding-left: 10px"> <p style="display: table-cell; text-align: center; vertical-align: middle;">' + genus + '</p></div>'+
			'</label>'+
		'</div>'+
	'</div>';
	return innerHtml;
}

function getAllEnabledGenera() {
	var genera = [];
	for (var i = 0; i < filtergenera.genera.length; i++) {
		var genname = filtergenera.genera[i].name;
		if (document.getElementById(getCheckBoxId(genname)).checked)
			genera.push(genname);
	}
	return genera;
}

function getColorDivId(genus) { return 'colordiv_' + getCheckBoxId(genus); }
function getCheckBoxId(genus) { return genus.toLowerCase() + 'cbx'; }

function filter_clicked(cb) {
	markerCluster.filterOnString();
}

function getColor(genus) {
	for (var i = 0; i < filtergenera.genera.length; i++)
		if (genus.toLowerCase() == filtergenera.genera[i].name.toLowerCase())
			return filtergenera.genera[i].color;
	return document.getElementById(getColorDivId("Other")).style.borderLeftColor;
}