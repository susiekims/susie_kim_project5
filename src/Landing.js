import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import firebase from './firebase';


const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

// create App class
class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    render() {
        return(
            <div className="landing page">
                <div className="welcome">
                    <h1>BudgIt</h1>
                    <p>Keeping track of your spending, streamlined.</p>
                    <Link to="/dashboard">Try as Guest</Link>
                    <button onClick={this.props.login}>Login</button>
                    {
                        this.props.user &&
                        <Redirect to='/dashboard' />
                    }
                </div>

                <div className="how-to">   
                    <h2>How to BudgIt</h2>

                    <section>
                        <div className="how-to-text">
                            <h3>Start it</h3>
                            <p>Create a new Sheet in your Dashboard. A Sheet can be anything you want it to be, whether it's a budget for the month of September, an expense tracker for a trip, the possibilities are endless </p>
                        </div>
                        <img src={require("../src/assets/dashboard.png")} className="how-to-image iphone"/>
                    </section>
                    <section>
                        <img src={require("../src/assets/categories.png")} className="how-to-image"/>
                        <div className="how-to-text">
                            <h3>Plan it</h3>
                            <p>In each Sheet, plan out your spending in Categories and set indivdiual budgets.</p>
                        </div>
                    </section>
                    <section>
                        <div className="how-to-text">
                            <h3>Track it</h3>
                            <p>Record all your earnings and spendings in Transactions.</p>
                        </div>
                        <img src={require("../src/assets/transactions.png")} className="how-to-image"/>
                    </section>
                    <section>
                        <img src={require("../src/assets/breakdown.png")} className="how-to-image"/>
                        <div className="how-to-text">
                            <h3>Save it</h3>
                            <p>See a summary of all your spending habits and save it for later. You can refer back to any sheet you created in your Dashboard</p>
                        </div>
                    </section>
                </div>
                <footer>
                    <div className="footer-wrapper">
                        <p>BudgIt is a personal project by Susie Kim</p>
                    </div>
                </footer>
            </div>
        )
    }
  
}

export default Landing;