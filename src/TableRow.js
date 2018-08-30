import React, { Component } from 'react';

import firebase from './firebase';

const dbRef = firebase.database().ref();

// create new class TableRow which is a React component
class TableRow extends Component {

    // constructor that declares default state
    // constructor accepts props parameter, which is passed down from Table which is passed down from App.js
    constructor(props) {
        super(props);
        this.state = {
            key: props.rowData.key,
            item: props.rowData.item,
            date: props.rowData.date,
            category: props.rowData.category,
            earned: props.rowData.earned,
            spent: props.rowData.spent
        }
        // add pushToFirebase to constructor of TableRow, function passed down from Table which got it from App.js
        this.pushToFirebase = props.pushToFirebase;
    }

    // function to deal with input on change
    handleChange = (e) => {
        // e.target.id is the id of the element being changed
        // console.log(e.target.id);
        
        // set the state of that target to the value being inputted
        this.setState({
    
                [e.target.id]: e.target.value
            
        // }, () => {
        //     if (this.state.key == null) {
        //         this.props.setLoading()
        //         dbRef.push(this.state).then((res)=> {
        //             console.log(res);
        //             const key = res.path.pieces_[0];
        //             console.log(key);
        //             this.setState({key},() => {
        //                 this.props.stopLoading();
        //             })
        //         })
        //     } else {
        //         firebase.database().ref(this.state.key).set(this.state.entry)
        //     }
            // as soon as you type something in a new row, create new item in the database
            // get the id back for that item
            // so that when you change that particular row, you are not adding a new row, but updating that row
        })

        // call the pushToFirebase method, pass down current state of that row
        this.pushToFirebase(e.target.id, e.target.value, this.state);
    
    }


    render() {
        // console.log(this.state.key);
        return (
            // render Table Row which 5 different input
            // give the row a unique Key, which got it from firebase which was generated when the new Row was created
            <tr className="row">
                <td><input type="text" id="item" onChange={this.handleChange} value={this.state.item}/></td>
                <td><input type="date" id="date" onChange={this.handleChange} value={this.state.date}/></td>
                <td>
                    {/* <input type="text" id="category" onChange={this.handleChange} value={this.state.category}/> */}
                    <select id="category" onChange={this.handleChange} value={this.state.category}>
                        <option value="" disabled selected>Select category</option>
                        <option value="groceries">Groceries</option>
                        <option value="eatingOut">Eating Out</option>
                        <option value="transportation">Transportation</option>
                        <option value="housing">Housing</option>
                        <option value="bills">Bills</option>
                        <option value="health">Health</option>
                        <option value="shopping">Shopping</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="misc">Misc</option>
                    </select>
                                    
                </td>
                <td><input type="text" id="earned" onChange={this.handleChange} value={this.state.earned}/></td>
                <td><input type="text" id="spent" onChange={this.handleChange} value={this.state.spent}/></td>
                <td>
                    <button id={this.state.key} onClick={this.props.deleteRow}>X</button>
                </td>
            </tr>
           
        )
    }
}

export default TableRow;