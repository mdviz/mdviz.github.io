groupCharGlobals = {"label": {
                    "Demographics":"Jobs",
                    "Transit": "Sq. Miles",
                    "Highway": "Sq. Miles"
                    },
                    "normal": false
                };


GroupChartVis = function(_parentElement){
    this.parentElement = _parentElement;
    this.margin = {top: 20, right: 0, bottom: 30, left: 50};
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.groupData = null;
    this.format = null;
    this.initVis();
};

GroupChartVis.prototype.initVis = function() {
    var that = this;
    this.x0 = d3.scale.ordinal()
        .rangeRoundBands([0, that.width], .1);

    this.x1 = d3.scale.ordinal();

    this.y = d3.scale.linear()
        .range([that.height, 0]);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
        .scale(that.x0)
        .orient("bottom");


    this.yAxis = d3.svg.axis()
        .scale(that.y)
        .orient("left");


    this.svg = d3.select(this.parentElement).append("svg").attr("class","groupedChart")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
        .attr("class", "x axis Groups")
        .attr("transform", "translate(0," + that.height + ")")
        .call(this.xAxis);


    this.svg.append("g")
        .attr("class", "y axis Groups")
        .call(that.yAxis)
        .append("text")
        .attr("id","groupYlabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text();


    this.wrangleData(Demographics.gjobs, groupCharGlobals.label.Demographics);
};

GroupChartVis.prototype.updateVis = function(first, normal_I){
        var that = this;
    that.format = d3.format("0,000");
        that.x0.domain(that.groupData.map(function (d) {
            return d.Level;
        }));

        that.x1.domain(that.assetSet).rangeRoundBands([0, that.x0.rangeBand()]);

        if(!first) {
            that.y.domain([0, d3.max(that.groupData, function (d) {
                return d3.max(d.asset, function (d) {
                    return d.value
                });
            })]);
        } else{
            that.y.domain([0, d3.max(that.groupData, function (d) {
                return d3.max(d.asset, function (d) {
                    return normal_I === true ? d.value/that.total[d.Name]: d.value
                });
            })]);
        }




    if (!first){
        console.log("not first")
        that.yAxis
            .tickFormat(that.format);
        that.svg.select(".y.axis.Groups").call(this.yAxis);
        that.svg.select(".x.axis.Groups").call(this.xAxis);

        d3.select("#groupYlabel").classed("hide", false);
        that.slrLevel = that.svg.selectAll(".slrLevel")
            .data(that.groupData)
            .enter()
            .append("g")
            .attr("class", "g slrLevel")
            .attr("transform", function (d) {
                return "translate(" + that.x0(d.Level) + ",0)";
            });


        that.slrBars = that.slrLevel.selectAll("slrBar")
            .data(function (d) {
                return d.asset;
            });

        that.slrBars
            .enter().append("rect")
            .attr("class", "slrBar")
            .attr("width", that.x1.rangeBand())
            .attr("x", function (d) {
                return that.x1(d.Name);
            })
            .attr("height", that.height - that.y(0))
            .attr("y", function(d){
                that.y(0)
            })
            .style("fill", function (d) {
               return ["Green", "Blue", "Red", "Orange"].indexOf(d.Name) > -1 ? styles.colorLines(d):
                 that.color(d.Name);
            });

            d3.selectAll(".legend").remove();
            that.legend = that.svg.selectAll(".legend")
                .data(that.assetSet.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            that.legend.append("rect")
                .attr("x", 30)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function (d) {
                    var check = {};
                    check.Name = d;
                    return ["Green", "Blue", "Red", "Orange"].indexOf(check.Name) > -1 ? styles.colorLines(check):
                        that.color(d);
                });

            that.legend.append("text")
                .attr("x", 60)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d) { return d; });

            this.transitionBars()
    } else {
        that.format = normal_I ? d3.format("%") : d3.format("0,000");
        that.yAxis
            .tickFormat(that.format);
        console.log("HER")
        this.svg.select(".y.axis.Groups").transition().duration(1000).call(this.yAxis);
        that.slrBars.transition().duration(1000)
            .attr("y", function (d) {
                return normal_I === true ? that.y(d.value/that.total[d.Name]): that.y(d.value)
            })
            .attr("height", function (d) {
                return normal_I === true ? that.height - that.y(d.value/that.total[d.Name]):
                    that.height - that.y(d.value);

            })

    }

};

GroupChartVis.prototype.transitionVis = function() {
    var that = this;
    that.normal = false;
    that.slrBars.transition().duration(700)
        .attr("height", function(d) {
            return that.height - that.y(0)
        })
        .attr("y", that.y(0));


    d3.selectAll(".slrLevel").remove()

};

GroupChartVis.prototype.transitionBars = function() {
    var that = this;
    that.slrBars.transition().duration(1000)
        .attr("y", function (d) {
            return that.y(d.value);
        })
        .attr("height", function (d) {
            return that.height - that.y(d.value);
        })

};

GroupChartVis.prototype.wrangleData = function(_dataSource, label){
    var that = this;
    that.groupData = null;
    that.groupData = _dataSource.slice(0,6);
    that.total = _dataSource[6];
    groupCharGlobals.normal = false;

    d3.select("#groupYlabel").classed(".hide", false).text(label);

    that.groupData.forEach(function(d,i) {delete that.groupData[i].asset});

    that.assetSet = d3.keys(that.groupData[0]).filter(function (key) {
        return key !== "Level" ;
    });


    that.groupData.forEach(function (d) {
        d.asset = that.assetSet.map(function (Name) {
            return {Name: Name, value: +d[Name]};
        });
    });

    that.updateVis(false, false)
};