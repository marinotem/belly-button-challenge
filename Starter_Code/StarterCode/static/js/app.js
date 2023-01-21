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

// creating function connecting to the HTML element for when a user selects a subject from the list
function optionChanged(subj_id) {
    console.log(subj_id);
    otuBarchart(subj_id)
    };


// creating the bar chart to connect when a new subject id is chosen
function otuBarchart(subj_id) {
    d3.json(url).then(function(data){
    let list_of_samples = data.samples;
    let identifier = list_of_samples.filter(sample => sample.id === subj_id);
    let filters = identifier[0];
    let otuID = filters.sample_values.slice(0,10).reverse();
    let otuVals = filters.otu_ids.slice(0,10).reverse();
    let otuLabels = filters.otu_labels.slice(0, 10).reverse();
    data = 
        {
            x: otuVals,
            y: otuID.map(object => 'OTU ' + object),
            name: otuLabels,
            type:'bar',
            orientation: 'h'
        };
    let barLayout = {
        title: `Top 10 OTUs for Subject ${subj_id}`,
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID' }
    };
    Plotly.newPlot('bar', data, barLayout);
    let bubbleTrace = {
        x: filters.otu_ids,
        y: filters.sample_values,
        mode: 'markers',
        marker: {
            size: filters.sample_values,
            color: filters.otu_ids,
            colorscale: 'Portland'
        },
        text: filters.otu_labels,
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
        title: `OTUs for Subject ${subj_id}`,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })

};
function Plot(id) {
    d3.json(url).then(function (data) {
        let metadata = data.metadata;
        let gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
        let gaugeResult = gaugeArray[0];
        let wash = gaugeResult.wfreq;

        let gauge_trace =  [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wash,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number"
            }
        ];
        let gauge_data = [gauge_trace];
        let gauge_layout = {
            width: 600, height: 500, margin: { t: 0, b: 0 } 
        };
        Plotly.newPlot('myDiv', gauge_data, gauge_layout)
    })
};

//Build new upon ID change
function optionChanged(id) {
    Plots(id);
    panelInfo(id);
};

//Test Subject Dropdown and initial function
function init() {
    let dropDown = d3.select('#selDataset');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        Panel(names[0]);
        Plots(names[0]);
        Plot(names[0])
    })
};
init();