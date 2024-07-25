// Set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the svg object to the div with id "d3-dashboard"
var svg = d3.select("#d3-dashboard")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Example data
var data = [
    {date: '2020-01-01', value: 10},
    {date: '2020-02-01', value: 20},
    {date: '2020-03-01', value: 30},
    {date: '2020-04-01', value: 40}
];

// Parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");

// Format the data
data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.value = +d.value;
});

// Scale the range of the data
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) { return d.value; })]);

// Add the valueline path.
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

// Add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));
