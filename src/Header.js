import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <header>
                <h1>Budgit</h1>
                <ul>
                    <li>
                        {
                            this.props.user ?
                            <button>Dashboard</button>
                            :  
                                <Redirect to="/" />
                            
                        }
                    </li>
                    <li>
                        {
                            this.props.user ?
                            <button onClick={this.props.logout}>Sign Out</button>
                            : <button onClick={this.props.login}>Sign In</button>
                        }
                    </li>
                </ul>
            </header>
        )
    }
}

export default Header;