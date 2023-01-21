//loading url via d3 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// just making sure it looks alright
d3.json(url).then(function(data) {
    let selected = d3.select("#selDataset");
    let names = data.names;
    for (let i = 0; i < names.length; i++) {
        selected.append('option').text(names[i])
    }
    console.log(names);
});

// adding in panel box function
function panelBox(subj_id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === subj_id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};   

// creating the bar chart to connect when a new subject id is chosen
function otuBarchart(subj_id) {
    d3.json(url).then(function(data){
    let list_of_samples = data.samples;
    let identifier = list_of_samples.filter(sample => sample.id === subj_id);
    let filters = identifier[0];
    let otuVals = filters.sample_values.slice(0,10).reverse();
    let otuID = filters.otu_ids.slice(0,10).reverse();
    let otuLabels = filters.otu_labels.slice(0, 10).reverse();
    h_trace = 
        {
            x: otuVals,
            y: otuID.map(object => 'OTU ' + object),
            name: otuLabels,
            type:'bar',
            orientation: 'h',
            marker: {
                color: "hotpink"
            }
        };
    let barLayout = {
        title: `Top 10 OTUs for Subject ${subj_id}`,
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID' },
    };
    let h_data = [h_trace];
    Plotly.newPlot('bar', h_data, barLayout);

    let bubbleTrace = {
        x: filters.otu_ids,
        y: filters.sample_values,
        mode: 'markers',
        marker: {
            size: filters.sample_values,
            color: filters.otu_ids,
            colorscale: 'Picnic'
        },
        text: filters.otu_labels,
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
        title: `OTUs for Subject ${subj_id}`,
        xaxis: { 
            title: 'OTU ID', 
            automargin: true,
            autorange: true,
        },
        yaxis: {
            title: 'Sample Values' , 
            automargin:true,
            autorange: true, 
        }
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, {displayModeBar: true});
    })

};

//Function to change stuff when subject id changes
function optionChanged(subj_id) {
    otuBarchart(subj_id);
    panelBox(subj_id);
};

//adding in initial for subject drop down and charts 
function init() {
    let dropDown = d3.select('#selDataset');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelBox(names[0]);
        otuBarchart(names[0]);
        otuBarchart(names[0])
    })
};
init();