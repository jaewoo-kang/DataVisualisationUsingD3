// Walmart's grow by timeline
// Reference: https://observablehq.com/@d3/walmarts-growth?intent=fork

async function createChart() {
    const svg = d3.select("#chart5")
        .attr("viewBox", [0, 0, 960, 600])
        .style("position", "relative")
        .style("top", "20px")
        .attr("preserveAspectRatio", "xMidYMid meet");

    svg.append("text")
        .attr("x", 530)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "17pt")
        .style("font-weight", "bold")
        .text("Walmart's grow by timeline");

    const us = await loadUsData(); // Load map of the US

    // GeoPath of USA
    svg.append("path")
        .datum(topojson.merge(us, us.objects.states.geometries))
        .attr("fill", "#ddd")
        .attr("d", d3.geoPath());

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", d3.geoPath());

    const g = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "black");

    const data = await loadData(); // Walmart data load

    const dot = g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("transform", d => `translate(${d[0]}, ${d[1]})`)
        .attr("r", 0)
        .style("opacity", 0);

    let previousDate = -Infinity;

    // top controller to play and display time line
    const controlsContainer = d3.select("body").append("div")
        .attr("id", "controls") // html id config
        .style("position", "absolute")
        .style("top", "150px")
        .style("right", "15%")
        .style("transform", "translateX(-50%)")
        .style("display", "none")
        .style("align-items", "center")
        .style("gap", "10px");

    const slider = controlsContainer.append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", data.length - 1)
        .attr("value", 0)
        .attr("step", 1)
        .style("width", "150px");

    const playButton = controlsContainer.append("button")
        .text("Play")
        .style("font-size", "14px");

    const dateLabel = controlsContainer.append("div")
        .attr("id", "date-label")
        .style("font-size", "7pt");

    let interval;
    let isPlaying = false;

    // update chart depends on the slider
    slider.on("input", function () {
        const index = +this.value;
        const currentDate = data[index].date;
        updateChart(currentDate);
    });

    // play-button to start emulation
    playButton.on("click", function () {
        if (isPlaying) {
            clearInterval(interval);
            playButton.text("Play");
        } else {
            let index = +slider.property("value");
            interval = setInterval(() => {
                if (index >= data.length - 1) {
                    clearInterval(interval);
                    playButton.text("Play");
                    isPlaying = false;
                } else {
                    slider.property("value", ++index);
                    const currentDate = data[index].date;
                    updateChart(currentDate);
                }
            }, 20);
            playButton.text("Pause");
        }
        isPlaying = !isPlaying;
    });

    // update chart
    function updateChart(date) {
        dot.filter(d => d.date <= date)
            .transition().duration(100)
            .attr("r", 3)
            .style("opacity", 1);

        dot.filter(d => d.date > date)
            .transition().duration(100)
            .attr("r", 0)
            .style("opacity", 0);

        dateLabel.text(d3.utcFormat("%Y %b %d")(date)); // 날짜 포맷
    }

    return svg.node();
}

// Load US-map Data
async function loadUsData() {
    const us = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@1/us/10m.json");
    us.objects.lower48 = {
        type: "GeometryCollection",
        geometries: us.objects.states.geometries.filter(d => d.id !== "02" && d.id !== "15")
    };
    return us;
}

// Load Walmart Data
async function loadData() {
    const rawData = await d3.tsv("../data/walmart.tsv");
    const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);

    return rawData
        .map(d => {
            const point = projection([+d["0"], +d["1"]]);
            point.date = d3.utcParse("%m/%d/%Y")(d.date);
            return point;
        })
        .filter(d => d.date)
        .sort((a, b) => a.date - b.date);
}

// create chart
(async () => {
    await createChart();
})();
