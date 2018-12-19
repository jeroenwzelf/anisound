function getStyledMap() {
	return new google.maps.StyledMapType(
	[
		{
			"featureType": "all",
			"elementType": "labels.text",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "simplified"
			}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "labels.icon",
			"stylers": [
			{
				"visibility": "simplified"
			},
			{
				"lightness": "52"
			}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape.man_made",
			"elementType": "geometry.fill",
			"stylers": [
			{
				"color": "#ffffff"
			},
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "geometry.fill",
			"stylers": [
			{
				"color": "#f5f5f2"
			},
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape.natural.landcover",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape.natural.landcover",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "landscape.natural.terrain",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "on"
			},
			{
				"weight": "10.00"
			}
			]
		},
		{
			"featureType": "poi",
			"elementType": "labels.icon",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.attraction",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.business",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.government",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.medical",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "all",
			"stylers": [
			{
				"color": "#91b65d"
			},
			{
				"gamma": 1.51
			}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "labels.icon",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.place_of_worship",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.school",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.sports_complex",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "poi.sports_complex",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#c7c7c7"
			},
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "road",
			"elementType": "all",
			"stylers": [
			{
				"color": "#ffffff"
			},
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#ffffff"
			},
			{
				"visibility": "simplified"
			}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels.icon",
			"stylers": [
			{
				"color": "#ffffff"
			},
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "road.arterial",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "simplified"
			},
			{
				"color": "#ffffff"
			}
			]
		},
		{
			"featureType": "road.arterial",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "simplified"
			}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "all",
			"stylers": [
			{
				"color": "#ffffff"
			},
			{
				"visibility": "simplified"
			}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "on"
			}
			]
		},
		{
			"featureType": "transit",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		},
		{
			"featureType": "water",
			"elementType": "all",
			"stylers": [
			{
				"color": "#a0d3d3"
			},
			{
				"visibility": "on"
			}
			]
		}
	],
		{ name: 'Styled map' }
	);
}