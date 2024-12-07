// Global Population Density by Country
/*  This visualization was made possible by modifying code provided by:
choropleth map tutorial
https://d3-graph-gallery.com/graph/choropleth_basic.html

Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
*/

document.addEventListener('DOMContentLoaded', function () {
    const margin = { top: 90, right: 130, bottom: 30, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#chart1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2 - 110)
        .attr("text-anchor", "middle")
        .style("font-size", "16pt")
        .style("font-weight", "bold")
        .text("Global Population Density by Country");

    var projection = d3.geoMercator()
        .scale(100)
        .translate([width / 2 + 100, height / 2 + 50]);

    var path = d3.geoPath()
        .projection(projection);

    var tooltip1 = d3.select("#tooltip1");

    tooltip1.style("display", "none");

    svg.append("defs")
        .append("pattern")
        .attr("id", "hatch")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 4)
        .attr("height", 4)
        .append("path")
        .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
        .attr("stroke", "#808080")
        .attr("stroke-width", 1);

    d3.csv("../data/region_population_density.csv").then(function (densityData) {
        var densityMap = new Map();
        densityData.forEach(function (d) {
            densityMap.set(d.region, +d.pop_density);
        });

        var colorScale = d3.scaleLinear()
            .domain([20, 1000])
            .range(['#c9fbf5', '#000000']);

        d3.json("../data/countries-110m_v2.json").then(function (world) {
            var countries = topojson.feature(world, world.objects.countries).features;

            svg.selectAll("path")
                .data(countries)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "gray")
                .style("stroke-width", 0.1)
                .attr("fill", function (d) {
                    var density = densityMap.get(d.properties.name);
                    return density === undefined ? 'url(#hatch)' : colorScale(density);
                })
                .attr("opacity", 1)
                .on("mouseover", function (event, d) {
                    d3.select(this).style("stroke", "black").style("stroke-width", 0.3);
                    var properties = d && d.properties;
                    var density = properties ? densityMap.get(properties.name) : undefined;
                    tooltip1.style("display", "block")
                        .html(`<strong>${properties ? properties.name : "Unknown"}</strong> <br>` +
                            (density !== undefined ? density + " pop. density per km²" : "No data available"))
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");

                })
                .on("mouseout", function () {
                    d3.select(this).style("stroke", "gray").style("stroke-width", 0.1);
                    tooltip1.style("display", "none");
                });


        }).catch(function (error) {
            console.log(error);
            alert("Data loading error: " + error.message);
        });

    });

    var colorScale = d3.scaleLinear()
        .domain([0.1, 1265.2])
        .range(['#c9fbf5', '#000']);

    // Create the gradient
    var gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    // Define the gradient colors
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale.range()[0])
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale.range()[1])
        .attr("stop-opacity", 1);

    svg.append("rect")
        .attr("x", 20)
        .attr("y", height - 50)
        .attr("width", 130)
        .attr("height", 10)
        .style("fill", "url(#gradient)");

    svg.append("text")
        .attr("x", 20)
        .attr("y", height - 30)
        .style("font-size", "6pt")
        .style("text-anchor", "start")
        .text(colorScale.domain()[0]);

    svg.append("text")
        .attr("x", 150)
        .attr("y", height - 30)
        .style("font-size", "6pt")
        .style("text-anchor", "end")
        .text(colorScale.domain()[1]);

    // Add a title to your legend
    svg.append("text")
        .attr("x", 70)
        .attr("y", height - 55)
        .style("text-anchor", "middle")
        .style("font-size", "6pt")
        .text("Pop. density per square km");






});
