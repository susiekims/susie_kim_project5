import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <header>
                <h1>BudgIt</h1>
                <ul>
                    <li>
                        {   this.props.user === null &&
                            <Redirect to="/" />
                        }
                        {
                            window.location.href !== 'https://expense-tracker-v2.firebaseapp.com/dashboard' &&
                            <Link className="button nav-button" to="/dashboard">Dashboard</Link>                    
                        }
                    </li>
                    <li>
                        {
                            this.props.user ?
                            <button className="button nav-button" onClick={this.props.logout}>Sign Out</button>
                            : 
                            <button className="button nav-button" onClick={this.props.login}>Sign In</button>
                        }
                    </li>
                </ul>
            </header>
        )
    }
}

export default Header;