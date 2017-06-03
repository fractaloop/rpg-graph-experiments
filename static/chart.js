var url = "balances.json";

var totalWidth = 640;
var totalHeight = 360;
var margin = {top: 10, right: 10, bottom: 30, left: 30};

var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var numBins = 10
var binWidth = 250

d3.json(url, function(err,data) {
  var balanceChart = dc.barChart("#balance-chart");
  // var balanceTable = dc.dataTable("#balance-table");
  var balances = Object.values(data);

  // The first entry is the "Bank"  
  var marketCap = -balances.shift()

  // Remove all the zeros after we count them
  var emptyCount = balances.filter(function(d) { return 0 == d; }).length
  balances = balances.filter(function(d) { return 0 != d; })

  console.log("Using " + numBins + " bins (" + binWidth + " wide) to graph " + balances.length + " balances")

  var binning = function(d) {
    return Math.floor(d / binWidth); 
  }

  var ndx = crossfilter(balances);
  var balanceDim  = ndx.dimension(function(d) { return d; });
  var balanceHist = balanceDim.group(binning).reduceCount();
  var histMaxKey = d3.max(balanceHist.all().map(function(d) { return d.key;}))
  var histMaxValue = d3.max(balanceHist.all().map(function(d) { return d.value;}))

  var x = d3.scale.linear()
    .domain([0, histMaxKey])

  var y = d3.scale.linear()
    .domain([0, histMaxValue])

  balanceChart
    .xAxis()
    .tickFormat(function(d) { return d * binWidth; })

  balanceChart
    .width(640)
    .height(360)
    .dimension(balanceDim)
    .group(balanceHist)
    .x(x)
    .y(y)
    .xAxisLabel("Account Balance (INK)")
    .yAxisLabel("Number of users")
    .brushOn(false)
    .title(function (d) { return d.value + " accounts"; });

  dc.renderAll();

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) { return "<span>" + (d.x * binWidth) + " to " + ((d.x + 1) * binWidth - 1) + " INK<br/><strong>" + d.y + " users</strong></span>"; });

  d3.selectAll('.bar').call(tip);
  d3.selectAll('.bar')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);  


});
