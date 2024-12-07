//Reference: https://observablehq.com/@d3/us-airports-voronoi?intent=fork

const margin4 = { top: 50, right: 70, bottom: 30, left: 70 },
    width4 = 1170 - margin4.left - margin4.right,
    height4 = 700 - margin4.top - margin4.bottom;

const svg4 = d3.select("#chart4")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
    .append("g")
    .attr("transform", `translate(${margin4.left},${margin4.top})`);

Promise.all([
    d3.json("../data/states-albers-10m.json"),
    d3.csv("../data/airports.csv", d => ({
        type: "Feature",
        properties: d,
        geometry: {
            type: "Point",
            coordinates: [+d.longitude, +d.latitude]
        }
    }))
]).then(([us, data]) => {
    console.log("US data:", us);
    console.log("Airports data:", data);
}).catch(error => {
    console.error("Error loading or processing data:", error);
});

// Load data
Promise.all([
    d3.json("../data/states-albers-10m.json"),  // Load US states TopoJSON file
    d3.csv("../data/airports.csv", d => ({
        type: "Feature",
        properties: d,
        geometry: {
            type: "Point",
            coordinates: [+d.longitude, +d.latitude]
        }
    }))  // Load and convert airports data
]).then(([us, data]) => {

    const projection4 = d3.geoAlbers().scale(1300).translate([width4 / 2 - 27, height4 / 2 - 5]);

    const geoPath = d3.geoPath(projection4);

    // Draw states
    svg4.append("path")
        .datum(topojson.merge(us, us.objects.states.geometries.filter(d => d.id !== "02" && d.id !== "15")))
        .attr("fill", "#ddd")
        .attr("d", d3.geoPath());

    // borders
    svg4.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", d3.geoPath());

    // Draw Voronoi polygons
    svg4.append("g")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("pointer-events", "all")
        .selectAll("path")
        .data(d3.geoVoronoi().polygons(data).features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .append("title")
        .text(d => {
            const p = d.properties.site.properties;
            return `${p.name} Airport\n${p.city}, ${p.state}`;
        });

    // Draw airport points
    svg4.append("path")
        .datum({ type: "FeatureCollection", features: data })
        .attr("d", geoPath.pointRadius(1.5));
}).catch(error => {
    console.error("Error loading or processing data:", error);
});

svg4.append("foreignObject")
    .attr("x", -30)
    .attr("y", -30)
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", margin4.top)
    .append("xhtml:div")
    .style("font-size", "16pt")
    .style("font-weight", "bold")
    .style("text-align", "left")
    .style("width", "100%")
    .style("pointer-events", "none")
    .html("U.S. airports Voronoi");



