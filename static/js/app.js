
console.log('app.js');

const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function Bar(sampleId) {
    console.log(`Bar(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data);

        let samples = data.samples;
        let A = samples.filter(s => s.id == sampleId);
        let result = A[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0,11).map(otuId => `OTU ${otuId}`).reverse();

        //Bar graph
        let barData = {
            x: sample_values.slice(0,11).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0,11).reverse(),
            orientation: 'h'
        };

        let barArray = [barData];

        let barLayout = {
            margin: {t: 100, l: 100}
        };

        Plotly.newPlot('bar', barArray, barLayout);
    })
}

// Array and create the trace
function Bubble(sampleId) {
    console.log(`Bubble(${sampleId})`);

    d3.json(url).then(data => {
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Mars'
            }
        }

        let bubArray = [bubbleData];

        
        let bubbleLayout = {
            margin: {t: 30},
            xaxis: {title: "OTU ID"},
        };

        
        Plotly.newPlot('bubble', bubArray, bubbleLayout);
    })
}

//Demographic Info
function Meta(sampleId) {
    console.log(`Meta(${sampleId})`);

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log(metadata);

        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographicInfo = d3.select('#sample-metadata');

        demographicInfo.html('');
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        });
    });
}

function New_opt(sampleId) {
    console.log(`New_opt, new value: ${sampleId}`);

    Bar(sampleId);
    Bubble(sampleId);
    Meta(sampleId);
    DrawGauge(sampleId);
}

function BBBDasboard() {
    console.log('BBBDasboard');

    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {
        console.log('Data');

        let Name = data.names;
        console.log('Names:', Name);

        for (let i = 0; i < Name.length; i++) {
            let sampleId = Name[i];
            selector.append('option').text(sampleId).property('value', sampleId);
        };

        // Dropdown menu
        selector.on('change', function() {
            let selectedValue = selector.property('value');
            console.log(`change ID: ${selectedValue}`);
            // Update graphs
            New_opt(selectedValue);
        });

        
        New_opt(selector.property('value'));

    });


}

BBBDasboard();
