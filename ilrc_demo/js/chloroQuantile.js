/**
 * Created by mdowd on 4/5/15.
 */

function chloroQuantile(data, k, brkOrJenk){
    data = data.sort(function(a,b) {return a-b});
    var quants = [];
    if (brkOrJenk === "jenks"){
        quants = ss.jenks(data, k);
        quants[quants.length-1]+= .00000001;
        return quants
    }

    var p = .99999999/k;

    for (var i=1; i<k+1; i++){
        if (i===k){
            quants.push(ss.quantile(data, p*i) +.0000001)
        } else {
            quants.push(ss.quantile(data, p*i))}
    }
    return quants

}

 function getColor(d , classify, colorObject) {

        return d > classify[7] ? colorObject[1] :
            d > classify[6]  ? colorObject[2] :
                d > classify[5]  ? colorObject[3] :
                    d > classify[4]  ? colorObject[4] :
                        d > classify[3]   ? colorObject[5] :
                            d > classify[2]   ? colorObject[6] :
                                d > classify[1]   ? colorObject[7] :
                                    colorObject[0];
    }


var golden = {
    0:"#1D0009",
    1:'#800026',
    2:"#BD0026",
    3:"#E31A1C",
    4:"#FC4E2A",
    5:"#FD8D3C",
    6:"#FEB24C",
    7:"#FED976"
    };

var bluish = {8:"rgb(222,235,247)",
    7:"rgb(198,219,239)",
    6:"rgb(158,202,225)",
    5:"rgb(107,174,214)",
    4:"rgb(66,146,198)",
    3:"rgb(33,113,181)",
    2:"rgb(8,81,156)",
    1:"rgb(8,48,107)",
    0:'white'};


var redish = {
    7:"#D1AAAA",
    6:"#C18D8D",
    5:"#B27171",
    4:"#A35555",
    3:"#933838",
    2:"#841C1C",
    1:"#750000"};

var purplish = {
    7:"#B557BF",
    6:"#93489F",
    5:"#723A80",
    4:"#613270",
    3:"#502B60",
    2:"#2E1C40",
    1:"#0D0E21"};