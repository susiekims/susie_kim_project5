import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

class Chart extends Component {

    // componentDidUpdate() {
    //     console.log('hello!');
        
    // 

    constructor(props) {
        super(props);
        this.state = {
            options: {
                maintainAspectRatio: false,
            },
        //     chartData: {
        //         labels: ["Groceries", "Transportation", "Entertainment", "Housing"],
        //         datasets: [{
        //         label: "My First dataset",
        //         backgroundColor: ['red','yellow','green','blue'],
        //         data: [this.props.totals.groceries, 
        //             this.props.totals.transportation , 
        //             this.props.totals.entertainment, 
        //             this.props.totals.housing],
        //     }]
        //   }

        }
    }


    // updateChart = () => {
    //     this.forceUpdate();
    // }

    render() {
        // console.log(this.props.totals, "chart!!!");
        // const chartData = {
        //     labels: ["Groceries", "Transportation", "Entertainment", "Housing"],
        //     datasets: [{
        //       label: "My First dataset",
        //       backgroundColor: ['red','yellow','green','blue'],
        //       data: [this.props.totals.groceries, 
        //             this.props.totals.transportation , 
        //             this.props.totals.entertainment, 
        //             this.props.totals.housing],
        //     }]
        //   }
      
        return (
            <div className="chart">
               <Pie data={this.props.chartData} />
               {/* <button onClick={this.updateChart}>REFRESH CHART</button> */}
            </div>
        )
    }
}

export default Chart;