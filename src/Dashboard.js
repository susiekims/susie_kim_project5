import React, { Component } from 'react';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            sheets: ['September Budget']
        }
    }

    openSheet() {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
    }

    deleteSheet() {
        const confirm = window.confirm('are you sure you want to delete this sheet?');
        if (confirm) {
            // firebase.database().ref(`${userID}/Categories/${e.target.id}`).remove();
            alert('deleted');
        }
    }


    render() {
        return (
            <section className="dashboard" id="dashboard">
                <h1>Welcome, Susie</h1>
                <h2>Your sheets</h2>
                   
                    <div className="sheet-list">
                        {
                            this.state.sheets.map((sheet) => {
                                return (
                                    <div className="sheet-thumbnail" >
                                        <h3>September Budget</h3>
                                        <button onClick={this.deleteSheet} id="delete-sheet">X</button>
                                        <button onClick={this.openSheet} id="open-sheet">Open sheet</button>
                                    </div>
                                )
                            })
                        }
                        <div className="sheet-thumbnail">
                            <input type="text" id="new-sheet" placeholder="Create New Sheet"/>
                            <button id="new-sheet-button">+</button>
                        </div>
                    </div>
            </section>
        )

    }
}

export default Dashboard;