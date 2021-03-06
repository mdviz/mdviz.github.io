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


d3.csv("sip_data/bike_data_july13.csv", function(data) {
    bike_vis_globals.data = data;
    var coords = [];
    bike_vis_globals.data.forEach(function(d) {coords.push([d.Y, d.X])});

    //Do map stuff
    //Leaflet Stuff (zoom level, center, north arrow, etc)
    viz_globals.bike_map = L.map("sourceMap2", { zoomControl:true });
    bike_vis_globals.info = L.control({position: 'bottomleft'});
    var north = L.control({position: "topleft"});
    north.onAdd = function(map) {
        var div = L.DomUtil.create("div", "arrow");
        div.innerHTML = '<img src="LeafletNorth.png">';
        return div;
    };
    north.addTo(viz_globals.bike_map);

    var bike_label = L.control({position:"topright"});
    bike_label.onAdd = function(map) {
        var div = L.DomUtil.create("div",'overlay')
        div.innerHTML = '<p class="info"> Bicycle Crashes </p>';
        return div
    };
    bike_label.addTo(viz_globals.bike_map);

    //Set the zoom based on the coordinates
    var mapCenter = getLatLngCenter(coords);
    viz_globals.bike_map.setView(mapCenter, 12);
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 10,
        id: 'mdowd.n6anai1b',
        access_token: "pk.eyJ1IjoibWRvd2QiLCJhIjoic0xVV3F6cyJ9.-gW3HHcgm-6qeMajHWz5_A"
    }).addTo(viz_globals.bike_map);
    L.control.scale({position:"topleft"}).addTo(viz_globals.bike_map);

    //Add the heat viz_globals.bike_map polygons
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
        $('p.treats').remove();
        initialize(e.latlng.lat, e.latlng.lng)
        treatments = cleanTreatments_bike(data[e.target.dataid].combo_treatment);
        treatments.forEach(function(d, i){

            if (i < 5){
                $('<p>').appendTo('#SView').prop('id', 'num_' + i);
                $("p#num_"+i).prop('class','treats').text(i+1 + ' - ' + d);
            } else if (i < 10){
                $('<p>').appendTo('#SView2').prop('id', 'num_' + i);
                $("p#num_"+i).prop('class','treats').text(i+1 + ' - ' + d);
            } else {
                $('<p>').appendTo('#SView3').prop('id', 'num_' + i);
                $("p#num_"+i).prop('class','treats').text(i+1 + ' - ' + d);
            }

        })
    }

    var counter = 0;
    data.forEach(function (i) {

        if ( !isNaN(+i.X) ) {

            marker = new L.circle([i.Y, i.X], sizeVal(i.d_bk_c_score), {
                color: bikeColorVal(i.d_bk_c_score),
                fillColor: bikeColorVal(i.d_bk_c_score),
                fillOpacity:.4,
                stroke: false
            }).bindLabel(createLabel_bike(i), {
                noHide: true,
                direction: 'auto'
            }).on('click', onClick)
                .addTo(viz_globals.bike_map)

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
    var duration = " Before/After Span: " +( valI.short_span/365).toFixed(1) + " years ";
    var sip_complete = "SIP Completion Duration: " + valI.time_diff;
    var start = "SIP Min Start: "+  valI.start.split(' ')[0];
    var end = " SIP Max End: "+  valI.end.split(' ')[0];
    var fatals = "Fatal - before: " + valI.bc_bk_nof + " after: " + valI.ac_bk_nof;
    var injuries = "Injuries - before: " + valI.bc_bk_noi + " after: " + valI.ac_bk_noi;
    var sevA = 'Sev.A - before: ' + valI.bc_bk_svA + " after: " + valI.ac_bk_svA;
    var sevB = 'Sev.B - before: ' + valI.bc_bk_svB + " after: " + valI.ac_bk_svB;
    var sevC = 'Sev.C - before: ' + valI.bc_bk_svC + " after: " + valI.ac_bk_svC;
    var sevO = 'Sev.O - before: ' + valI.bc_bk_svO + " after: " + valI.ac_bk_svO;
    var crash_score='Crash Score - before: ' + valI.bc_bk_c_score + " after: " + valI.ac_bk_c_score
    var fields = [first_row, sip_id,start, end, duration,sip_complete,fatals,injuries,sevA,sevB,sevC,sevO,crash_score];
    var output = '';
    fields.forEach(function(d){
        output += '<p>';
        output += d;
        output += '</p>';
    });
    return output

}
