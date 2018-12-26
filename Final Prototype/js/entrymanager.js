function getXenoCantoEntries(bounds) {
	var xeno_canto_endpoint = "https://www.xeno-canto.org/api/2/recordings";
	var SW = bounds.getSouthWest();
	var NE = bounds.getNorthEast();
	var query = "?query=box:" + SW.lat() + "," + SW.lng() + "," + NE.lat() + "," + NE.lng();
	
	/*$.getJSON(xeno_canto_endpoint + query, {},
    function(data) {
    	alert(data);
        var rnd = Math.floor(Math.random() * data.items.length);
        var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
        document.getElementById("entryImg").src = image_src;
    });*/
    var query = {
    	box: SW.lat() + "," + SW.lng() + "," + NE.lat() + "," + NE.lng()
    };

    var xmlhttp = new XMLHttpRequest();
	var url = xeno_canto_endpoint + query;

	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var myArr = JSON.parse(this.responseText);
	        alert(myArr);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function getBirds() {
	var markers = [];
	for (var i = 0; i < data.count; i++) {
		if (data.entries[i].type == 'birds') {
		    markers.push(getMarkerFromJson(data.entries[i]));
		}
	}
	return markers;
}

function getFelines() {
	var markers = [];
	for (var i = 0; i < data.count; i++) {
		if (data.entries[i].type == 'felines') {
		    markers.push(getMarkerFromJson(data.entries[i]));
		}
	}
	return markers;	
}

function getPrimates() {
	var markers = [];
	for (var i = 0; i < data.count; i++) {
		if (data.entries[i].type == 'primates') {
		    markers.push(getMarkerFromJson(data.entries[i]));
		}
	}
	return markers;
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

function getMarkerFromJson(dataEntry) {
	var marker = new google.maps.Marker({
    	name_en: dataEntry.en,
    	name_la: dataEntry.gen + " " + dataEntry.sp,
    	type: dataEntry.type,
    	country: dataEntry.cnt,
    	loc: dataEntry.loc,
    	url: dataEntry.url,
    	animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(dataEntry.latitude,
	    	dataEntry.longitude),
        icon: getMarkerIcon(dataEntry)
	});
	return marker;
}

class EntryManager {
	constructor(mapstyle) {
		var center = new google.maps.LatLng(37.4419, -122.1419);
		this.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 3,
			center: center,
			mapTypeId: [ google.maps.MapTypeId.ROADMAP, 'styled_map' ]
		});
		this.map.mapTypes.set('styled_map', mapstyle);
		this.map.setMapTypeId('styled_map');

		google.maps.event.addListenerOnce(this.map, 'bounds_changed', function() {
			alert(this.bounds_changed_happened_it);
			var markers = [];
			markers = markers.concat(getXenoCantoEntries(this.getBounds()), getBirds(), getFelines(), getPrimates());
			this.markerCluster = new MarkerClusterer(this, data, markers);
		});
	}

	filter_clicked_birds(cb) {
		if (cb.checked) {
			this.markerCluster.addMarkers(this.getBirds());
		}
		else {
			for (var i = 0, marker; marker = this.markerCluster.getMarkers()[i]; i++) {
				if (marker.type == 'birds') {
					if (this.markerCluster.removeMarker(marker)) i--;
				}
			}
		}
	}

	filter_clicked_felines(cb) {
		if (cb.checked) {
			this.markerCluster.addMarkers(this.getFelines());
		}
		else {
			for (var i = 0, marker; marker = this.markerCluster.getMarkers()[i]; i++) {
				if (marker.type == 'felines') {
					if (this.markerCluster.removeMarker(marker)) i--;
				}
			}
		}
	}

	filter_clicked_primates(cb) {
		if (cb.checked) {
			this.markerCluster.addMarkers(this.getPrimates());
		}
		else {
			for (var i = 0, marker; marker = this.markerCluster.getMarkers()[i]; i++) {
				if (marker.type == 'primates') {
					if (this.markerCluster.removeMarker(marker)) i--;
				}
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