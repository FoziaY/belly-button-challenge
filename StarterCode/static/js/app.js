let dataurl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetching a json data
d3.json(dataurl).then(function(data) {
    console.log(data);
});

// Creating function that populates dropdown and displays charts
function populate_dropdown() {
    let dropdown = d3.select("#selDataset");

    d3.json(dataurl).then((data) => {
        let sample_id = data.names;

        for (let id of sample_id) {
            dropdown.append("option").attr("value", id).text(id);
        }

        let first_entry = sample_id[0];

        // Calling functions for chart creation and metadata display
        make_bar(first_entry);
        make_bubble(first_entry);
        display_metadata(first_entry);
    });
}

// Creating function to populate the bar chart
function make_bar(sample_data) {
    d3.json(dataurl).then((data) => {
        let sample = data.samples;
        let filter_result = sample.filter(entry => entry.id === sample_data);

        let first_result = filter_result[0];
        console.log(first_result);

        let sample_values = first_result.sample_values.slice(0, 10);
        let otu_ids = first_result.otu_ids.slice(0, 10).map(item => "OTU " + item);
        let otu_labels = first_result.otu_labels.slice(0, 10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        // Creating trace for bar chart
        let trace = {
            x: sample_values.reverse(),
            y: otu_ids.reverse(),
            text: otu_labels.reverse(),
            type: "bar",
            orientation: "h"
        };

        let layout = { title: "Top Ten OTUs" };
        Plotly.newPlot("bar", [trace], layout);
    });
}

// Creating function to populate the bubble chart
function make_bubble(sample_data) {
    d3.json(dataurl).then((data) => {
        let sample = data.samples;
        let filter_result = sample.filter(entry => entry.id === sample_data);

        let first_result = filter_result[0];
        console.log(first_result);

        let otu_ids = first_result.otu_ids;
        let sample_values = first_result.sample_values;
        let otu_labels = first_result.otu_labels;

        // Creating trace for bubble chart
        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Viridis'
            }
        };

        let layout = {
            title: 'Bubble Chart - OTU IDs vs Sample Values',
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
        };

        Plotly.newPlot("bubble", [trace], layout);
    });
}

// Creating function to display metadata
function display_metadata(sample_data) {
    d3.json(dataurl).then((data) => {
        let metadata = data.metadata;
        let filter_result = metadata.filter(entry => entry.id === parseInt(sample_data));

        let metadata_panel = d3.select("#sample-metadata");
        metadata_panel.html("");

        Object.entries(filter_result[0]).forEach(([key, value]) => {
            metadata_panel.append("p").text(`${key}: ${value}`);
        });
    });
}

populate_dropdown();
