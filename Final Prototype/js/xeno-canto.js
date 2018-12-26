/*
 * xeno-canto
 * 
 *
 * Copyright (c) 2013 Patrick De Marta
 * Licensed under the GNU GPL license.
 */

/** @constructor */
function XenoCanto(){
	this.entity = {};
};


/** Search for name of advanced options*/
XenoCanto.prototype.search = function(query, success){
	if (!!query) {
		var url = 'http://www.xeno-canto.org/api/2/recordings?query=';

		// Duck-typing args
		if (typeof(query) === 'string') {
	
			// Normal query search name in English, Latin, Family latin
			url = url + query;	 

		} else if (typeof(query) === 'object')  {
			/*
			Advanced search parameters:
			---------------------------
			Genus gen:zonotrichia
			Recordist rec:John
			Country cnt:brazil.
			Location loc:tambopata.
			Recordist Remarks rmk:playback 
			Geographic Coordinates
				lat, lon
				box:LAT_MIN,LON_MIN,LAT_MAX,LON_MAX
			Background Species also:formicariidae
			Sound type type:song
			Catalog number nr:76967 or range: nr:88888-88890
			Recording Quality
				q:A will return recordings with a quality rating of A.
				q<:C will return recordings with a quality rating of D or E.
			World area area:africa (, america, asia, australia, europe)
			*/
			var getCoords = function() {
				if (!!query.coords) {
					if (!!query.coords.lat && !!query.coords.lon) {
						return 'lat:' + query.coords.lat + 'lon:' + query.coords.lon
					} else if (!!query.coords.box) {
						/** TODO box coordinates*/
					};
				};
			};
		
			var params_string = '';
			var params = [
				{ name:"" },
				{ genus: 'gen:' },
				{ recordist: 'rec:' },
				{ country: 'cnt:' },
				{ location: 'loc:' },
				{ remarks: 'rmk:' },
				{ coords: getCoords() },
				{ also:'also:' },
				{ type: 'type:' },
				{ nr: 'nr:' },
				{ quality: 'q:' },
				{ qualitylt: 'q<:' },
				{ area: 'area:' }
			];

			params.map(function(p){
				var key = Object.keys(p)[0];
				if (!!query[key]) {
					params_string = params_string + p[key] + query[key] + " ";
				};
			});
				url = url + params_string;
			};

		// Make the request
		get(this, url, success);

	} else {
		throw("Null Query Error.")
	}
};

function get(that, url, success){

    var opts = {
        url: url,
        method: 'GET',
        timeout: (10*1000),
        headers:
        {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163 Safari/537.36'
        }
    };

    request(opts, function (err, res, url) {
        // store response in instance var
        that.entity = JSON.parse(res.body);
        success(that);
	});
	
}


module.exports = XenoCanto;