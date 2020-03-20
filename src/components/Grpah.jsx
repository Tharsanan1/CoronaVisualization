import React from 'react'
import CanvasJSReact from './canvasjs.react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const axios = require('axios');


const options = [
    
    { value: 'Au', label: 'Australia' },
    { value: 'CA', label: 'Canada' },
    { value: 'CN', label: 'China' },
    { value: 'DK', label: 'Denmark' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'IT', label: 'Italy' },
    { value: 'JP', label: 'Japan' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'SG', label: 'Singapore' },
    { value: 'ES', label: 'Spain' },
    { value: 'LK', label: 'Srilanka' },
    { value: 'US', label: 'USA' },
    { value: 'GB', label: 'United Kingdom' },
    //https://thevirustracker.com/api?ref=producthunt#indexpage
];
const defaultOption = options[0];

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yLabel: "new_daily_cases",
            selectedCountry: "LK",
            options: {
                animationEnabled: true,

                axisX: {

                },
                axisY: {
                    title: "Count",
                    includeZero: false
                },
                data: [{
                    type: "spline",
                    dataPoints: [
                    ]
                }]
            }
        }
        this.fetchData = this.fetchData.bind(this);
        this.fetchData(this.state.selectedCountry);
        this.dropDownSelected = this.dropDownSelected.bind(this);
        this.radioChanged = this.radioChanged.bind(this);
    }


    dropDownSelected(event) {
        this.setState({ selectedCountry: event.value });
        this.fetchData(event.value);
    }

    fetchData(countryCode) {
        axios.get('https://thevirustracker.com/free-api?countryTimeline=' + countryCode)
            .then((response) => {
                let dataPoints = [];
                let count = 0;
                for (const key of Object.keys(response.data.timelineitems[0])) {
                    count++;
                    let dataPoint = {
                        x: count,
                        y: response.data.timelineitems[0][key][this.state.yLabel]
                    }
                    dataPoints.push(dataPoint);
                }
                dataPoints.pop();
                dataPoints.pop();
                let options = { ...this.state.options }
                options.data[0] = {
                    type: "spline",
                    dataPoints: dataPoints
                }
                this.setState({
                    options: options
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    radioChanged(event) {
        this.setState({
            yLabel: event
        }, () => {
            this.fetchData(this.state.selectedCountry);

        })

    }

    render() {

        return (
            <div style={{margin:"40px"}}>
                <Dropdown options={options} onChange={this.dropDownSelected} value={this.state.selectedCountry} placeholder="Select an option" />
                <div style={{ marginBottom: "20px" }}></div>
                <RadioGroup onChange={this.radioChanged} value={this.state.yLabel} horizontal>
                    <RadioButton value="new_daily_cases">
                        Daily New Cases
                    </RadioButton>
                    <RadioButton value="new_daily_deaths">
                        Daily New Deaths
                    </RadioButton>
                    <RadioButton value="total_cases">
                        Total Cases
                    </RadioButton>
                    <RadioButton value="total_recoveries">
                        Total Recoveries
                    </RadioButton>
                    <RadioButton value="total_deaths">
                        Total Deaths
                    </RadioButton>
                </RadioGroup>
                <div style={{ marginBottom: "20px" }}></div>
                <CanvasJSChart options={this.state.options} />
            </div>
        );
    }
}


export default Graph;