import React, { Component } from 'react';
import './Home.css';

import Budget from './Budget';
import Chart from './Chart';
import Table from './Table';
import CategoryForm from './CategoryForm';
import firebase from './firebase';

let userID = 'user';
const userRef = firebase.database().ref(userID);
const budgetRef = firebase.database().ref(`${userID}/Budget`);
const categoriesRef = firebase.database().ref(`${userID}/Categories`);

// create App class
class Home extends Component {
  // create default state
  // state has a property of rows which is an array that contains the class TableRow
    constructor() {
        super();
        this.state = {
            title: '',
            rows : [],
            categories: [],
            totals: [],
            totalSpending: 0,
            totalIncome: 0,
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
        const rowRef = firebase.database().ref(`${userID}/${e.target.id}`)
        rowRef.remove();
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

    pushToFirebase = (target, value, data) => {
        firebase.database().ref(`${userID}/Budget/${data.key}`).once('value', (snapshot)=> {
            let currentVal = snapshot.val();
            Object.assign(currentVal, {[target]:value});
            firebase.database().ref(`${userID}/Budget/${data.key}`).set(currentVal);
        })
    }

    addCategory = (newCategory) => {
        categoriesRef.push(newCategory);
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
                });
            }
        }  
    }

    deleteCategory = (e) => {
        const confirm = window.confirm('are you sure you want to delete?');
        if (confirm) {
            firebase.database().ref(`${userID}/Categories/${e.target.id}`).remove();
        }
    }

    handleLogin = (e) => {
        e.preventDefault();
        console.log('submitting');
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
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
            <div>    
                <div className="landing-page" id="landing-page">
                    <div className="landing-content">
                        <h1>Budgit</h1>
                        <h2>Personal Expense Tracker</h2>
                        <form>
                            <input type="text" placeholder="Enter your username" />
                            <input type="text" placeholder="Enter your password" />
                            <input type="submit" onClick={this.handleLogin} value="Sign In" />
                        </form>
                        <form>
                            <input type="text" placeholder="Create an username" />
                            <input type="text" placeholder="Create a password" />
                            <input type="submit" onClick={this.handleLogin} value="Create an account" />
                        </form>
                    </div>
                </div>

                <div className="Home" id="home-page">
                    <header>
                        <input type="text" id="title" placeholder="Untitled Budget"/>
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
                            <h2>Total earned: <span id="total-earned">${this.state.totalIncome}</span></h2>
                            <h2>Total spent: <span id="total-spent">${this.state.totalSpending}</span></h2>
                        </section>
                    </div>
                </div>
            </div>    
        );
    }
}

export default Home;
