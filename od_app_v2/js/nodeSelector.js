/**
 * Created by mdowd on 9/15/15.
 */
var nodetest;
function createNodes(nodes){
    var sGlobals = {
        width : 500,
        height : 850,
        svg : undefined
    };

    jsonNodes = [];
    for (obj in nodes){
        jsonNodes.push({id:obj, flowsO: nnodes[obj].flowsO, flowsO : nnodes[obj].flowsO, classId:nnodes[obj].classId})
    }

    var top10destination = jsonNodes.sort(function(a,b){return a.flowsO < b.flowsO ? 1 : -1; }).slice(0,20);
    var top10dorigin = jsonNodes.sort(function(a,b){return a.flowsO < b.flowsO ? 1 : -1; }).slice(0,20);


    var margin= 50;
    sGlobals.svg = d3.select("#selectNodes")
        .append('svg')
        .attr("width", sGlobals.width)
        .attr("height", sGlobals.height);

    //
    var rscale = d3.scale.linear().domain([0, d3.max(top10destination, function(d){
        return d.flowsO
    })]).range([3, 25]);
    var yscale = d3.scale.linear().domain([0, 20]).range([60, sGlobals.height-10]);

    sGlobals.svg.selectAll("circle")
        .data(top10destination)
        .enter()
        .append("circle")
        .style("fill", function(d,i){
            return d3.rgb(10,0,10).brighter(i/1.5)
        })
        .attr("cx", 60)
        .attr("cy", function(d,i) {
            return yscale(i)
        })
        .attr("r", function(d) {
            return rscale(d.flowsO)
        })
        .attr("width", 20)
        .attr("height", 100)
        .attr("class",function(d){
            return d.classId + " selectNodes";
        })
        .on('mouseover', function(){
            nodetest = this;
            var nodeOID = "O_"+this.classList[0];
            var nodeDID = "D_"+this.classList[0];
            d3.selectAll(".bz:not(." + nodeOID +")").classed('hidden', true);
            d3.selectAll("."+ nodeOID).classed('highlight', true);
            console.log(nodeOID)
            d3.select(".N_" + this.classList[0])
                .transition()
                .duration(400)
                .attr("r", this.attributes.r.value).style("opacity",.6).style("fill","black").style("stroke", "yellow").style("stroke-width", 2)

        })
        .on("mouseout", function(){
            console.log(this)
            var nodeOID = "O_"+this.classList[0];
            d3.select(".N_" + nodeOID).attr("r", 2)
            d3.selectAll(".bz").classed('hidden', false)
            d3.selectAll(".bz").classed('highlight', false)

            d3.select(".N_" + this.classList[0])
                .transition()
                .duration(400)
                .style({
                "stroke": "black",
                "fill": "black",
                "opacity" : 0.1})
            .attr("r", 1)
        })
    ;

    var textLabels = sGlobals.svg
        .selectAll("text")
        .data(top10destination)
        .enter()
        .append("text");

    textLabels
        .attr("x", 90)
        .attr("y", function(d,i) {
            return yscale(i)+5
        })
        .text(function(d) {
            return d3.format("0,000")(d.flowsO)
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")


    sGlobals.svg
        .append("text")
        .attr("x", 50)
        .attr("y", 20)
        .text("Trips")
        .attr("font-family", "sans-serif")
        .attr("font-size", "26px");
}


//
//        vorFeatures.on("mouseover", function(){
//            d3.selectAll(".bz:not(." + nodeOID +")").classed('hidden', false);
//            d3.selectAll("."+ nodeOID).classed('highlight', false);
//
//            test = this;
//            console.log(this)
//            var nodeOID = "O"+this.classList[0].slice(1,100);
//            var nodeDID = "D"+this.classList[0].slice(1,100);
//            console.log(nodeOID)
//            d3.selectAll(".bz:not(." + nodeOID +")").classed('hidden', true);
//            d3.selectAll("."+ nodeOID).classed('highlight', true);
//            console.log("CLICKED", this)
//        });
//
//
//        jQuery('#sourceMap').mouseleave(function(){
//            d3.selectAll(".bz").classed('hidden', false)
//            d3.selectAll(".bz").classed('highlight', false)
//        });
