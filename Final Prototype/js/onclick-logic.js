/* 
 * @name onclick-logic.js
 * @author Jeroen Donkers
 * @fileoverview
 * This file handles onclick events of all Ani-Sound elements
*/

// Selecting the document body
$(document).click(function(e) {
	$('#genusfilter').removeClass('filter_open');
	$("#popUp").removeClass("popUp_open");
});

// Deselect genera filter boxes
$("#deselectAllButton").click(function(e) {
	for (var i = 0; i < filtergenera.genera.length; i++)
		document.getElementById(getCheckBoxId(filtergenera.genera[i].name)).checked = false;
	markerCluster.filterOnString();
});
// Select genera filter boxes
$("#selectAllButton").click(function(e) {
	for (var i = 0; i < filtergenera.genera.length; i++)
		document.getElementById(getCheckBoxId(filtergenera.genera[i].name)).checked = true;
	markerCluster.filterOnString();
});

$('#genusfilter').click(function(e) {
	e.stopPropagation();
});

$("#popUp").click(function(e) {
	e.stopPropagation();
});

$('#closeGenusfilterButton').click(function(e) {
	$('#genusfilter').removeClass('filter_open');
});

$("#close").click(function(e) {
	$("#popUp").removeClass("popUp_open");
});

// Clicking on the clear search 'x'
$("#clearSearchIcon").click(function(e) {
	document.getElementById("searchbar").value = '';
	$(':focus').blur();
	markerCluster.filterOnString();
});

// Pressing a key in the search bar
$("#searchbar").keyup(function(e) {
    markerCluster.filterOnString();
});

// Opening about popup
$("#openAboutButton").click(function(e) {
	$('#genusfilter').removeClass('filter_open');
	$("#popUp").addClass("popUp_open");

	$(':focus').blur();
	e.stopPropagation();
});

// Opening genus filter
$('#openGenusfilterButton').click(function(e) {
	$("#popUp").removeClass("popUp_open");
	$('#genusfilter').addClass('filter_open');

	$(':focus').blur();
	e.stopPropagation();
});

function setPlayButtonClickListener() {
	$('#audiobutton').click(function(e) {
		if (document.getElementById('audio').paused) {
			$('#audiobutton').addClass("paused");
			document.getElementById('audio').play();
		}
		else {
			$('#audiobutton').removeClass("paused");
			document.getElementById('audio').pause();
		}
		return false;
	});
}