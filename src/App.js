import React, { Component } from 'react';
import './App.css';


import Chart from './Chart';
import Table from './Table';
// import TableRow from './TableRow'
import firebase from './firebase';

const dbRef = firebase.database().ref('August');

// have initial row already pushed into firebase with empty strings so data
// everytime user creates a new row, push that row with empty strings to firebase
// get the unique key back for that row
// when user updates that row, set the values for that row according to the user changes instead of pushing a new item to the database

// create App class
class App extends Component {
  // create default state
  // state has a property of rows which is an array that contains the class TableRow
  constructor() {
    super();
    this.state = {
      rows : [],
      categories : [
        'groceries',
        'transportation',
        'income',
        'entertainment',
        'housing'
      ],
      totals: {
        groceries: 0,
        transportation: 0,
        income: 0,
        entertainment: 0,
        housing: 0,
        spending: 0
      },
      data: {
        labels: ["Groceries", "Transportation", "Entertainment", "Housing"],
        datasets: [{
          label: "My First dataset",
          backgroundColor: ['red','yellow','green','blue'],
          data: [10, 10 , 10, 10],
        }]
      }
    }
  }
  componentDidMount() {
    console.log('App component did mount');

    // add event listeneer to tell us if the database has anything on load and when anything changes
    dbRef.on('value', (snapshot) => {
      console.log(snapshot.val());

      // pass the value of the snapshot into sortData()
      this.sortData(snapshot.val());
    });
  }

  // function to addRow to table
  // triggered onClick of button
  addRow = () => {
    console.log('add row');

    // push an empty row onto firebase
      dbRef.push({
        key: '',
        item: '',
        date: '',
        category: '',
        earned: '',
        spent: '',
      })

  }

  deleteRow = (e) => {
    console.log('deleting row');
    // console.log(e.target.id);
    const rowRef = firebase.database().ref(`August/${e.target.id}`)
    rowRef.remove();
  }

  // function to get data from variable and change it into more accessible form
  sortData = (obj) => {
    console.log('sort data called');

    // if there is nothing on the database, obj is empty row
    if (obj === null) {
      obj = {};
    } 
    // create new array called rowArray from object which is passed down from .on('value')
    const rowArray = Object.entries(obj).map((row) => {

      // each item in an array is an object which contain these properties
      return ({
        key: row[0],
        item: row[1].item,
        category: row[1].category,
        date: row[1].date,
        earned: row[1].earned && parseInt(row[1].earned),
        spent: row[1].spent && parseInt(row[1].spent)
        
      });
    })
    // change the state of App
    // reassign value of rows to rowArray
    this.setState({
      rows: rowArray
    })
    console.log(rowArray);
    // this.displayData(rowArray);

    this.state.categories.forEach((category)=> {
        this.getTotals(rowArray, category);
    })

    this.getIncome(rowArray);
    this.getTotalSpending(rowArray);

  }

  getIncome = (data) => {
    console.log('getting income');
    let totalIncome = data.filter((row)=> {
      return row.earned > 0;
    }).map((row) => {
      return row.earned;
    }).reduce((a,b)=> a + b, 0);

    console.log(totalIncome)
    this.setState({
      totals: {
        ...this.state.totals,
        income: totalIncome,
      }
    }) 
    document.getElementById(`total-earned`).innerHTML = '$' + totalIncome.toFixed(2); 
  }

  getTotalSpending = (data) => {
    let totalSpending = data.filter((row)=> {
      return row.spent > 0;
    }).map((row)=> {
      return row.spent;
    }).reduce((a,b) => a + b, 0);
    console.log(totalSpending)
    this.setState({
      totals: {
        ...this.state.totals,
        spending: totalSpending,
      }
    });
    document.getElementById(`total-spent`).innerHTML = '$' + totalSpending.toFixed(2); 
  }

 

  getTotals = (data, category) => {
    let filteredData = data.filter((row) => {
      return row.category === category && row.spent ;
    })
    if (filteredData.length > 0) {
      const arrayOfNumber = filteredData.map((row)=> {
        return row.spent;
      })
      let total = arrayOfNumber.reduce((a, b) => a + b, 0);
      this.setState({
        totals: {
          ...this.state.totals,
          [category]: total,
        }
      
      }) 
      document.getElementById(`total-${category}`).innerHTML = '$' + total.toFixed(2);
    }
    
  }

  // function to push to firebase
  // accepts the parameter of data, which is the data contained in a row
  pushToFirebase = (target, value, data) => {
    console.log('pushed to firebase');
    // console.log(data)
    console.log(data.key);

    firebase.database().ref(`August/${data.key}`).once('value', (snapshot)=> {
      console.log(snapshot.val());
      // create variable represent current state of the firebase node
      let currentVal = snapshot.val();

      // assign = merging the current value with what i want to change
      Object.assign(currentVal, {[target]:value});
      console.log(currentVal);

      //now set the data to the new value
      firebase.database().ref(`August/${data.key}`).set(currentVal);
    })
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Susie's Super Cool Budget App</h1>
        </header>
        {/* render Table element
         - pass on the prop addRow which is equal to addRow function
         - pass on the prop data which is an array of objects that contain the data in the Rows
         - pass on the prop pushToFirebase, which is equal to pushToFirebase functon
        */}
        <Table rows={this.state.rows} deleteRow={this.deleteRow} pushToFirebase={this.pushToFirebase}/>
        <button onClick={this.addRow}>Add Row</button>

        <div className='summary-container'>
          <Chart totals={this.state.totals} chartData={this.state.data} />
          <section className="summary">
            <h2>Total earned: <span id="total-earned"></span></h2>
            <h2>Total spent: <span id="total-spent"></span></h2>
            <h3>Total spent on groceries: <span id="total-groceries"></span></h3>
            <h3>Total spent on transportation: <span id="total-transportation"></span></h3>
            <h3>Total spent on entertainment: <span id="total-entertainment"></span></h3>
            <h3>Total spent on housing: <span id="total-housing"></span></h3>
          </section>
        </div>
      </div>
    );
  }
}

// export app to be used in DOM
export default App;
