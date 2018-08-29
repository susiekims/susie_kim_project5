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


class App extends Component {
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
      this.sortData(snapshot.val());
    });
  }

  pushToFirebase = (key, data) => {
    // create database ref that refers to key
    const row = firebase.database().ref(`/${key}`)
    row.set({
      [data.key]: data.value
    })
  }

  addRow = () => {
    console.log('add row');
    // console.log(row);
    // clone existing array
      // const rows = Array.from(this.state.rows);
      const newRowKey = dbRef.push({
        item: '',
        date: '',
        category: '',
        earned: '',
        spent: ''
      }).key;

      console.log(newRowKey);

      // const NewRow = new TableRow();
      // NewRow.key = newRowKey;
      // console.log(TableRow);
      // rows.push(NewRow);
      // this.setState({
      //     rows: rows
      // })
  }

  sortData = (obj) => {
    console.log('sort data');

    const rowArray = Object.entries(obj).map((row) => {
      console.log(row);
      return ({
        key: row[0],
        item: row[1].item,
        category: row[1].title,
        date: row[1].date,
        earned: row[1].earned,
        spent: row[1].spent
        
      });
    })
        this.setState({
            rows: rowArray
          })
      console.log(rowArray);
  }
  setLoading = () => {
    this.setState({
      loading: true
    })
  }
  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Susie's Super Cool Budget App</h1>
        </header>
        <Table addRow={this.addRow} data={this.state.rows} />
        <section className="summary">
          <h2>Total earned:<span></span></h2>
          <h2>Total spent:<span></span></h2>
        </section>
      </div>
    );
  }
}

export default App;
