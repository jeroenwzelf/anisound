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
	    	icon: dataEntry.ico,
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
		var profileImg = new Image();
		profileImg.src = dataEntry.ico;

		var canvas, context;
		var width = 50; var height = 50; var radius = 20;

		var color = getSpeciesColor(dataEntry.type);

		canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		
		context = canvas.getContext("2d");
		context.clearRect(0, 0, width, height);
		context.fillStyle = "rgba(255, 255, 255, 1)";
		context.strokeStyle = color;

		context.beginPath();
		context.arc(width/2, height/2, radius, 0, 2*Math.PI);
		context.closePath();

		context.fill();
		context.drawImage(profileImg, 3, 3, width-6, height-6);
		context.lineWidth=3;
		context.stroke();

		return canvas.toDataURL();
	}
}

function openSpeciesFilter() {
	document.getElementById("speciesfilter").style.width = "20%";
	document.getElementById("speciesfilter").style.left = "0%";
}

function closeSpeciesFilter() {
	document.getElementById("speciesfilter").style.left = "-20%";
}

function getSpeciesColor(species) {
	switch (species) {
		case "birds": 		return "rgba(255, 0, 0, 1)";
		case "felines": 	return "rgba(0, 255, 0, 1)";
		case "primates": 	return "rgba(0, 0, 255, 1)";
	}
}