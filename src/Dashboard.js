// this is just a placeholder page for when I get authentication and routing working.

import React, { Component } from 'react';
import firebase from 'firebase';

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
        })
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
    }

    sortSheets = (data) => {
        console.log('sorting', data);
        let newdata = Object.entries(data);
        // console.log(newdata);
        console.log('HEY ITS A ME MARIO')
    }

    deleteSheet() {
        const confirm = window.confirm('are you sure you want to delete this sheet?');
        if (confirm) {
            alert('deleted');
        }
    }

    handleSubmit = () => {
        console.log('handlesubmit');
        const newSheetName = document.getElementById('new-sheet').value;
        const newSheet = {
            title: newSheetName
        }
        this.props.createNewSheet(newSheetName);
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
                                    <div className="sheet-thumbnail" >
                                        <h3>September Budget</h3>
                                        <button onClick={this.deleteSheet} id="delete-sheet"><i className="fas fa-times"></i></button>
                                        <button onClick={this.openSheet} id="open-sheet">Open sheet</button>
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