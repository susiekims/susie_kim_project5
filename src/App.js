import React, { Component } from 'react';
import './App.css';


import Table from './Table'
import TableRow from './TableRow'
import firebase from './firebase';

const dbRef = firebase.database().ref('August');

// get input from user for each item: name, date, category, amount
// add event listener for button to add new row
// when clicked, add new row
// add up totals for each category
// display totals for each
// save budget so user can come back to it

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
        rows : [ TableRow ],
        // loading: false 
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
      // create variable to represent new row
      // push that onto firebase
      const newRowKey = dbRef.push({
        key: '',
        item: '',
        date: '',
        category: '',
        earned: '',
        spent: ''
      })
      console.log(newRowKey);

      // const NewRow = new TableRow();
      // NewRow.key = newRowKey;
      // console.log(TableRow);
      // rows.push(NewRow);
      // this.setState({
      //     rows: rows
      // })
  }

  // function to get data from variable and change it into more accessible form
  sortData = (obj) => {
    console.log('sort data');

    // create new array called rowArray from object which is passed down from .on('value')
    const rowArray = Object.entries(obj).map((row) => {
      console.log(row);

      // each item in an array is an object which contain these properties
      return ({
        key: row[0],
        item: row[1].item,
        category: row[1].title,
        date: row[1].date,
        earned: row[1].earned,
        spent: row[1].spent
        
      });
    })
    // change the state of App
    // reassign value of rows to rowArray
    this.setState({
      rows: rowArray
    })
    console.log(rowArray);
  }

  // function to push to firebase
  // accepts the parameter of data, which is the data contained in a row
  pushToFirebase = (key, data) => {
    console.log('pushed to firebase');
    console.log(key, data)

    ////// this is broken! do something like this//////////
    // create database ref that refers to key
    // const row = firebase.database().ref(`/${key}`);
    // row.set({
    //   [data.key]: data.value
    // })
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
        <Table addRow={this.addRow} data={this.state.rows} pushToFirebase={this.pushToFirebase}/>
        <section className="summary">
          <h2>Total earned:<span></span></h2>
          <h2>Total spent:<span></span></h2>
        </section>
      </div>
    );
  }
}

// export app to be used in DOM
export default App;
