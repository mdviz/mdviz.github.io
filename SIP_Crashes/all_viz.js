/**
 * Created by michaeldowd on 7/13/16.
 */
var viz_globals = {};

//    function initialize(plat,plong) {
//        var fulton = {lat: plat, lng: plong};
//
//        var panorama = new google.maps.StreetViewPanorama(
//                document.getElementById('SView'), {
//                    position: fulton,
//                    pov: {
//                        heading: 34,
//                        pitch: 10
//                    }
//                });
//    }

Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}
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

function colorVal(p){
    var color;
    if ( p > 0 )  {
        color = "red"

    } else if ( p < 0) {
        color = 'steelblue'
    } else {
        color = 'black'
    }

    return color;
}

function sizeVal(val){
    if (val > 0){
        size =
            val >= 50 ? 200:
                val > 40 ? 150:
                    val > 20 ? 125:
                        val > 10 ? 100:
                            val > 1 ? 25:
                                1
    } else if (val < 0){
        size =
            val <= -50 ? 200:
                val < -40 ? 150:
                    val < -20 ? 125:
                        val < -10 ? 100:
                            val < -1 ? 25:
                                1;
    } else {
        return 1
    }
    return size
}

//    function addOverlay(){
//
//        function overLayColor(d){
//            return d == 60 ? "red":
//                    "black"
//        }
//
//        function onEachFeature(feature, layer) {
//            var popupContent = "<p>Total Injured/Killed: %s </p> <p>Total Injured: %s </p> <p>Total Killed: %s </p>";
//            popupContent = vsprintf(popupContent,[feature.properties.total, feature.properties.inj, feature.properties.fat])
//            layer.bindPopup(popupContent);
//        }
//
//        function style(feature) {
//            return {
//                fillColor: overLayColor(feature.properties.dn) ,
//                weight: 1,
//                opacity: 1,
//                color: 'black',
//                dashArray: '3',
//                fillOpacity: 0.1
//            };
//        }

//Add the polygon layers
//        L.geoJson(bar60, {style: style,onEachFeature: onEachFeature}).addTo(map);
//        L.geoJson(bar30, {style: style,onEachFeature: onEachFeature}).addTo(map);
//    }



d3.csv("sip_data/all_data_july13.csv", function(data) {
    viz_globals.data = data;
    var coords = [];
    viz_globals.data.forEach(function(d) {coords.push([d.y, d.x])});

    //Do map stuff
    //Leaflet Stuff (zoom level, center, north arrow, etc)
    map = L.map("sourceMap", { zoomControl:true });
    viz_globals.info = L.control({position: 'bottomleft'});
    var north = L.control({position: "topleft"});
    north.onAdd = function(map) {
        var div = L.DomUtil.create("div", "arrow");
        div.innerHTML = '<img src="LeafletNorth.png">';
        return div;
    };
    north.addTo(map);

    //Set the zoom based on the coordinates
    var mapCenter = getLatLngCenter(coords);
    map.setView(mapCenter, 12);
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 12,
        id: 'mdowd.n6anai1b',
        access_token: "pk.eyJ1IjoibWRvd2QiLCJhIjoic0xVV3F6cyJ9.-gW3HHcgm-6qeMajHWz5_A"
    }).addTo(map);
    L.control.scale({position:"topleft"}).addTo(map);

    //Add the heat map polygons
//        addOverlay();

    function cleanTreatments_all(treatments) {
        console.log(treatments)
        var cTreatments = [];
        treatments = treatments.split(',').getUnique();
        treatments.forEach(function(d){
            d = d.replace(/"/g,"");
            d = d.replace("{","");
            d = d.replace("}","");
            cTreatments.push(d)

        });
        return cTreatments.getUnique();
    }

    //onPoint Click show the Street view.
    function onClick(e){
        $('p.treats').remove();
//            initialize(e.latlng.lat, e.latlng.lng)
        treatments = cleanTreatments_all(data[e.target.dataid].combo_treatment);
        treatments.forEach(function(d, i){

            $('<p>').appendTo('#SView').prop('id', 'num_' + i);
            $("p#num_"+i).prop('class','treats').text(i+1 + ' - ' + d);
        })
    }

    var counter = 0;
    data.forEach(function (i) {

        if ( !isNaN(+i.x) ) {

            marker = new L.circle([i.y, i.x], sizeVal(i.d_all_c_score), {
                color: colorVal(i.d_all_c_score),
                fillColor: colorVal(i.d_all_c_score),
                fillOpacity:.4,
                stroke: false
            }).bindLabel(createLabel_all(i), {
                noHide: true,
                direction: 'auto'
            }).on('click', onClick)
                .addTo(map)

        }
        marker.dataid =counter;
        counter += 1
    });

    //  updateDisplay();
    d3.selectAll('.leaflet-marker-icon').remove()
});

function createLabel_all(valI){
    var first_row =  "Masterid: " +  valI.masterid ;
    var sip_id = "  Sip IDs: " + valI.sip_id;
    var fatals = "Fatal - before: " + valI.bc_all_nof + " after: " + valI.ac_all_nof;
    var injuries = "Injuries - before: " + valI.bc_all_noi + " after: " + valI.ac_all_noi;
    var sevA = 'Sev.A - before: ' + valI.bc_all_svA + " after: " + valI.ac_all_svA;
    var sevB = 'Sev.B - before: ' + valI.bc_all_svB + " after: " + valI.ac_all_svB;
    var sevC = 'Sev.C - before: ' + valI.bc_all_svC + " after: " + valI.ac_all_svC;
    var sevO = 'Sev.O - before: ' + valI.bc_all_svO + " after: " + valI.ac_all_svO;
    var crash_score='Crash Score - before: ' + valI.bc_all_c_score + " after: " + valI.ac_all_c_score
    var fields = [first_row, sip_id,fatals,injuries,sevA,sevB,sevC,sevO,crash_score];
    var output = ''
    fields.forEach(function(d){
        output += '<p>'
        output += d
        output += '</p>'
    });
    return output

}


function updateDisplay(){
    $('.info').remove();

    viz_globals.info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    //Control FLow for Labels - sort of a mess but running out of time.

    viz_globals.info.update = function (asset) {
        var vals = [{name: "More than 75%", color:"yellow"}, {name: "50%-75%", color:"red"}, {name: "25%-50%", color:"blue"}, {name: "Less than 25%", color:"black"} ];
        var sc1 =  '<svg height="50" width="50"><circle cx="20" cy="20"  stroke= ';
        var sc2 = ' stroke-width="3" fill=';
        var sc3 = ' r="7" /></svg>';
        var htmlContent= '<p>'  + "Utilization Rate" + '</p>' + '<br>';
        vals.forEach(function(d){
            htmlContent +=  sc1 + d.color + sc2 + d.color + sc3 +  '<span style=vertical-align:20px; ">' + d.name + '</span>' + " <br>"
        });
        this._div.innerHTML = htmlContent;
    };
    viz_globals.info.addTo(map);



}