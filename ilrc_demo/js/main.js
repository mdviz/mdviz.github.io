
/*
 Source http://stackoverflow.com/questions/6671183/calculate-the-center-point-of-multiple-latitude-longitude-coordinate-pairs
 */
function rad2degr(rad) { return rad * 180 / Math.PI; }
function degr2rad(degr) { return degr * Math.PI / 180; }
function getLatLngCenter(latLngInDegr) {
    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i=0; i<latLngInDegr.length; i++) {
        var lat = degr2rad(latLngInDegr[i][LATIDX]);
        var lng = degr2rad(latLngInDegr[i][LNGIDX]);
        // sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }

    var avgX = sumX / latLngInDegr.length;
    var avgY = sumY / latLngInDegr.length;
    var avgZ = sumZ / latLngInDegr.length;

    // convert average x, y, z coordinate to latitude and longtitude
    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);

    return ([rad2degr(lat), rad2degr(lng)]);
}


PumaViz = function(_parentElement, _pumas){
     // ***************************************************
    //Leaflet Stuff (zoom level, center, north arrow, etc)
    this.pumas = _pumas;
    this._parentElement = _parentElement;
    this.map = L.map(this._parentElement, { zoomControl:false });
    // Set Up the Map
    this.mapCenter = [39.82,-98.5795]
    this.minZoom = 4;
    this.maxZoom = 13;

    this.initMap();

};

PumaViz.prototype.initMap = function(center, minZoom, maxZoom) {
    viz_globals.info = L.control({position: 'bottomleft'});
    var north = L.control({position: "topright"});
    north.onAdd = function(map) {
        var div = L.DomUtil.create("div", "arrow");
        div.innerHTML = '<img src="LeafletNorth.png">';
        return div;
    };
    north.addTo(this.map);

    //Set the zoom based on the coordinates
    // var mapCenter = getLatLngCenter(coords);
    this.map.setView(this.mapCenter, this.minZoom);
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        id: 'mdowd.n6anai1b',
        access_token: "pk.eyJ1IjoibWRvd2QiLCJhIjoic0xVV3F6cyJ9.-gW3HHcgm-6qeMajHWz5_A"
    }).addTo(this.map);
    L.control.scale({position:"topright"}).addTo(this.map);
};

PumaViz.prototype.wrangleData = function() {
    that = this;
    that.test_vals = [];
    that.metric = $('.selectpicker')[0].value;

    that.pumas.features.forEach(function(d){ that.test_vals.push(d.properties[that.metric])});
    classify = chloroQuantile(that.test_vals, 8,'jenks')

};


PumaViz.prototype.addOverlay = function() {

    function whenClicked(e) {
        // e = event
        console.log(e);
        // You can make your ajax call declaration here
        //$.ajax(...
    }

    function onEachFeature(feature, layer) {
        var popupContent = "<p>GEOID: %s </p> <p>Name : %s </p> <p>State: %s </p>";
        popupContent = vsprintf(popupContent,[feature.properties.GEOID, feature.properties.Name,
            feature.properties.State]);
        layer.bindPopup(popupContent);

        layer.on({
            click: whenClicked
        });
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.Spanish,classify,bluish) ,
            //fillColor:'steelblue',
            weight:.5,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.8
        };
    }

    //Add the polygon layers
    L.geoJson(that.pumas, {style: style, onEachFeature: onEachFeature}).addTo(this.map);
};


PumaViz.prototype.updateDisplay = function() {
    console.log('Update Display - Does nothing yet. ');
    this.wrangleData();
    this.addOverlay();
};




