import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

class Chart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: {
                maintainAspectRatio: false,
            },
        }
    }

    render() {
        return (
            <div className="chart">
                <h2>Expense Breakdown</h2>
               <Pie data={this.props.chartData} />
               {
                   this.props.chartData.datasets[0].data.length === 0 && <p>Nothing to see here. Create categories and enter transactions to see data.</p>
               }
            </div>
        )
    }
}

export default Chart;