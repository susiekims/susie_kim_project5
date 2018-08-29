import React, { Component } from 'react';

import firebase from './firebase';

const dbRef = firebase.database().ref();

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.key,
            item: props.item,
            date: props.date,
            category: props.category,
            earned: props.earned,
            spent: props.spent

        }
    }

    handleChange = (e) => {
        console.log(e.target.id);
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
    
    }


    render() {
        return (
            <tr className="row" id=''>
                <td><input type="text" id="item" onChange={this.handleChange} value={this.state.item}/></td>
                <td><input type="date" id="date" onChange={this.handleChange} value={this.state.date}/></td>
                <td><input type="text" id="category" onChange={this.handleChange} value={this.state.category}/></td>
                <td><input type="text" id="earned" onChange={this.handleChange} value={this.state.earned}/></td>
                <td><input type="text" id="spent" onChange={this.handleChange} value={this.state.spent}/></td>
            </tr>
           
        )
    }
}

export default TableRow;