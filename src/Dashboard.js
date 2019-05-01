// this is just a placeholder page for when I get authentication and routing working.

import React, { Component } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import Header from "./Header";
import swal from "sweetalert2";

const auth = firebase.auth();

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      sheets: [],
      user: {}
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.setState({ user });
      this.sheetsRef = firebase
        .database()
        .ref(`users/${this.state.user.uid}/sheets`);
      this.sheetsRef.on("value", snapshot => {
        if (snapshot.val()) {
          this.sortSheets(snapshot.val());
        } else {
          this.setState({
            sheets: []
          });
        }
      });
    });
  }

  sortSheets = data => {
    if (data === null) {
      data = {};
    }
    let sheets = Object.keys(data).map(key => {
      return {
        key: key,
        title: data[key].title
      };
    });

    this.setState({ sheets });
  };

  handleSubmit = e => {
    e.preventDefault();
    const newSheetName = document.getElementById("new-sheet").value;
    if (newSheetName.length > 0) {
      const newSheet = {
        title: newSheetName
      };
      this.props.createNewSheet(newSheet);
    } else {
      swal({
        title: "Please enter a title for your sheet",
        type: "error"
      });
    }
    document.getElementById("new-sheet").value = "";
  };

  render() {
    return (
      <div className="dashboard fade" id="dashboard">
        <Header
          user={this.props.user}
          login={this.props.login}
          logout={this.props.logout}
        />
        <div className="dashboard-wrapper">
          {/* <h1>Welcome, {this.state.user.displayName}</h1> */}
          <h2 className="title">
            {this.state.user.displayName === null
              ? "Guest"
              : this.state.user.displayName}
            's Dashboard
          </h2>

          <div className="sheet-list">
            {this.state.sheets.map(sheet => {
              return (
                <div className="sheet-thumbnail" key={sheet.key}>
                  <h3>{sheet.title}</h3>
                  <button
                    id={sheet.key}
                    onClick={this.props.deleteSheet}
                    className="delete-button-dark"
                  >
                    <i id={sheet.key} className="fas fa-times" />
                  </button>
                  <Link
                    to={`/sheet/${sheet.title.replace(/ /g, "_")}/${sheet.key}`}
                    id={sheet.key}
                    className="dark-button open-sheet"
                  >
                    Open sheet
                  </Link>
                </div>
              );
            })}

            <div className="sheet-thumbnail">
              <form action="" onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  id="new-sheet"
                  maxLength="12"
                  placeholder="New Sheet Title"
                />
                <input
                  type="submit"
                  className="dark-button"
                  id="new-sheet-button"
                  value="Create New Sheet"
                />
              </form>
            </div>
          </div>
        </div>
        <footer>
          <div className="footer-wrapper">
            <p>BudgIt is a personal project by Susie Kim</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Dashboard;
