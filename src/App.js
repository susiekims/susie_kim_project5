import React, { Component } from 'react';
import './App.css';


import Table from './Table'
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
          // 'misc',
          'housing'
        ]
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
      this.displayData(rowArray, category);
    })


  }

  displayData = (data, category) => {
    let filteredData = data.filter((row) => {
      return row.category === category && row.spent ;
    })
    console.log(filteredData, category);
    if (filteredData.length > 0) {

      const arrayOfNumber = filteredData.map((row)=> {
      
        return row.spent;
      })
      console.log(arrayOfNumber, category);
      
      let total = arrayOfNumber.reduce((a, b) => a + b, 0);
      // console.log(total);
      document.getElementById(`total-${category}`).innerHTML = '$' + total;

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
        <section className="summary">
          <h2>Total earned: <span id="total-earned"></span></h2>
          <h2>Total spent: <span id="total-epent"></span></h2>
          <h3>Total spent on groceries: <span id="total-groceries"></span></h3>
          <h3>Total spent on transportation: <span id="total-transportation"></span></h3>
          <h3>Total spent on entertainment: <span id="total-entertainment"></span></h3>
          <h3>Total spent on housing: <span id="total-housing"></span></h3>
          <h3>Total spent on income: <span id="total-income"></span></h3>
        </section>
      </div>
    );
  }
}

// export app to be used in DOM
export default App;
