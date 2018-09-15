// this is just a placeholder page for when I get authentication and routing working.

import React, { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

const auth = firebase.auth();

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            sheets: [],
            user: {}
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            this.setState({user})
            this.sheetsRef = firebase.database().ref(`users/${this.state.user.uid}/sheets`);
            this.sheetsRef.on('value', snapshot => {
                if (snapshot.val()) {
                    this.sortSheets(snapshot.val());
                } else {
                    this.setState({
                        sheets: []
                    })
                }
            })
            
        })

    }

    sortSheets = (data) => {
        if (data === null) {
            data = {}
        }
        let newData = Object.entries(data);
        console.log(newData);
        let sheets = newData.map(entry => {
            return ({
                    key: entry[0],
                    title: entry[1].title
                })    
        })
        this.setState({sheets})
    }

    handleSubmit = () => {
        console.log('handlesubmit');
        const newSheetName = document.getElementById('new-sheet').value;
        const newSheet = {
            title: newSheetName
        }
        this.props.createNewSheet(newSheet);
        console.log(newSheet);
    }

    render() {
        return (
            <section className="dashboard" id="dashboard">
                <h1>Welcome, {this.state.user.displayName}</h1>
                <h2>Your sheets</h2>
                   
                    <div className="sheet-list">
                        {
                            this.state.sheets.map((sheet) => {
                                return (
                                    <div className="sheet-thumbnail" key={sheet.key}>
                                        <h3>{sheet.title}</h3>
                                        <button id={sheet.key} onClick={this.props.deleteSheet} className="delete-sheet"><i className="fas fa-times"></i></button>
                                        <Link to='/sheet' id={sheet.key} onClick={this.props.openSheet} className="open-sheet">Open sheet</Link>
                                    </div>
                                )
                            })
                        }
                        <div className="sheet-thumbnail">
                            <input type="text" id="new-sheet" placeholder="Create New Sheet"/>
                            <button onClick={this.handleSubmit} id="new-sheet-button"><i className="fas fa-plus"></i></button>
                        </div>
                    </div>
            </section>
        )

    }
}

export default Dashboard;