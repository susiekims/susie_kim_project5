import React, { Component } from 'react';
import './styles/App.css';

import Budget from './Budget';
import Chart from './Chart';
import Table from './Table';
import CategoryForm from './CategoryForm';
import Dashboard from './Dashboard';
import firebase from './firebase';

let userID = 'susie';
let sheetName = 'September Budget'
const userRef = firebase.database().ref(`users/${userID}`);
const budgetRef = firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Data`);
const categoriesRef = firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Categories`);

// create App class
class App extends Component {
    
  // create default state
  // state has a property of rows which is an array that contains the class TableRow
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            title: 'September Budget',
            rows : [],
            categories: [],
            totals: [],
            totalSpending: 0,
            totalIncome: 0,
            totalBudget: 0,
        }
    }

    componentDidMount() {
        budgetRef.on('value', (snapshot) => {
            this.sortData(snapshot.val());
        });
        categoriesRef.on('value', (snapshot) => {
            this.sortCategories(snapshot.val());
        })
    }

    handleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    addRow = () => {
        budgetRef.push({
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
        const confirm = window.confirm('Are you sure you want to delete this row?');
        if (confirm) {
            const rowRef = firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Data/${e.target.id}`);
            rowRef.remove();
        }
    }

  // function to get data from variable and change it into more accessible form
    sortData = (obj) => {
        if (obj === null) {
            obj = {};
        } 
    // create new array called rowArray from object which is passed down from .on('value')
        const rowArray = Object.entries(obj).map((row) => {
            return ({
                key: row[0],
                item: row[1].item,
                category: row[1].category,
                date: row[1].date,
                earned: row[1].earned && parseFloat(row[1].earned),
                spent: row[1].spent && parseFloat(row[1].spent)
            });
        })

        this.setState({rows: rowArray}
        ,() => {
            this.getTotals(rowArray);
        })
    }

  // function to get total amount of earned
    getIncome = (data) => {
        let totalIncome = data.filter((row)=> {
            return row.earned > 0;
        }).map((row) => {
            return row.earned;
        }).reduce((a,b)=> a + b, 0);
        this.setState({totalIncome}) 
    }

  /// get total amount spent
    getTotalSpending = (data) => {
        let totalSpending = data.filter((row)=> {
            return row.spent > 0;
        }).map((row)=> {
            return row.spent;
        }).reduce((a,b) => a + b, 0);
        this.setState({totalSpending});
    }

    getTotals = (data) => {
        let totals = Object.assign(this.state.totals);
        Object.keys(totals).forEach((category) => {
            let filteredData = data.filter((row) => {  
                return row.category === category && row.spent ;
            });
            const arrayOfNumbers = filteredData.map((row)=> {
                return row.spent;
            });
            let total = arrayOfNumbers.reduce((a, b) => a + b, 0);
            totals[category] = total;
        })
        this.setState({totals}
            ,() => {
            this.getIncome(data);
            this.getTotalSpending(data);
        });
    }

    getTotalBudget = (categories) => {
        let totalBudget = categories.map((category) => {
            return parseInt(category.budget)
        }).reduce((a,b) => a + b, 0);
        this.setState({totalBudget})
    }

    pushToFirebase = (target, value, data) => {
        firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Data/${data.key}`).once('value', (snapshot)=> {
            let currentVal = snapshot.val();
            Object.assign(currentVal, {[target]:value});
            firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Data/${data.key}`).set(currentVal);
        })
    }

    addCategory = (newCategory) => {
        categoriesRef.push(newCategory);
    }

    deleteCategory = (e) => {
        const confirm = window.confirm('Are you sure you want to delete this category?');
        if (confirm) {
            firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Categories/${e.target.id}`).remove();
        }
    }
  
    sortCategories = (obj) => {
        if (obj !== null) {
            const categoriesArray = Object.entries(obj).map((category)=> {
                return ({
                    key: category[0],
                    name: category[1].name,
                    budget: category[1].budget,
                    color: category[1].color
                })
            })
            
            if (categoriesArray.length > 0) {
                const totalsArray = Object.values(obj).map((category) => {
                    return ({
                        [category.name]: 0,
                    })
                })
                let mergedTotals = Object.assign(...totalsArray);
                this.setState({
                    categories: categoriesArray,
                    totals: mergedTotals
                }, () => {
                    this.getTotals(this.state.rows);
                    this.getTotalBudget(categoriesArray);
                });
            }
        }  
    }

    handleLogin = (e) => {
        e.preventDefault();
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }

    render() {
        let labels = Object.keys(this.state.totals);
        let data = Object.values(this.state.totals);
        let colors = Object.values(this.state.categories).map((category) => {
            return category.color
        });

        const chartData = {
        labels: labels,
            datasets: [{
                label: "My First dataset",
                backgroundColor: colors,
                data: data,
            }]
        }

        return (
            <main>    
                <div className="landing-page" id="landing-page">
                    <div className="landing-content">
                        <h1>Budgit</h1>
                        <h2>Personal Expense Tracker</h2>
                        <form>
                            <input type="text" placeholder="Create an username" id="username"/>
                            <input type="text" placeholder="Create a password" id="password"/>
                            <input type="submit" onClick={this.handleLogin} value="Create an account" />
                        </form>
                    </div>
                </div>
                <Dashboard />

                <div className="Home" id="home-page">
                    <header>
                        <input type="text" id="title" placeholder="Untitled Budget" value={this.state.title} onChange={this.handleChange}/>
                    </header>
                    <Budget deleteCategory={this.deleteCategory} categories={this.state.categories} totals={this.state.totals}/>
                    <CategoryForm addCategory={this.addCategory} />
                    <Table rows={this.state.rows} 
                        deleteRow={this.deleteRow} 
                        addRow = {this.addRow}
                        pushToFirebase={this.pushToFirebase}
                        categories={this.state.categories}
                    />
                    <div className='summary-container'>
                        <Chart totals={this.state.totals} chartData={chartData}/>
                        <section className="summary">
                        <h2>Summary</h2>
                            <h3>Total earned: <span id="total-earned">${(this.state.totalIncome).toFixed(2)}</span></h3>
                            <h3>Total spent: <span id="total-spent">${(this.state.totalSpending).toFixed(2)}</span></h3>
                            <h3>Total budget: {(this.state.totalBudget).toFixed(2)}</h3>
                            {   
                                this.state.totalBudget - this.state.totalSpending > 0 && 
                                    <h2 id="final-difference">
                                        You are <span style={{color: 'green'}}> ${(this.state.totalBudget - this.state.totalSpending).toFixed(2)}</span> under budget.
                                    </h2>
                            }

                            {
                                this.state.totalBudget - this.state.totalSpending < 0 && 
                                    <h2 id="final-difference">
                                        You are <span style={{color: 'red'}}> ${(this.state.totalSpending - this.state.totalBudget).toFixed(2)}</span> over budget.
                                    </h2>
                            }
                        </section>
                    </div>
                </div>
            </main>    
        );
    }
}

export default App;
