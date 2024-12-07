// Birth Rate Trends by Country (per 1,000 people)
const margin2 = { top: 50, right: 130, bottom: 30, left: 70 },
    width2 = 800 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

const svg2 = d3.select("#chart3")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

svg2.append("text")
    .attr("x", (width2 + margin2.left + margin2.right) / 2)
    .attr("y", margin2.top / 2 - 60)
    .attr("text-anchor", "middle")
    .style("font-size", "16pt")
    .style("font-weight", "bold")
    .text("Birth Rate Trends by Country (per 1,000 people)");

const tooltip3 = d3.select("#tooltip3");
tooltip3.style("display", "none");

d3.csv("../data/birthrate.csv").then(function (data) {
    // console.log("Data loaded: ", data);

    const years = ["1960", "1970", "1980", "1990", "2000", "2010", "2020"];
    data.forEach(d => {
        d.filteredData = years.map(year => ({ year: year, value: +d[year] }));
    });

    const includeCountries = ["United States", "China", "South Korea", "India", "Taiwan", "Japan", "Germany", "France", "United Kingdom", "Thailand", "Canada"];
    const filteredCountries = data.filter(d => includeCountries.includes(d["Country"]));

    const x = d3.scaleLinear().domain([1960, 2020]).range([0, width2]);
    const y = d3.scaleLinear().domain([5, 50]).range([height2, 5]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const valueline = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));

    svg2.append("g")
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg2.append("g").call(d3.axisLeft(y));

    filteredCountries.forEach(function (d, i) {
        const countryId = `${d["Country"]}`;

        svg2.append("path")
            .datum(d.filteredData)
            .attr("id", countryId)
            .attr("fill", "none")
            .attr("stroke", color(i))
            .attr("stroke-width", 2)
            .attr("d", valueline);

        // Add circles for each data point for tooltip
        svg2.selectAll(`.dot-${countryId}`)
            .data(d.filteredData)
            .enter().append("circle")
            .attr("class", `dot dot-${countryId}`)
            .attr("cx", function (d) { return x(d.year); })
            .attr("cy", function (d) { return y(d.value); })
            .attr("r", 5)
            .attr("fill", color(i))
            .on("mouseover", function (event, d) {
                tooltip3.style("display", "block")  // 툴팁을 표시
                    .transition()
                    .duration(200)
                    .style("opacity", .8);
                tooltip3.html(`Country: ${countryId}<br>Year: ${d.year}<br>Birth Rate: ${d.value.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip3.transition()
                    .duration(500)
                    .style("opacity", 0)
                    .on("end", function() {
                        tooltip3.style("display", "none");  // 툴팁 숨기기
                    });
            });
    });

    const legend = svg2.selectAll(".legend")
        .data(filteredCountries)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width2 + 20)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width2 + 40)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d["Country"]);
}).catch(function (error) {
    console.log("Error loading or processing data: ", error);
});
