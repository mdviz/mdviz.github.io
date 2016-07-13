/**
 * Created by michaeldowd on 7/13/16.
 */
var bike_vis_globals = {};

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




function bikeColorVal(p){
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

function bikeSizeVal(val){
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




d3.csv("sip_data/bike_data_july13.csv", function(data) {
    bike_vis_globals.data = data;
    var coords = [];
    bike_vis_globals.data.forEach(function(d) {coords.push([d.y, d.x])});

    //Do map stuff
    //Leaflet Stuff (zoom level, center, north arrow, etc)
    bike_map = L.map("sourceMap2", { zoomControl:true });
    bike_vis_globals.info = L.control({position: 'bottomleft'});
    var north = L.control({position: "topleft"});
    north.onAdd = function(bike_map) {
        var div = L.DomUtil.create("div", "arrow");
        div.innerHTML = '<img src="LeafletNorth.png">';
        return div;
    };
    north.addTo(bike_map);

    var bike_label = L.control({position:"topright"});
    bike_label.onAdd = function(bike_map) {
        var div = L.DomUtil.create("div",'overlay')
        div.innerHTML = '<p class="info"> Bicycle Crashes </p>';
        return div
    };
    bike_label.addTo(bike_map);

    //Set the zoom based on the coordinates
    var mapCenter = getLatLngCenter(coords);
    bike_map.setView(mapCenter, 12);
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 12,
        id: 'mdowd.n6anai1b',
        access_token: "pk.eyJ1IjoibWRvd2QiLCJhIjoic0xVV3F6cyJ9.-gW3HHcgm-6qeMajHWz5_A"
    }).addTo(bike_map);
    L.control.scale({position:"topleft"}).addTo(bike_map);

    //Add the heat bike_map polygons
//        addOverlay();

    function cleanTreatments_bike(treatments) {
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
        $('p.treats_bike').remove();
//            initialize(e.latlng.lat, e.latlng.lng)
        treatments = cleanTreatments_bike(data[e.target.dataid].combo_treatment);
        treatments.forEach(function(d, i){

            $('<p>').appendTo('#SView2').prop('id', 'num_' + i);
            $("p#num_"+i).prop('class','treats_bike').text(i+1 + ' - ' + d);
        })
    }

    var counter = 0;
    data.forEach(function (i) {

        if ( !isNaN(+i.x) ) {

            marker = new L.circle([i.y, i.x], bikeSizeVal(i.d_bk_c_score), {
                color: bikeColorVal(i.d_bk_c_score),
                fillColor: bikeColorVal(i.d_bk_c_score),
                fillOpacity:.4,
                stroke: false
            }).bindLabel(createLabel_bike(i), {
                noHide: true,
                direction: 'auto'
            }).on('click', onClick)
                .addTo(bike_map)

        }
        marker.dataid =counter;
        counter += 1
    });

    //  updateDisplay();
    d3.selectAll('.leaflet-marker-icon').remove()
});

function createLabel_bike(valI){
    var first_row =  "Masterid: " +  valI.masterid ;
    var sip_id = "  Sip IDs: " + valI.sip_id;
    var fatals = "Fatal - before: " + valI.bc_bk_nof + " after: " + valI.ac_bk_nof;
    var injuries = "Injuries - before: " + valI.bc_bk_noi + " after: " + valI.ac_bk_noi;
    var sevA = 'Sev.A - before: ' + valI.bc_bk_svA + " after: " + valI.ac_bk_svA;
    var sevB = 'Sev.B - before: ' + valI.bc_bk_svB + " after: " + valI.ac_bk_svB;
    var sevC = 'Sev.C - before: ' + valI.bc_bk_svC + " after: " + valI.ac_bk_svC;
    var sevO = 'Sev.O - before: ' + valI.bc_bk_svO + " after: " + valI.ac_bk_svO;
    var crash_score='Crash Score - before: ' + valI.bc_bk_c_score + " after: " + valI.ac_bk_c_score
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

    bike_vis_globals.info.onAdd = function (bike_map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    //Control FLow for Labels - sort of a mess but running out of time.

    bike_vis_globals.info.update = function (asset) {
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
    bike_vis_globals.info.addTo(bike_map);



}