/* 
 * @name ui-manager.js
 * @author Jeroen Donkers
 * @fileoverview
 * This file initializes the Google Map and will repeatedly query the xeno-canto API for new entries.
 * It also draws the entry icons, and is responsible for filling the genus filter with the list of genera + checkboxes,
 * and its corresponding functionality. It also implements the loading spinner when this script is querying xeno-canto entries.
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


/* -- Creates the inner HTML for the Genus Filter -- */
function getInnerHtmlFilterList() {
	var innerHTML = "";
	for (var i = 0; i < filtergenera.genera.length; i++)
    	innerHTML = innerHTML + getInnerHtmlFilterCheckBox(filtergenera.genera[i].name);
	document.getElementById('genuslist').innerHTML = innerHTML;
	for (var i = 0; i < filtergenera.genera.length; i++)
		document.getElementById(getColorDivId(filtergenera.genera[i].name)).style.borderLeftColor = filtergenera.genera[i].color;
}

/* -- Creates the inner HTML for one Genus Filter checkbox -- */
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

/* -- Returns a list of all genera checkboxes that are enabled -- */
function getAllEnabledGenera() {
	var genera = [];
	for (var i = 0; i < filtergenera.genera.length; i++) {
		var genname = filtergenera.genera[i].name;
		if (document.getElementById(getCheckBoxId(genname)).checked)
			genera.push(genname);
	}
	return genera;
}

/* -- Returns the ID of genera checkboxes -- */
function getColorDivId(genus) { return 'colordiv_' + getCheckBoxId(genus); }
function getCheckBoxId(genus) { return genus.toLowerCase() + 'cbx'; }

/* -- Happens when a genus checkbox is clicked -- */
function filter_clicked(cb) {
	markerCluster.filterOnString();
}

/* -- Returns the color of a specific genus -- */
function getColor(genus) {
	for (var i = 0; i < filtergenera.genera.length; i++)
		if (genus.toLowerCase() == filtergenera.genera[i].name.toLowerCase())
			return filtergenera.genera[i].color;
	return document.getElementById(getColorDivId("Other")).style.borderLeftColor;
}

/* -- Enables query loading spinner -- */
function enableLoad(name, gen) {
	var loader = document.getElementById("loader");
	if (gen.length > 0) gen = " (" + gen + ")";
	loader.style.display = "block";
	loader.title = "Ani-Sound is currently loading " + name + gen + " entries from the online Xeno-canto database.";
}

/* -- Disables query loading spinner -- */
function disableLoad() {
	document.getElementById("loader").style.display = "none";
}