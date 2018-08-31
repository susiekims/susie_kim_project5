import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';

class Chart extends Component {
    constructor() {
        super();
        this.state = {
            options: {
                maintainAspectRatio: false,
            }
        }
    }

    render() {
        return (
            <div className="chart">
               <Pie data={this.props.chartData} />
            </div>
        )
    }
}

export default Chart;