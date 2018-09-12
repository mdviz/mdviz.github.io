function processCSV(data) {
  var allTextLines = data.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];
  for (var i=1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {

      // Create an object for each row
      var tarr = {};
      for (var j = 0; j < headers.length; j++) {
        var h = headers[j].replace(/"/g, '');
        var v = data[j].replace(/"/g, '');
        tarr[h] = v;
      }

      // Push each JSON to a list
      lines.push(tarr);
    } else {
      // console.log('Headers may be Length Longer than Cols - check if error')
    }

  }
  return lines;
}

function addCountyToMap(map) {
  $.ajax({
    type: 'GET',
    url: 'data/' + targetSiteId + '/county.json',
    dataType: 'json',
    success: function(data) {
      var county = L.geoJSON(data, {
          fillColor: 'black',
          weight: 2,
          opacity: 1,
          color: 'black',
          fillOpacity: 0
      });    
      county.addTo(map);
    }
  });
}


// Code to Set Center
// function rad2degr(rad) { return rad * 180 / Math.PI; }
// function degr2rad(degr) { return degr * Math.PI / 180; }
// function getLatLngCenter(latLngInDegr) {
//     var LATIDX = 0;
//     var LNGIDX = 1;
//     var sumX = 0;
//     var sumY = 0;
//     var sumZ = 0;

//     for (var i=0; i<latLngInDegr.length; i++) {
//         var lat = degr2rad(latLngInDegr[i][LATIDX]);
//         var lng = degr2rad(latLngInDegr[i][LNGIDX]);
//         // sum of cartesian coordinates
//         sumX += Math.cos(lat) * Math.cos(lng);
//         sumY += Math.cos(lat) * Math.sin(lng);
//         sumZ += Math.sin(lat);
//     }

//     var avgX = sumX / latLngInDegr.length;
//     var avgY = sumY / latLngInDegr.length;
//     var avgZ = sumZ / latLngInDegr.length;

//     // convert average x, y, z coordinate to latitude and longtitude
//     var lng = Math.atan2(avgY, avgX);
//     var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
//     var lat = Math.atan2(avgZ, hyp);

//     return ([rad2degr(lat), rad2degr(lng)]);
// }


var mbAccessToken = 'pk.eyJ1IjoiZGF0YWtpbmQiLCJhIjoiY2pkeG94d2g3MDF1NzJ3cWZyODVpeng1aCJ9.ZQtsFRL8ZroMrlUrmyGM9g';
var leafletAccessURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mbAccessToken;
var mapAttr = ('Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>');

var leafletLayer_Streets = L.tileLayer(leafletAccessURL, {
  attribution: mapAttr,
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: mbAccessToken,
});

var leafletLayer_Satellite = L.tileLayer(leafletAccessURL, {
  attribution: mapAttr,
  maxZoom: 18,
  id: 'mapbox.satellite',
  accessToken: mbAccessToken,
});


// Add the satellite to the map as the default
leafletLayer_Streets.addTo(mainMap);

// Add the new layers to the map as a layer manager as well
var baseMapChoice = L.control.layers({
  'Streets': leafletLayer_Streets,
  'Satellite': leafletLayer_Satellite,
})
baseControlButtons = baseMapChoice;
baseMapChoice.addTo(mainMap);

// Add geocoding search tool
var mobileOpts = {
  sourceData: function(text, callResponse) {
    geocoder.geocode({address: text}, callResponse);
  },   
  formatData: function(rawjson) {
    var json = {}, key, loc, disp = [];
    for(var i in rawjson) {
      key = rawjson[i].formatted_address;
      var lat = rawjson[i].geometry.location.lat();
      var lng = rawjson[i].geometry.location.lng();
      loc = L.latLng(lat, lng);
      json[key]= loc;
    }

    return json;
  },
  textPlaceholder:'Enter Address',
  markerLocation: true,
  autoType: false,
  autoCollapse: false,
  minLength: 2,
  delayType: 800, // with mobile device typing is more slow
  position: 'topleft',
  marker: { icon: false }
};

var searchControl = new L.Control.Search(mobileOpts)
mainMap.addControl(searchControl);
zoomControlButtons = new L.Control.Zoom({'position':'topright'})
mainMap.addControl(zoomControlButtons);
// Add the county to the map
addCountyToMap(mainMap);



// Helps in getting colors for the maps
function chloroQuantile(data, breaks){
  var sorted = data.sort(function(a, b) {
    return (a - b);
  });
  var quants = [];
  quants = ss.jenks(sorted, breaks);
  return quants
  
}

// Make the Seach Box Always be Open
$('#searchtext13').css('display', 'block');
// Adding Legend Stuff
var legend = L.control({position: 'bottomleft'});
var pointLegend = L.control({position: 'bottomleft'});
var rankPointLegend = L.control({position: 'bottomleft'});

// Add print tooling


//Precalculate Quantile Values for Scores 
var siteWeightValues = {};
var siteWeightClasses = {};

$.ajax({
    type: 'GET',
    url: 'data/' + targetSiteId + '/point_files/all_sites_scored.csv',
    dataType: 'text',
    success: function(data) {


    var pointCols = ['dens.cvap.std',
                    'dens.work.std',
                    'popDens.std',
                    'prc.CarAccess.std',
                    'prc.ElNonReg.std' ,
                    'prc.disabled.std',
                    'prc.latino.std',
                    'prc.nonEngProf.std',
                    'prc.pov.std',
                    'prc.youth.std',
                    'rate.vbm.std',
                    'dens.poll.std',
                    'center_score',
                    'droppoff_score'];
    var coords = [];

      pointCols.forEach(function(col){
        siteWeightValues[col] = [];
      })

      var lineCount = 0
      processCSV(data).forEach(function(line) {
        lineCount += 1
        pointCols.forEach(function(col){
          siteWeightValues[col].push(+line[col])
        })
        coords.push([line['lat'],line['lon']])
      });

      Object.keys(siteWeightValues).forEach(function(k) {
        if (['center_score','droppoff_score'].indexOf(k) > -1){
          siteWeightClasses[k] = chloroQuantile(siteWeightValues[k], 5)
        } else {
          siteWeightClasses[k] = chloroQuantile(siteWeightValues[k], 3)
        }
      })
      var latlng = countyMapInitInfo[targetSiteId]['coord_center']
      var lat = latlng[0]
      var lon = latlng[1]
      mainMap.setView([lat, lon], countyMapInitInfo[targetSiteId]['initZoom']);

    }
  })


