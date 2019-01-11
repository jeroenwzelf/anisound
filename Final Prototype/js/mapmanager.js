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
      (on clicking a marker, it initializes the infoWindow) -- */
function addPopupWindowListeners(infoWindow, marker) {
  google.maps.event.clearListeners(marker, 'click');  // clearing old marker onclick events
  marker.addListener('click', function() {
    infoWindow.setContent(getInnerHtmlInfoWindow(marker));
    infoWindow.open(this.getMap(), this);

    google.maps.event.clearListeners(infoWindow, 'domready');
    google.maps.event.addListener(infoWindow,'domready', function() {
      // Get image
      $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
      {
          tags: infoWindow.anchor.name_la,
          tagmode: "any",
          format: "json"
      },
      function(data) {
          var rnd = Math.floor(Math.random() * data.items.length);
          var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
          document.getElementById("EntryImg").src = image_src;
      });

      // Get flag
      var flag_api_endpoint = "https://restcountries.eu/rest/v2/name/";
      httpGetAsync(flag_api_endpoint + marker.country, function(data) {
        document.getElementById("EntryFlag").src = "https://www.countryflags.io/" + data[0].alpha2Code + "/shiny/64.png";
      });

      // set titlebar background color
      document.getElementById("EntryName").style.backgroundColor = getColor(infoWindow.anchor.gen);

      // set audio ended eventlistener
      document.getElementById('audio').addEventListener('ended', function() {
        $('#audiobutton').removeClass("paused");
      });

      setPlayButtonClickListener();
    });
  });
}