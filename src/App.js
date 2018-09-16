import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';

import './styles/App.css';

// import Budget from './Budget';
// import Chart from './Chart';
// import Table from './Table';


import Landing from './Landing';
import Dashboard from './Dashboard';
import Sheet from './Sheet';


import firebase from './firebase';

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            currentSheet: '',
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user}, () => {
                    this.userRef = firebase.database().ref(`users/${this.state.user.uid}`);
                })
            }
        })
        
    }

    login = () => {
        console.log('login')
        auth.signInWithPopup(provider).then(res => {
            this.setState({
                user: res.user,
            })
        });
    }

    logout = () => {
        auth.signOut().then(() => {
            this.setState({
                user: null,
            });
        })
    }

    createNewSheet = (newSheet) => {
        this.sheetsRef = firebase.database().ref(`users/${this.state.user.uid}/sheets`);
        this.sheetsRef.push(newSheet);
    }

    deleteSheet = (e) => {
        console.log('delete');
        const confirm = window.confirm('are you sure you want to delete this sheet? all data will be deleted');
        if (confirm) {
            console.log(e.target.id);
            firebase.database().ref(`users/${this.state.user.uid}/sheets/${e.target.id}`).remove();
        }
    }

    openSheet = (e) => {
        console.log(e.target.id);
    }

    render() {
        return(
            <Router>
                <Switch>


                    <Route path="/dashboard" render={(props) => (
                        <Dashboard {...props} openSheet={this.openSheet} createNewSheet={this.createNewSheet} deleteSheet={this.deleteSheet} login={this.login} logout={this.logout} user={this.state.user} />
                    ) }/>


                    <Route path="/sheet/:sheet_id" render={(props) => (
                        <Sheet {...props} user={this.state.user} />
                    ) }/>

                    <Route exact path="/" render={(props) => (
                        <Landing {...props} login={this.login} logout={this.logout} user={this.state.user} />
                    ) }/>

            
                </Switch>
            </Router>
        )
    }
  
}

export default App;
