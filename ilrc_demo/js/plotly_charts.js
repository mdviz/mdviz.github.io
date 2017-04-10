PlotlyLineViz = function(_parentElement){
    this._parentElement = _parentElement;
    this.plinv = document.getElementById(_parentElement);
};

PlotlyLineViz.prototype.wrangleData  = function(){
    console.log('I"M HEEEERRRREEE');
    that = this;
    that.metric = $('.selectpicker')[0].value;
    that.metric_group = feature_groups_lookup[that.metric];
    console.log(that.metric);
    var grpFeatures = feature_groups[that.metric_group]
    var grpSums = [];
    grpFeatures.forEach(function(d){
        var sum = d3.sum(puma_viz.pumas.features, function(i) { return i.properties[d]; });
        grpSums.push(sum)
    });
    //console.log(grpFeatures)
    //console.log(grpSums)
    that.x = grpFeatures.map(function(d) {return feature_groups_back_lookup[d]});
    that.y = grpSums;
    that.makeViz()
};
PlotlyLineViz.prototype.makeViz = function(){
    that = this;

    var color_test =  [
        'rgb(165,0,38)',
        'rgb(215,48,39)',
         'rgb(244,109,67)',
         'rgb(253,174,97)',
         'rgb(254,224,144)',
         'rgb(224,243,248)',
         'rgb(171,217,233)',
         'rgb(116,173,209)',
         'rgb(69,117,180)',
         'rgb(49,54,149)'];

    //
    var data = [
        {
            x:that.x,
            y: that.y,
            type: 'bar',
            marker: {
                color: color_test
            }
        }
    ];
    console.log($(".tab-content").height())
    var layout = {
        // autosize: true,
        width: ($( ".tab-content" ).width())-20 ,
        height: ($( ".tab-content" ).height()) - 20,
        margin: {
            l: 10,
            r: 10,
            b: 30,
            t: 5,
            pad: 4
        }
        // paper_bgcolor: '#7f7f7f',
        // plot_bgcolor: '#c7c7c7'
    };
    Plotly.newPlot(that._parentElement, data, layout);


};

//PlotlyLineViz.prototype.makeViz = function(){
//    that = this;
//
//    var data = [
//        {
//            x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//            y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//            type: 'scatter'
//        }
//    ];
//    console.log($(".tab-content").height())
//    var layout = {
//        // autosize: true,
//        width: ($( ".tab-content" ).width()/2)-5 ,
//        height: ($( ".tab-content" ).height()/2) - 5,
//        margin: {
//            l: 0,
//            r: 0,
//            b: 0,
//            t: 5,
//            pad: 4
//        }
//        // paper_bgcolor: '#7f7f7f',
//        // plot_bgcolor: '#c7c7c7'
//    };
//    Plotly.newPlot(that._parentElement, data, layout);
//
//
//};


/**
 * Created by michaeldowd on 4/10/17.
 */
