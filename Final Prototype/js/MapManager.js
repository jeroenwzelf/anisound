/* 
 * @name QueryManager.js
 * @author Jeroen Donkers
 * @fileoverview
 * This file is responsible for managing the Google Maps map and its entries, including clicking on an entry.
*/

var map;
var markerCluster;

/* -- Initializes the Google Map, sets its custom style,
	  starts up the MarkerClusterer and starts querying for entries -- */
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
		markerCluster = new MarkerClusterer(map);
		GetXenoCantoEntries(1);
	});
}

/* -- Adds click-listeners for the Google Maps Marker
	  (on clicking a marker, it recreates and opens the infoWindow) -- */
function addInfoWindowListeners(infoWindow, marker) {
	google.maps.event.clearListeners(marker, 'click');  // clearing old marker onclick events
	marker.addListener('click', function() {
		infoWindow.setContent(getInnerHtmlInfoWindow(marker));
		infoWindow.open(this.getMap(), this);

		google.maps.event.clearListeners(infoWindow, 'domready');
		google.maps.event.addListener(infoWindow,'domready', function() {
			LoadEntryImage(infoWindow.anchor.name_la);
			LoadFlag(infoWindow.anchor.country);
			document.getElementById("EntryName").style.backgroundColor = getColor(infoWindow.anchor.gen);
			setPlayButtonListeners();
		});
	});
}

/* -- Loads a random image of an entry and views it in the infoWindow -- */
function LoadEntryImage(tag) {
	$.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	{
		tags: tag,
		tagmode: "any",
		format: "json"
	},
	function(data) {
		var rnd = Math.floor(Math.random() * data.items.length);
		var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
		document.getElementById("EntryImg").src = image_src;
	});
}

/* -- Loads the country's flag and views it in the infoWindow -- */
function LoadFlag(country) {
	var flag_api_endpoint = "https://restcountries.eu/rest/v2/name/";
	httpGetAsync(flag_api_endpoint + country, function(data) {
		document.getElementById("EntryFlag").src = "https://www.countryflags.io/" + data[0].alpha2Code + "/shiny/64.png";
	});
}