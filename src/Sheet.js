import React, { Component } from 'react';
import './styles/App.css';

import Budget from './Budget';
import Chart from './Chart';
import Table from './Table';
import Header from './Header';
import firebase from './firebase';
import swal from 'sweetalert2';


const auth = firebase.auth();


// let userID = 'susie';
// let sheetName = 'September Budget'
// const userRef = firebase.database().ref(`users/${userID}`);
// const budgetRef = firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Data`);
// const categoriesRef = firebase.database().ref(`users/${userID}/Sheets/${sheetName}/Categories`);

// create App class
class Sheet extends Component {
    
  // create default state
  // state has a property of rows which is an array that contains the class TableRow
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            title: this.props.match.params.sheet_name.replace(/_/g, " "),
            rows : [],
            categories: [],
            totals: [],
            totalSpending: 0,
            totalIncome: 0,
            totalBudget: 0,
        }
    }

    // change listeners for databases
    componentDidMount() {

        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user}, () => {
                    
                    this.budgetRef = firebase.database().ref(`users/${user.uid}/Sheets/${this.props.match.params.sheet_id}/Data`);
                    this.categoriesRef = firebase.database().ref(`users/${user.uid}/Sheets/${this.props.match.params.sheet_id}/Categories`);

                    this.budgetRef.on('value', (snapshot) => {
                        this.sortData(snapshot.val());
                    });
                    this.categoriesRef.on('value', (snapshot) => {
                        if (snapshot.val()) {
                            this.sortCategories(snapshot.val());
                        } else {
                            this.setState({
                                categories: []
                            })
                        }
                    })

                })
            }
        })

    }

    // change state of title
    handleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    // push empty row onto firebase
    addRow = () => {
        this.budgetRef.push({
            key: '',
            item: '',
            date: '',
            category: '',
            earned: '',
            spent: '',
        })
    }

  // removes row from firebase
    deleteRow = (e) => {
        let id = e.target.id;
        swal({
            title: 'Are you sure you want delete this row?',
            type: 'warning',
            confirmButtonText: 'Delete'
        })
        .then((res) => {
            if (res.value) {
                swal({
                    title: 'Row deleted.',
                    type: 'success'
                })
                const rowRef = firebase.database().ref(`users/${this.state.user.uid}/Sheets/${this.props.match.params.sheet_id}/Data/${id}`);
                rowRef.remove();
            }
        }) 
    }

  // get data from firebase and change it into a more accessble form
    sortData = (obj) => {
        if (obj === null) {
            obj = {};
        } 

        const rowArray = Object.keys(obj).map((key) => {
            return ({
                key: key,
                item: obj[key].item,
                category: obj[key].category,
                date: obj[key].date,
                earned: obj[key].earned && parseFloat(obj[key].earned),
                spent: obj[key].spent && parseFloat(obj[key].spent)
            });
        })


        this.setState({rows: rowArray}
        ,() => {
            this.getTotals(rowArray);
        })
    }

  // get total income
    getIncome = (data) => {
        let totalIncome = data.filter((row)=> {
            return row.earned > 0;
        }).map((row) => {
            return row.earned;
        }).reduce((a,b)=> a + b, 0);
        this.setState({totalIncome}) 
    }

   // get total amount spent
    getTotalSpending = (data) => {
        let totalSpending = data.filter((row)=> {
            return row.spent > 0;
        }).map((row)=> {
            return row.spent;
        }).reduce((a,b) => a + b, 0);
        this.setState({totalSpending});
    }

    // get category totals
    // for each category in this.state.totals, filter the data for items that in that category, map their spending, and get the sum
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

    // get total value of all the category budgets
    getTotalBudget = (categories) => {
        if (categories.length > 0) {
            let totalBudget = categories.map((category) => {
                return parseInt(category.budget)
            }).reduce((a,b) => a + b, 0);
            this.setState({totalBudget})
        } else {
            this.setState({totalBudget:0});
        }
    }

    // push row data to firebase
    pushToFirebase = (target, value, data) => {
        firebase.database().ref(`users/${this.state.user.uid}/Sheets/${this.props.match.params.sheet_id}/Data/${data.key}`).once('value', (snapshot)=> {
            let currentVal = snapshot.val();
            Object.assign(currentVal, {[target]:value});
            firebase.database().ref(`users/${this.state.user.uid}/Sheets/${this.props.match.params.sheet_id}/Data/${data.key}`).set(currentVal);
        })
    }

    // push category to the category reference
    addCategory = (obj) => {
        this.categoriesRef.push(obj);
    }

    // delete category reference from firebase
    deleteCategory = (e) => {
        let id = e.target.id;
        swal({
            title: 'Are you sure you want delete this category',
            type: 'warning',
            confirmButtonText: 'Delete'
        })
        .then((res) => {
            if (res.value) {
                swal({
                    title: 'Category deleted.',
                    type: 'success'
                })
                firebase.database().ref(`users/${this.state.user.uid}/Sheets/${this.props.match.params.sheet_id}/Categories/${id}`).remove();
            }
        }) 
    }
    
    // get data from firebase and change to more accessible form
    sortCategories = (obj) => {
        if (obj !== null) {
            const categoriesArray = Object.keys(obj).map((key)=> {
                return ({
                    key: key,
                    name: obj[key].name,
                    budget: obj[key].budget,
                    color: obj[key].color
                })
            })
            
            if (categoriesArray.length > 0) {
                const x= Object.keys(obj);
                const totalsArray = x.map((key) => {
                    return (
                       {[obj[key].name] : 0}
                     ) 
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

    // placeholder function, doesn't do anything yet
    handleLogin = (e) => {
        e.preventDefault();
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }

    render() {
        let labels = Object.keys(this.state.totals);
        let data = Object.keys(this.state.totals).map(key => {
            return this.state.totals[key]
        });
        let colors = Object.keys(this.state.categories).map(key => {
            return this.state.categories[key].color;
        })

    
        
        const chartData = {
        labels: labels,
            datasets: [{
                label: "My First dataset",
                backgroundColor: colors,
                data: data,
            }]
        }

        return (
            <div className="sheet fade">    
                <div className="Home" id="home-page">
                    <Header user={this.props.user} login={this.props.login} logout={this.props.logout}/>
                    <h2 className="title">{this.state.title}</h2>
                    <Budget deleteCategory={this.deleteCategory} categories={this.state.categories} totals={this.state.totals} addCategory={this.addCategory} rows={this.state.rows}/>
                    {/* <CategoryForm addCategory={this.addCategory} /> */}
                    <Table rows={this.state.rows} 
                        deleteRow={this.deleteRow} 
                        addRow = {this.addRow}
                        pushToFirebase={this.pushToFirebase}
                        categories={this.state.categories}
                    />
                    <section className='summary-container'>
                        <Chart totals={this.state.totals} chartData={chartData}/>
                        <div className="summary">
                            <h2>Summary</h2>
                            <div className="summary-list">
                                <div className="summary-card">
                                    <h4>Total earned</h4> 
                                    <h3>${(this.state.totalIncome).toFixed(2)}</h3>
                                </div>
                                
                                <div className="summary-card">
                                    <h4>Total spent</h4>
                                    <h3>${(this.state.totalSpending).toFixed(2)}</h3>
                                </div>

                                <div className="summary-card">
                                    <h4>Total budget</h4> 
                                    <h3>${(this.state.totalBudget).toFixed(2)}</h3>
                                </div>

                                <div className="summary-card">
                                    <h4>Earned vs. Spent</h4>
                                    <h3>${(this.state.totalIncome - this.state.totalSpending).toFixed(2)}</h3>
                                </div>
                            </div>
                            {   
                                this.state.totalBudget - this.state.totalSpending > 0 && 
                                    <h5 id="final-difference">
                                        You are <span style={{color: 'green'}}> ${(this.state.totalBudget - this.state.totalSpending).toFixed(2)}</span> under budget.
                                    </h5>
                            }

                            {
                                this.state.totalBudget - this.state.totalSpending < 0 && 
                                    <h5 id="final-difference">
                                        You are <span style={{color: 'red'}}> ${(this.state.totalSpending - this.state.totalBudget).toFixed(2)}</span> over budget.
                                    </h5>
                            }
                        </div>
                    </section>
                </div>
                <footer>
                    <div className="footer-wrapper">
                        <p>Budgit is a personal project by Susie Kim</p>
                    </div>
                </footer>
            </div>    
        );
    }
}

export default Sheet;
