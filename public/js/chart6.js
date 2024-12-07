//Reference: https://observablehq.com/@d3/world-choropleth/2

async function createChart() {
    const width = 1000;
    const height = 600;

    // Select the SVG element and set its viewBox
    const svg = d3.select("#chart6")
        .attr("viewBox", [0, 0, width, height])
        .style("position", "relative")
        .style("top", "20px")
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Add title to the chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "17pt")
        .style("font-weight", "bold")
        .text("World choropleth: Health-adjusted life expectancy, 2016. Data: WHO");

    // Load data files
    const hale = await d3.csv("../data/hale.csv");
    const world = await d3.json("../data/countries-50m.json");

    // Process and map data
    const rename = new Map([
        ["Antigua and Barbuda", "Antigua and Barb."],
        ["Bolivia (Plurinational State of)", "Bolivia"],
        ["Bosnia and Herzegovina", "Bosnia and Herz."],
        ["Brunei Darussalam", "Brunei"],
        ["Central African Republic", "Central African Rep."],
        ["Cook Islands", "Cook Is."],
        ["Democratic People's Republic of Korea", "North Korea"],
        ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
        ["Dominican Republic", "Dominican Rep."],
        ["Equatorial Guinea", "Eq. Guinea"],
        ["Iran (Islamic Republic of)", "Iran"],
        ["Lao People's Democratic Republic", "Laos"],
        ["Marshall Islands", "Marshall Is."],
        ["Micronesia (Federated States of)", "Micronesia"],
        ["Republic of Korea", "South Korea"],
        ["Republic of Moldova", "Moldova"],
        ["Russian Federation", "Russia"],
        ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
        ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
        ["Sao Tome and Principe", "São Tomé and Principe"],
        ["Solomon Islands", "Solomon Is."],
        ["South Sudan", "S. Sudan"],
        ["Swaziland", "eSwatini"],
        ["Syrian Arab Republic", "Syria"],
        ["The former Yugoslav Republic of Macedonia", "Macedonia"],
        ["United Republic of Tanzania", "Tanzania"],
        ["Venezuela (Bolivarian Republic of)", "Venezuela"],
        ["Viet Nam", "Vietnam"]
    ]);

    const haleData = hale.map(d => ({
        name: rename.get(d.country) || d.country,
        hale: +d.hale
    }));
    const valuemap = new Map(haleData.map(d => [d.name, d.hale]));

    // Create color scale
    const color = d3.scaleSequential(d3.extent(Array.from(valuemap.values())), d3.interpolateYlGnBu);

    // Set up projection and path
    const projection = d3.geoEqualEarth().fitSize([width, height], { type: "Sphere" });
    const path = d3.geoPath(projection);

    // Add countries to the map
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .join("path")
        .attr("fill", d => color(valuemap.get(d.properties.name)) || "#ccc")
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}\n${valuemap.get(d.properties.name) || "No data"}`);

    // Draw a border around the world
    svg.append("path")
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("d", path);

    // Add a legend
    // const legend = svg.append("g")
    //     .attr("transform", `translate(20,20)`);

    // legend.append("text")
    //     .attr("y", -10)
    //     .text("Healthy life expectancy (years)");

    // const legendScale = d3.scaleLinear()
    //     .domain(color.domain())
    //     .range([0, 260]);

    // legend.selectAll("rect")
    //     .data(d3.range(0, 1.05, 0.05))
    //     .join("rect")
    //     .attr("x", d => legendScale(d * color.domain()[1]))
    //     .attr("y", 0)
    //     .attr("width", 260 / 20)
    //     .attr("height", 10)
    //     .attr("fill", d => color(d * color.domain()[1]));

    // legend.append("g")
    //     .attr("transform", "translate(0,10)")
    //     .call(d3.axisBottom(legendScale).ticks(6).tickFormat(d3.format(".0f")));

    //vertical legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 30}, 50)`); // 오른쪽 상단에 배치

    legend.append("text")
        .attr("x", -120)
        .attr("y", -20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Healthy life expectancy (years)");

    // 범례 스케일 설정
    const legendHeight = 260;
    const legendScale = d3.scaleLinear()
        .domain(color.domain())
        .range([legendHeight, 0]);

    // 색상 막대 추가
    const legendAxis = legend.append("g")
        .selectAll("rect")
        .data(d3.range(color.domain()[0], color.domain()[1], 0.1))
        .join("rect")
        .attr("x", 0)
        .attr("y", d => legendScale(d))
        .attr("width", 10) 
        .attr("height", legendHeight / (color.domain()[1] - color.domain()[0]) / 10)
        .attr("fill", d => color(d));

    legend.append("g")
        .attr("transform", `translate(10, 0)`)
        .call(d3.axisRight(legendScale).ticks(5).tickFormat(d3.format(".0f")));

}

// Call createChart function when the script loads
createChart();
