import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import firebase from './firebase';


const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

// create App class
class Landing extends Component {

    render() {
        return(
            <div className="landing page">
                <h1>Welcome to Budgit</h1>
                <h2>Plan it</h2>
                    <p>Plan out your spending in Categories and set indivdiual budgets.</p>
                <h2>Track it</h2>
                    <p>Record all your earnings and spendings in Transactions.</p>
                <h2>Save it</h2>
                    <p>See a summary of all your spending habits and save it for later.</p>
                <Link to="/dashboard">Try as Guest</Link>
                {/* <Link to="/dashboard">Sign Up/Log In</Link> */}
                <button onClick={this.props.login}>Login</button>
                {
                        this.props.user &&
                        <Redirect to='/dashboard' />
                    }
            </div>
        )
    }
  
}

export default Landing;