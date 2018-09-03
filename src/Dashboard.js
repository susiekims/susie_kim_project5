import React, { Component } from 'react';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            sheets: []
        }
    }

    openSheet() {
        console.log('click');
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
    }

    deleteSheet() {
        const confirm = window.confirm('are you sure you want to delete this sheet?');
        if (confirm) {
            // firebase.database().ref(`${userID}/Categories/${e.target.id}`).remove();
            console.log('delete');
        }
    }

    handleChange() {

    }

    render() {
        return (
            <div className="dashboard" id="dashboard">
                <h1>Welcome, Susie</h1>
                <h2>Your sheets</h2>
                   
                    <div className="sheet-list">
                        {
                            this.props.sheets.map((sheet) => {
                                return (
                                    <div className="sheet-thumbnail" >
                                        <h3>September Budget</h3>
                                        <button onClick={this.deleteSheet} id="delete-sheet">X</button>
                                        <button onClick={this.openSheet} id="open-sheet">Open sheet</button>
                                    </div>
                                )
                            })
                        }
                    </div>
    
                <input type="text" id="new-sheet" placeholder="New Sheet" onChange={this.handleChange}/>
                <button id="new-sheet-button">Start New Sheet</button>
            </div>
        )

    }
}

export default Dashboard;