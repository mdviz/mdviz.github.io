assetsGlobals = {
    "gradient" : golden,
    "currentAsset": null,
    "assetMap" : null,
    "classify": null,
    "assetStyle": undefined,
    "showWater": true,
    "highlightSlrFeatures" : function(level){
        var check = asset_map_viz.Assets.selected;
        if (check === "Roads" ){
            asset_map_viz.Assets.roads.eachLayer(function(layer){
                if (level === 0 ){
                    layer.setStyle({color :'gray', weight: 1})
                } else if (layer.feature.properties.slr_lvl <= level && layer.feature.properties.slr_lvl !== 0){
                    layer.setStyle({color :'red', weight: 1});
                }
            })
        } else if (check === "Highway Exits" || check === "Bus" || "The-T"){
            var asset = check === "Highway Exits" ? "exits" : check === "Bus" ? "busStops" :
                    check === "The-T" ? "T_Stops"  : undefined;
            if (asset !== undefined){
                asset_map_viz.Assets[asset].eachLayer(function(layer){
                    if (level === 0 ){
                        layer.setStyle({color :'black', weight: 1})
                    } else if (layer.feature.properties.slr_lvl <= level && layer.feature.properties.slr_lvl !== 0){
                        layer.setStyle({color :'red', weight: 7})
                    } else {
                        layer.setStyle({color :'black', weight: 1});

                    }
                })
            }
        }
    },

    "getColor" : function(d, colorObject) {
        d = assetsGlobals.assetMap.get(d);
        return d > assetsGlobals.classify[7] ? colorObject[1] :
            d > assetsGlobals.classify[6]  ? colorObject[2] :
                d > assetsGlobals.classify[5]  ? colorObject[3] :
                    d > assetsGlobals.classify[4]  ? colorObject[4] :
                        d > assetsGlobals.classify[3]   ? colorObject[5] :
                            d > assetsGlobals.classify[2]   ? colorObject[6] :
                                d > assetsGlobals.classify[1]   ?colorObject[7] :
                                    'none';
    },

    "onEachFeature": function(feature, layer) {
    // does this feature have a property named popupContent?
        if (feature.properties && feature.properties["STATION"]) {
            layer.bindPopup(feature.properties["STATION"]);
        } else if (feature.properties && feature.properties["STOP_NAME"]) {
            layer.bindPopup(feature.properties["STOP_NAME"]);
        } else if (feature.properties && feature.properties["ROUTEKEY"]) {
            layer.bindPopup(feature.properties["ROUTEKEY"]);
        } else if (feature.properties && feature.properties["LINE"]) {
            layer.bindPopup(feature.properties["LINE"]);
        } else if (feature.properties && feature.properties["NAME"]) {
            layer.bindPopup(feature.properties["NAME"]);
        } else if (feature.properties && feature.properties["TAZ"]){
            layer.bindPopup(feature.properties["TAZ"]);
        }

        layer.on('mouseover', function (e) {
            this.openPopup();

            layer = e.target;
            if (layer.feature.properties.DIRECTION ){
                layer.setStyle({
                    color: 'red'
                })
            }

        });
        layer.on('mouseout', function (e) {
            this.closePopup();
            layer = e.target;
            if (layer.feature.properties.DIRECTION ){
                layer.setStyle({
                    color: 'yellow'
                })
            }
        });
    },

    "roadStyle": function(feature) {
            return {
                weight: 0.5,
                opacity: 1,
                color: "gray",
                fillOpacity: 0.7
            };
        },
    "tLineTotals": [0.897196826,1.014706875,1.739433176,5.146858912,10.36589447,15.3624629,63.38788192],
    "busLineTotals": [30.73420033,49.61719088,108.2431898,253.5823656,537.1498319,721.6394391,8612188.302],
    "roadTotals":[63.6618823,98.76279535,185.0449799,356.2532247,605.8486136,808.0996323,24577.17603],
    "totalBusStops": 7678,
    "totalLostTrips": [0.007918158,0.055871538,0.066958979,0.084825443,0.141989101,0.21624468, 1]
};
///////Exiting Viz Object Global///////

AssetMapVis = function() {
    this.asset_viz = null;
    this.Features = new L.LayerGroup();
    this.initViz("Demographics")
    $("#assetWater").addClass("selectedButton");
};

AssetMapVis.prototype.initViz = function(selected){
    var that = this;
    assetsGlobals.currentAsset = selected;
    $("#AssetDM").addClass("selectedButton");
    that.Assets = {
        "lookUp":{
            "Roads"         : "Highway",
            "Highway Exits" : "Highway",
            "Bus"     : "Transit",
            "The-T"     : "Transit",
            "Demographics"  : "Demographics"
        },
        "selected": "Demographics",
        "demoDim" : "jobs",
        "roads": L.geoJson(indRoads, {style: assetsGlobals.roadStyle}),
        "taz"  : L.geoJson(rawTaz, {}),
        "exits" : L.geoJson(exits, {style: function(feature) {
            return {color: "black"};}, pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
        }, onEachFeature: assetsGlobals.onEachFeature}),
        "busStops": L.geoJson(busStops, {style: function(feature) {
            return {color: "black"};}, pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 2, fillOpacity: 0.85});
        }, onEachFeature: assetsGlobals.onEachFeature}),
        "T_Lines":L.geoJson(mbtaArc, {style: styles.transitStyle, onEachFeature: assetsGlobals.onEachFeature}),
        "T_Stops": L.geoJson(T_Stops, {style: function(feature){
            return Tstyle(feature)
        },
                pointToLayer: function(feature, latlng) {
                    return new L.CircleMarker(latlng, {radius: 3, fill:"white"});
        }, onEachFeature: assetsGlobals.onEachFeature}),
        "busLines":L.geoJson(busLines, {style: function(feature){
            return {weight: 2, color: "yellow", offset:100}
        },onEachFeature: assetsGlobals.onEachFeature})

    };


    function Tstyle(feature){
        return {
            color:"black", fill:"black", stroke: "black",weight:2, fillOpacity: 0.5
        }
    }

    that.wrangleDemData(Demographics.jobs, "jobs", 0);

    var legend = L.control( { position: 'bottomright' } );
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'assetLegend hide');

        return div
    };
    legend.addTo(map3)

};

AssetMapVis.prototype.updateVis = function() {
    var that = this;
    that.Assets.taz.setStyle(assetsGlobals.assetStyle);
    that.Assets.taz.eachLayer(function(d){
        d.bindPopup(String(Math.round(assetsGlobals.assetMap.get(d.feature.properties.TAZ))))
    });
    that.Features.addTo(map3)
};

AssetMapVis.prototype.wrangleDemData = function(dim, label, level) {
    var that = this;
    that.Assets.demoDim = label.toLowerCase();
    assetsGlobals.gradient = label.toLocaleLowerCase() === "jobs" ? golden : label.toLocaleLowerCase() === "pop" ? bluish :
        label.toLocaleLowerCase() === "households" ? redish : purplish;
    this.classMap = d3.map();
    var newlabel = label === "TAZAREA" ? "TAZAR" : label;

    console.log(label, "LABEL")
    Demographics[label.toLowerCase()].forEach(function (d) {
        that.classMap.set(d.TAZ, d[newlabel.toUpperCase() + "_" + 6 + "ft"])
    });

    assetsGlobals.assetMap = d3.map();
    dim.forEach(function (d) {
        assetsGlobals.assetMap.set(d.TAZ, d[newlabel.toUpperCase() + "_" + level + "ft"]);
    });


    if (that.asset_viz === null) {
        that.asset_viz = new AssetVis(d3.select("#chart"), Demographics.jobs, "Jobs");
        that.asset_viz2 = new AssetVis(d3.select("#chart1"), Demographics.pop, "Pop");
        that.asset_viz3 = new AssetVis(d3.select("#chart2"), Demographics.households, "Households");
        that.asset_viz4 = new AssetVis(d3.select("#chart3"), Demographics.firms, "Firms");
    }

    assetsGlobals.classify = chloroQuantile(this.classMap.values(), 8, "jenks");
    assetsGlobals.assetStyle = function (feature) {
        return {
            fillColor: assetsGlobals.getColor(feature.properties.TAZ, assetsGlobals.gradient),
            weight: 0.5,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    };

    that.updateLayers("taz");
    that.updateAssetInfo();
    if (level === 0){
        that.toggleLegend(true)
    } else {
        that.toggleLegend(false);
        that.addDemLegend();
    }
};

AssetMapVis.prototype.addDemLegend = function() {
    d3.selectAll(".assetLegendRect").remove();
    d3.selectAll(".assetLegendSVG").remove();

    var legendData = assetsGlobals.classify.slice(0);
    legendData = legendData.slice(1,9);
    var legendHeight = 180;
    var legend = d3.select(".assetLegend")
        .append("svg")
        .attr("class","assetLegendSVG")
        .attr("width",100)
        .attr("height",legendHeight)
        .append("g")
        .attr("transform", "translate(0,15)")
        .selectAll("g.legend")
        .data(legendData.reverse())
        .enter()
        .append("g")
        .attr("class", "legend");

    var ls_w = 30, ls_h = 20;

    legend.append("rect")
        .attr("class","assetLegendRect")
        .attr("x", 10)
        .attr("y", function(d, i){ return legendHeight - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) {
                return assetsGlobals.gradient[i]
        })
        .style("opacity", 0.7);

    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return legendHeight - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return String(Math.round(legendData[i])) });

};

AssetMapVis.prototype.toggleLegend = function(bool){
    //asset_map_viz.toggleLegend(true)
    d3.select(".assetLegend").classed("hide",bool)
};

AssetMapVis.prototype.updateLayers = function(layer, layer2){
    var that = this;
    that.Features.clearLayers();
    if (layer2){
        that.Features.addLayer(that.Assets[layer2]);
        that.Features.addLayer(that.Assets[layer]);
    } else {
        that.Features.addLayer(that.Assets[layer])
    }
    that.updateVis();
};

AssetMapVis.prototype.updateAssetInfo = function(){
    var that = this;
    $(".info").remove();
    info.onAdd = function (map3) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    //Control FLow for Labels - sort of a mess but running out of time.
    var thing = that.Assets.demoDim;
    if (thing === undefined){
        thing = that.Assets.selected === "Demographics" ?  "Jobs" : that.Assets.selected;
    } else {
        thing = thing === "jobs" ? "Jobs" : thing === "pop" ? "Population" : thing === "households" ? "Households" : "Firms"
    }


    info.update = function (asset) {
        this._div.innerHTML = '<h4>' + thing + '</h4>'
    };
    info.addTo(map3);


};