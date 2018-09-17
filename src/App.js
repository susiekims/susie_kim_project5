import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';
import firebase from './firebase';
import swal from 'sweetalert2';

import './styles/App.css';

import Landing from './Landing';
import Dashboard from './Dashboard';
import Sheet from './Sheet';

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            redirect: false
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
                redirect: true
            })
        });
    }

    logout = () => {
        swal({
            title: 'Are you sure you want to log out?',
            type: 'warning',
            confirmButtonText: 'LOG OUT'
        })
        .then((res) => {
           let logout = res.value 
            if (logout) {
                swal({
                    title: 'Logged out!',
                    type: 'success'
                })
                auth.signOut().then(() => {
                    this.setState({
                        user: null,
                    });
                })
            }
        }) 
    
    }

    createNewSheet = (newSheet) => {
        this.sheetsRef = firebase.database().ref(`users/${this.state.user.uid}/sheets`);
        this.sheetsRef.push(newSheet);
    }

    deleteSheet = (e) => {
        let id = e.target.id;
        swal({
            title: 'Are you sure you want delete this sheet?',
            type: 'warning',
            text: 'All data in sheet will also be deleted.',
            confirmButtonText: 'Delete'
        })
        .then((res) => {
            if (res.value) {
                swal({
                    title: 'Sheet deleted.',
                    type: 'success'
                })
                firebase.database().ref(`users/${this.state.user.uid}/sheets/${id}`).remove();
                console.log(id);
            }
        }) 
    }


   
    render() {
        return(
            <Router>
                <Switch>

                    <Route path="/dashboard" render={(props) => (
                        <Dashboard {...props} openSheet={this.openSheet} createNewSheet={this.createNewSheet} deleteSheet={this.deleteSheet} login={this.login} logout={this.logout} user={this.state.user} />
                    ) }/>

                    <Route path="/sheet/:sheet_name/:sheet_id" render={(props) => (
                        <Sheet {...props} login={this.login} logout={this.logout} user={this.state.user} />
                    ) }/>

                    <Route exact path="/" render={(props) => (
                        <Landing {...props} login={this.login} logout={this.logout} user={this.state.user} redirect={this.state.redirect}/>
                    ) }/>

            
                </Switch>
            </Router>
        )
    }
  
}

export default App;
