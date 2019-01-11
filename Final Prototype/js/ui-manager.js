/* 
 * @name ui-manager.js
 * @author Jeroen Donkers
 * @fileoverview
 * This file initializes the Google Map and will repeatedly query the xeno-canto API for new entries.
 * It also draws the entry icons, and is responsible for filling the genus filter with the list of genera + checkboxes,
 * and its corresponding functionality. It also implements the loading spinner when this script is querying xeno-canto entries.
*/

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
				'<input id="' + getCheckBoxId(genus) + '" type="checkbox" onclick="markerCluster.filterOnString()" class="invisible" checked>'+
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

function getInnerHtmlInfoWindow(marker) {
	var innerHtml =
	'<div id="container">'+
		'<div id="EntryTop">'+
			'<div id="EntryName">'+
				'<span>' + marker.name_en + '</span>'+
			'</div>'+
			'<div style="flex: auto"></div>'+
			'<div id="EntryPlay">'+
				'<button id="audiobutton" class="button paused" type="button"></button>'+
			'</div>'+
		'</div>'+
		'<div id="EntrySub">'+
			'<span>' + marker.name_la + '</span>'+
		'</div>'+
		'<div id="EntryImgBox">'+
			'<img id="EntryImg" alt="(Loading image of ' + marker.name_en + ')" height="200">' +
		'</div>'+
		'<div id="EntryLocation">'+
			'<div style=align-self: center;>'+
				'<img id="EntryFlag" height="20">'+
			'</div>'+
			'<div id="EntryLoc">'+
				'<span>' + marker.loc + '</span>'+
			'</div>'+
		'</div>'+
		'<audio id="audio" autoplay> <source src="' + marker.url + '" type="audio/mpeg"></audio>'+
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

/* -- Returns the color of a specific genus -- */
function getColor(genus) {
	for (var i = 0; i < filtergenera.genera.length; i++)
		if (genus.toLowerCase() == filtergenera.genera[i].name.toLowerCase())
			return filtergenera.genera[i].color;
	return document.getElementById(getColorDivId("Other")).style.borderLeftColor;
}

function getSearchBarContent() {
	return document.getElementById("searchbar").value;
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

/* -- Returns the ID of genera checkboxes -- */
function getColorDivId(genus) { return 'colordiv_' + getCheckBoxId(genus); }
function getCheckBoxId(genus) { return genus.toLowerCase() + 'cbx'; }