import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

import './styles/App.css';

// import Budget from './Budget';
// import Chart from './Chart';
// import Table from './Table';
// import Sheet from './Sheet';


import Landing from './Landing';
import Dashboard from './Dashboard';


import firebase from './firebase';

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user}, () => {
                    this.userRef = firebase.database().ref(`users/${this.state.user.uid}`);
                })
                // this.userRef.on('value', (snapshot) => {
                //     console.log(snapshot.val());
                // });
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

    render() {
        return(
            <Router>
                <div className="App">
                    <Route exact path="/" render={(props) => (
                        <Landing {...props} login={this.login} logout={this.logout} user={this.state.user} />
                    ) }/>

                    {
                        this.state.user &&
                        <Redirect to='/dashboard' />
                    }

                    <Route path="/dashboard" render={(props) => (
                        <Dashboard {...props}  createNewSheet={this.createNewSheet} login={this.login} logout={this.logout} user={this.state.user} />
                    ) }/>
                </div>
            </Router>
        )
    }
  
}

export default App;
