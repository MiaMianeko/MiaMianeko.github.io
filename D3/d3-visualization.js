// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const nextButtons = document.querySelectorAll(".next-slide");

    // Function to show the specified slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    // Initialize the first slide as active
    showSlide(currentSlide);

    // Event listener for the "Next" button
    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                showSlide(currentSlide);
            } else {
                alert("You have reached the end of the slides.");
            }
        });
    });

    // D3 Visualization Setup

    // Function to update dropdowns with unique options
    function updateDropdowns(data, selectId) {
        const selects = document.querySelectorAll(selectId);
        selects.forEach(select => {
            const uniqueCountries = Array.from(new Set(data.map(d => d.Country)));
            const options = uniqueCountries.map(country => `<option value="${country}">${country}</option>`).join('');
            select.innerHTML = options;
        });
    }

    // Slide 1: Red List Index Over Time
    const svg1 = d3.select("#chart1").append("svg").attr("width", 800).attr("height", 400);
    const margin1 = { top: 20, right: 30, bottom: 30, left: 40 };
    const width1 = +svg1.attr("width") - margin1.left - margin1.right;
    const height1 = +svg1.attr("height") - margin1.top - margin1.bottom;

    const g1 = svg1.append("g")
        .attr("transform", `translate(${margin1.left},${margin1.top})`);

    d3.csv("./dataset/red_list_index_country_timeseries.csv").then(data => {
        const parseTime = d3.timeParse("%Y");
        updateDropdowns(data, '#country-select-slide1');
        data.forEach(d => d.Year = parseTime(d.Year));
        const x = d3.scaleTime().rangeRound([0, width1]);
        const y = d3.scaleLinear().rangeRound([height1, 0]);

        x.domain(d3.extent(data, d => d.Year));
        y.domain([0, d3.max(data, d => +d.Value)]);

        g1.append("g")
            .attr("transform", `translate(0,${height1})`)
            .call(d3.axisBottom(x));

        g1.append("g")
            .call(d3.axisLeft(y));

        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Value));

        function updateChart() {
            const selectedCountry = document.querySelector('#country-select-slide1').value;
            const filteredData = data.filter(d => d.Country === selectedCountry);
            g1.selectAll('*').remove(); // Clear previous content

            x.domain(d3.extent(filteredData, d => d.Year));
            y.domain([0, d3.max(filteredData, d => +d.Value)]);

            g1.append("g")
                .attr("transform", `translate(0,${height1})`)
                .call(d3.axisBottom(x));

            g1.append("g")
                .call(d3.axisLeft(y));

            g1.append("path")
                .data([filteredData])
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        }

        // Initialize chart with default selection
        updateChart();

        // Event listener for dropdown change
        document.querySelector('#country-select-slide1').addEventListener('change', updateChart);

        // Event listener for year slider
        document.getElementById('year-slider-slide1').addEventListener('input', function() {
            const year = +this.value;
            const filteredData = data.filter(d => d.Year.getFullYear() <= year && d.Country === document.querySelector('#country-select-slide1').value);
            g1.selectAll('*').remove(); // Clear previous content

            // Find the minimum and maximum values in the filtered data
            const minYValue = d3.min(filteredData, d => +d.Value);
            const maxYValue = d3.max(filteredData, d => +d.Value);
            x.domain(d3.extent(filteredData, d => d.Year));
            y.domain([minYValue, maxYValue]);

            g1.append("g")
                .attr("transform", `translate(0,${height1})`)
                .call(d3.axisBottom(x));

            g1.append("g")
                .call(d3.axisLeft(y));

            g1.append("path")
                .data([filteredData])
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });
    });

    // Slide 2: Species Vulnerability by Country
    const svg2 = d3.select("#chart2").append("svg").attr("width", 800).attr("height", 400);
    const margin2 = { top: 20, right: 30, bottom: 30, left: 40 };
    const width2 = +svg2.attr("width") - margin2.left - margin2.right;
    const height2 = +svg2.attr("height") - margin2.top - margin2.bottom;

    const g2 = svg2.append("g")
        .attr("transform", `translate(${margin2.left},${margin2.top})`);

    d3.csv("./dataset/country_vulnerable.csv").then(data => {
        updateDropdowns(data, '#species-select-slide2');
        const x = d3.scaleBand().rangeRound([0, width2]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height2, 0]);

        x.domain(data.map(d => d.Country));
        y.domain([0, d3.max(data, d => +d.Value)]);

        g2.append("g")
            .attr("transform", `translate(0,${height2})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        g2.append("g")
            .call(d3.axisLeft(y));

        g2.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Country))
            .attr("y", d => y(d.Value))
            .attr("width", x.bandwidth())
            .attr("height", d => height2 - y(d.Value));
    });

    // Slide 3: Protected Areas Comparison
    const svg3 = d3.select("#chart3").append("svg").attr("width", 800).attr("height", 400);
    const margin3 = { top: 20, right: 30, bottom: 30, left: 40 };
    const width3 = +svg3.attr("width") - margin3.left - margin3.right;
    const height3 = +svg3.attr("height") - margin3.top - margin3.bottom;

    const g3 = svg3.append("g")
        .attr("transform", `translate(${margin3.left},${margin3.top})`);

    function updateChart(areaType) {
        d3.csv("./dataset/country_terrestrial_protected_area.csv").then(data => {
            updateDropdowns(data, '#country-select-slide3');
            data = data.filter(d => d.DOMAIN === areaType);
            const x = d3.scaleBand().rangeRound([0, width3]).padding(0.1);
            const y = d3.scaleLinear().rangeRound([height3, 0]);

            x.domain(data.map(d => d.Country));
            y.domain([0, d3.max(data, d => +d.Value)]);

            g3.selectAll("*").remove(); // Clear previous content

            g3.append("g")
                .attr("transform", `translate(0,${height3})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            g3.append("g")
                .call(d3.axisLeft(y));

            g3.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.Country))
                .attr("y", d => y(d.Value))
                .attr("width", x.bandwidth())
                .attr("height", d => height3 - y(d.Value));
        });
    }

    updateChart("TERRESTRIAL");

    // Handle area type toggle
    document.querySelectorAll('input[name="area-type-slide3"]').forEach(input => {
        input.addEventListener('change', function() {
            const areaType = this.value;
            updateChart(areaType);
        });
    });
});
