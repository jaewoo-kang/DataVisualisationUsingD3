// Population Trends by Country
const margin = { top: 50, right: 130, bottom: 30, left: 70 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", margin.top / 2 - 55)
    .attr("text-anchor", "middle")
    .style("font-size", "16pt")
    .style("font-weight", "bold")
    .text("Population Trends by Country");

const tooltip2 = d3.select("#tooltip2");
tooltip2.style("display", "none");

d3.csv("../data/population.csv").then(function (data) {
    const years = ["1960", "1970", "1980", "1990", "2000", "2010", "2020"];
    data.forEach(d => {
        d.filteredData = years.map(year => ({ year: year, value: +d[year] }));
    });

    const includeCountries = ["United States", "China", "South Korea", "India", "Taiwan", "Japan", "Germany", "France", "United Kingdom", "Thailand", "Canada"];
    const filteredCountries = data.filter(d => includeCountries.includes(d["Country"]));

    const x = d3.scaleLinear().domain([1960, 2020]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(filteredCountries, d => d3.max(d.filteredData, fd => fd.value))]).range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const valueline = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g").call(d3.axisLeft(y));

    filteredCountries.forEach(function (d, i) {
        const countryId = `${d["Country"]}`;

        svg.append("path")
            .datum(d.filteredData)
            .attr("id", countryId)
            .attr("fill", "none")
            .attr("stroke", color(i))
            .attr("stroke-width", 2)
            .attr("d", valueline);

        svg.selectAll(`.dot-${countryId}`)
            .data(d.filteredData)
            .enter().append("circle")
            .attr("class", `dot dot-${countryId}`)
            .attr("cx", function (d) { return x(d.year); })
            .attr("cy", function (d) { return y(d.value); })
            .attr("r", 5)
            .attr("fill", color(i))
            .on("mouseover", function (event, d) {
                tooltip2.style("display", "block")
                    .transition()
                    .duration(200)
                    .style("opacity", .8);
                tooltip2.html(`Country: ${countryId}<br>Year: ${d.year}<br>Population: ${d.value.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip2.transition()
                    .duration(500)
                    .style("opacity", 0)
                    .on("end", function() {
                        tooltip2.style("display", "none");
                    });
            });
    });

    const legend = svg.selectAll(".legend")
        .data(filteredCountries)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width + 20)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width + 40)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d["Country"]);
}).catch(function (error) {
    console.log("Error loading or processing data: ", error);
});
