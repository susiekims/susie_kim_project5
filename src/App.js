import React, { Component } from 'react';
import './App.css';

import Budget from './Budget';
import Chart from './Chart';
import Table from './Table';
import CategoryForm from './CategoryForm';
// import TableRow from './TableRow'
import firebase from './firebase';

// const augustRef = firebase.database().ref('August');
const dbRef = firebase.database().ref();
const septRef = firebase.database().ref('September');
const categoriesRef = firebase.database().ref('Categories');

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
      categories: [],
      // totals: {
      //   'Transportation': 0,
      //   'Entertainment': 0,
      //   'Housing': 0,
      //   'bills': 0,
      //   'Drugs': 0,
      //   'pet supplies': 0
      // }
      totals: []
    }
  }

  componentDidMount() {
    //console.log('App component did mount');

    // add event listeneer to tell us if the database has anything on load and when anything changes
    septRef.on('value', (snapshot) => {
    //  console.log(snapshot.val(), ' snapshot value');

      // pass the value of the snapshot into sortData()
      this.sortData(snapshot.val());
    });

    categoriesRef.on('value', (snapshot) => {
      this.sortCategories(snapshot.val());
    })
  }

  // function to addRow to table
  // triggered onClick of button
  addRow = () => {
   // console.log('add row');

    // push an empty row onto firebase
      septRef.push({
        key: '',
        item: '',
        date: '',
        category: '',
        earned: '',
        spent: '',
      })

  }

  // gets the id of the row user clicked the delete button on
  // removes that row from firebase
  deleteRow = (e) => {
    const rowRef = firebase.database().ref(`September/${e.target.id}`)
    rowRef.remove();
  }

  // function to get data from variable and change it into more accessible form
  sortData = (obj) => {
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
        earned: row[1].earned && parseFloat(row[1].earned),
        spent: row[1].spent && parseFloat(row[1].spent)
      });
    })
    // change the state of App
    // reassign value of rows to rowArray
    this.setState({
      rows: rowArray
    },() => {
      this.getTotals(rowArray);
      // console.log(rowArray,  ' roww array from sortdata cb')
    })
  }

  // function to get total amount of earned
  getIncome = (data) => {
    let totalIncome = data.filter((row)=> {
      return row.earned > 0;
    }).map((row) => {
      return row.earned;
    })
    .reduce((a,b)=> a + b, 0);

    /////// dont change this!!! the code will break!!!! ////////////
    const totals = Object.assign(this.state.totals,{income: totalIncome});
    ////////////////////////////////////////////////////////////////

    this.setState({totals}) 
  }

  /// get total amount spent
  getTotalSpending = (data) => {
    let totalSpending = data.filter((row)=> {
      return row.spent > 0;
    }).map((row)=> {
      return row.spent;
    }).reduce((a,b) => a + b, 0);
    this.setState({
      totals: {
        ...this.state.totals,
        spending: totalSpending,
      }
    });
  }

  getTotals = (data) => {
    
    /// MY CODE 
    // let totals = this.state.totals
    // let categories = this.state.categories;
    // // console.log(categories);   
    //   categories.forEach((category)=> {
    //     let total = data.filter((row)=> {
    //       return row.category === category.name;
    //     }).map((row) => {
    //       return row.spent;
    //     }).reduce((a,b) => a + b, 0);
    //       console.log(category.name, total); /// these values are great!!!!! they are what i am looking for!!
    //    /// HOW DO I UPDATE THE STATE WITH THESE VALUES?????????????????
    //     this.setState({
    //       totals: {
    //           ...this.state.totals,
    //           [category.name]: total,
    //       }, 
    //     })
    //   });
      // in the for loop though, everytime it runs it's overwriting the previous category, BUT WHY??? 
      // i think what's happening here is that getIncome and getTotalSpending are overwriting the total categories, again BUT WHY
    
          
    //////////////// RYANS CODE /////////////////
    let totals = Object.assign(this.state.totals);
    Object.keys(totals).forEach((category) => {
      console.log(totals);
      let filteredData = data.filter((row) => {
        console.log(category);
        return row.category === category && row.spent ;
      })
      const arrayOfNumber = filteredData.map((row)=> {
        return row.spent;
      })
      let total = arrayOfNumber.reduce((a, b) => a + b, 0);
      totals[category] = total;
    })
    this.setState({totals}
    ,() => {
    this.getIncome(data);
    this.getTotalSpending(data);
    });

    ///////////// TIMURS CODE ////////////////
    // let obj = {};
    // let totals = Object.assign(this.state.totals);
    // Object.keys(totals).forEach(i => {
    //     const smallCat = data[i];
    //     console.log(smallCat);
    //     obj[smallCat.category] = smallCat.spent
    // })
    // this.setState({totals, obj}
    //   , () => {
    //   this.getIncome(data);
    //   this.getTotalSpending(data);
    // });
  }
 
  // function to push to firebase
  // accepts the parameter of data, which is the data contained in a row
  pushToFirebase = (target, value, data) => {
    firebase.database().ref(`September/${data.key}`).once('value', (snapshot)=> {

      // create variable represent current state of the firebase node
      let currentVal = snapshot.val();

        // merging the current value with what i want to change
        Object.assign(currentVal, {[target]:value});
  
        //now set the data to the new value
        firebase.database().ref(`September/${data.key}`).set(currentVal);
    })
  }

  addCategory = (newCategory) => {
    categoriesRef.push(newCategory);
  }
  
  sortCategories = (obj) => {
    if (obj === null) {
      obj = {};
    }
      
    console.log(obj);
    const categoriesArray = Object.entries(obj).map((category)=> {
      return ({
        key: category[0],
        name: category[1].name,
        budget: category[1].budget,
        color: category[1].color
      })
    })

    const totalsArray = Object.values(obj).map((category) => {
      return ({
        [category.name]: 0,
      })
    })

    // let merged = Object.assign(...arr);
    let mergedTotals = Object.assign(...totalsArray);
    console.log(mergedTotals);

    console.log(totalsArray);
  
    this.setState({
      categories: categoriesArray,
      totals: mergedTotals
    }, () => {
      this.getTotals(this.state.rows);
    });

  }

  deleteCategory = (e) => {
    const confirm = window.confirm('are you sure you want to delete?');
    if (confirm) {
      firebase.database().ref(`Categories/${e.target.id}`).remove();
    }
  }

  render() {
    // fake numbers, I would ideally like to pass data from dynamically generated categories into here
    let labels = Object.keys(this.state.totals);
    let data = Object.values(this.state.totals);
    let colors = Object.values(this.state.categories);
    console.log(colors);
    // console.log(labels);
    const chartData = {
      labels: labels,
      datasets: [{
        label: "My First dataset",
        backgroundColor: ['red','yellow','green','blue'],
        data: data,
      }]
    }
    // console.log(this.state.totals.groceries, "in App.js")

    return (
      <div className="App">
        <header>
          <h1>Susie's Super Cool Budget App</h1>
        </header>
        <CategoryForm addCategory={this.addCategory}/>
        <Budget deleteCategory={this.deleteCategory} categories={this.state.categories} totals={this.state.totals}/>
        <Table rows={this.state.rows} 
              deleteRow={this.deleteRow} 
              pushToFirebase={this.pushToFirebase}
              categories={this.state.categories}/>
        <button onClick={this.addRow}>Add Row</button>

        <div className='summary-container'>
          <Chart totals={this.state.totals} chartData={chartData}/>
          <section className="summary">
            <h2>Total earned: <span id="total-earned">${this.state.totals.income}</span></h2>
            <h2>Total spent: <span id="total-spent">${this.state.totals.spending}</span></h2>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
