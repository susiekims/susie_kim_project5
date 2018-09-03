import React, { Component } from 'react';
import './Landing.css'

class Landing extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitting');
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
    }


    render() {
        const randomUser = Math.floor(Math.random() * 10000);
        return (
            <div className="landing-page" id="landing-page">
                <div className="landing-content">
                    <h1>Budgit</h1>
                    <h2>Personal Expense Tracker</h2>
                    <form>
                        <input type="text" placeholder="Please enter your e-mail address" />
                        <input type="password" placeholder="Please enter your desired password" />
                        <button onClick={this.handleSubmit}>Create User</button>
                    </form>

                </div>
            </div>
        )
    }
}

export default Landing;