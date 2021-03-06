/**
 * Created by michaeldowd on 7/13/16.
 */
/**
 * Created by michaeldowd on 7/13/16.
 */
var ped_vis_globals = {ped_markers : new L.FeatureGroup()};


function pedColorVal(p){
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

d3.csv("sip_data/ped_data_july13.csv", function(data) {
    ped_vis_globals.data = data;
    var coords = [];
    ped_vis_globals.data.forEach(function(d) {coords.push([d.Y, d.X])});

    //Do map stuff
    //Leaflet Stuff (zoom level, center, north arrow, etc)
    viz_globals.ped_map = L.map("sourceMap3", { zoomControl:true });
    ped_vis_globals.info = L.control({position: 'bottomleft'});
    var north = L.control({position: "topleft"});
    north.onAdd = function(map) {
        var div = L.DomUtil.create("div", "arrow");
        div.innerHTML = '<img src="LeafletNorth.png">';
        return div;
    };
    north.addTo(viz_globals.ped_map);

    var ped_label = L.control({position:"topright"});
    ped_label.onAdd = function(map) {
        var div = L.DomUtil.create("div",'overlay');
        div.innerHTML = '<p class="info"> Pedestrian Crashes </p>';
        return div
    };
    ped_label.addTo(viz_globals.ped_map);


    //Set the zoom based on the coordinates
    var mapCenter = getLatLngCenter(coords);
    viz_globals.ped_map.setView(mapCenter, 12);
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 10,
        id: 'mdowd.n6anai1b',
        access_token: "pk.eyJ1IjoibWRvd2QiLCJhIjoic0xVV3F6cyJ9.-gW3HHcgm-6qeMajHWz5_A"
    }).addTo(viz_globals.ped_map);
    L.control.scale({position:"topleft"}).addTo(viz_globals.ped_map);


    //Add the heat viz_globals.ped_map polygons
//        addOverlay();

    function cleanTreatments_ped(treatments) {
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
        treatments = cleanTreatments_ped(data[e.target.dataid].combo_treatment);
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

    ped_vis_globals.create_markers = function(col_value){
        data.forEach(function (i) {

            if ( !isNaN(+i.X) ) {

                marker = new L.circle([i.Y, i.X], sizeVal(i[col_value]), {
                    color: pedColorVal(i[col_value]),
                    fillColor: pedColorVal(i[col_value]),
                    fillOpacity:.4,
                    stroke: false
                }).bindLabel(createLabel_ped(i), {
                    noHide: true,
                    direction: 'auto'
                }).on('click', onClick)

                ped_vis_globals.ped_markers.addLayer(marker)

            }
            marker.dataid =counter;
            counter += 1
        });
        viz_globals.ped_map.addLayer(ped_vis_globals.ped_markers);
    };

    ped_vis_globals.remove_markers = function() {
        viz_globals.ped_map.removeLayer(ped_vis_globals.ped_markers)
    };


    ped_vis_globals.create_markers('d_ped_c_score');
    updateDisplay(viz_globals.ped_map);
    d3.selectAll('.leaflet-marker-icon').remove();


});

function createLabel_ped(valI){
    var first_row =  "Masterid: " +  valI.masterid ;
    var sip_id = "  Sip IDs: " + valI.sip_id;
    var start = "SIP Min Start: "+  valI.start.split(' ')[0];
    var end = " SIP Max End: "+  valI.end.split(' ')[0];    var duration = " Before/After Span: " +(valI.short_span/365).toFixed(1)
        + " years ";
    var sip_complete = "SIP Completion Duration: " + valI.time_diff;
    var fatals = "Fatal - before: " + valI.bc_ped_nof + " after: " + valI.ac_ped_nof;
    var injuries = "Injuries - before: " + valI.bc_ped_noi + " after: " + valI.ac_ped_noi;
    var sevA = 'Sev.A - before: ' + valI.bc_ped_svA + " after: " + valI.ac_ped_svA;
    var sevB = 'Sev.B - before: ' + valI.bc_ped_svB + " after: " + valI.ac_ped_svB;
    var sevC = 'Sev.C - before: ' + valI.bc_ped_svC + " after: " + valI.ac_ped_svC;
    var sevO = 'Sev.O - before: ' + valI.bc_ped_svO + " after: " + valI.ac_ped_svO;
    var crash_score='Crash Score - before: ' + valI.bc_ped_c_score + " after: " + valI.ac_ped_c_score
    var fields = [first_row, sip_id,start,end, duration, sip_complete, fatals,injuries,sevA,sevB,sevC,sevO,crash_score];
    var output = ''
    fields.forEach(function(d){
        output += '<p>'
        output += d
        output += '</p>'
    });
    return output
}


function updateDisplay(map){
    //$('.info').remove();


    viz_globals.info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info_main');
        this.update();
        return this._div;
    };

    //Control FLow for Labels - sort of a mess but running out of time.

    viz_globals.info.update = function (asset) {
        
        wh = "50"

        var sz1 =  '<svg height="50" width="50"><circle cx="20" cy="20" r="30" stroke= ';
        var sz2 =  '<svg height="50" width="50"><circle cx="20" cy="20" r="20" stroke= ';
        var sz3 =  '<svg height="50" width="50"><circle cx="20" cy="20" r="15"  stroke= ';
        var sz4 =  '<svg height="50" width="50"><circle cx="20" cy="20" r="5" stroke= ';
        var sz5 =  '<svg height="50" width="50"><circle cx="20" cy="20" r="1" stroke= ';

        var vals = [{name: "+/- 50", color:"gray", size:sz1},
                    {name: "+/- 40", color:"gray", size:sz2},
                    {name: "+/- 20", color:"gray", size:sz3},
                    {name: "+/- 10", color:"gray", size:sz4} ,
                    {name: "+/- 1", color:"gray",size:sz5}
        ];
        var sc2 = ' stroke-width="3" fill=';
        var sc3 = ' /></svg>';

        var htmlContent= '<p style="color:steelblue;">'  + "Blue = Decrease" + '</p>' + '<br>';

        htmlContent +=  '<p style="color:red";>'  + "Red = Increase" + '</p>' + '<br>';
        vals.forEach(function(d){
            htmlContent += d.size + d.color + sc2 + d.color + sc3 +  '<span style=vertical-align:20px; ">' + d.name + '</span>' + " <br>"
        });
        this._div.innerHTML = htmlContent;


    };
    viz_globals.info.addTo(viz_globals.ped_map);


}
