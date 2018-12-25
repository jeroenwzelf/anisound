class MapManager {
	constructor(mapstyle) {
		var center = new google.maps.LatLng(37.4419, -122.1419);
		this.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 3,
			center: center,
			mapTypeId: [ google.maps.MapTypeId.ROADMAP, 'styled_map' ]
		});
		this.map.mapTypes.set('styled_map', mapstyle);
		this.map.setMapTypeId('styled_map');

		var markers = [];
		markers = markers.concat(this.getBirds(), this.getFelines(), this.getPrimates());
		this.markerCluster = new MarkerClusterer(this.map, data, markers);
	}

	getBirds() {
		var markers = [];
		for (var i = 0; i < data.count; i++) {
			if (data.entries[i].type == 'birds') {
			    markers.push(this.getMarkerFromJson(data.entries[i]));
			}
		}
		return markers;
	}

	getFelines() {
		var markers = [];
		for (var i = 0; i < data.count; i++) {
			if (data.entries[i].type == 'felines') {
			    markers.push(this.getMarkerFromJson(data.entries[i]));
			}
		}
		return markers;	
	}

	getPrimates() {
		var markers = [];
		for (var i = 0; i < data.count; i++) {
			if (data.entries[i].type == 'primates') {
			    markers.push(this.getMarkerFromJson(data.entries[i]));
			}
		}
		return markers;
	}

	getMarkerFromJson(dataEntry) {
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
	        icon: this.getMarkerIcon(dataEntry)
		});
		return marker;
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

	getMarkerIcon(dataEntry) {
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
}

function getSpeciesColor(species) {
	switch (species) {
		case "birds": 		return "rgba(198, 200,   0, 1)";
		case "felines": 	return "rgba(235,  63, 119, 1)";
		case "primates": 	return "rgba( 50, 208,  52, 1)";
	}
}