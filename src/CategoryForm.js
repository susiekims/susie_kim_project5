import React, { Component } from 'react';
import swal from 'sweetalert2';
import { GithubPicker } from 'react-color';

class CategoryForm extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            budget: 0,
            color: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleChangeComplete = (color) => {
        console.log(color.hex);
        this.setState({
            color: color.hex
        })
    }

    handleSubmit = (e,) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let budget = document.getElementById('budget').value;
        
        if (name.length > 0 && this.state.color && budget.length > 0) {
            this.props.addCategory(this.state);
            document.getElementById('name').value = '';
            document.getElementById('budget').value = '';
            this.setState({
                color: null
            })
        } else if ( name.length < 0) {
            swal({
                title: 'Please give your sheet a name.',
                type: 'error'
            })
        } else if ( this.state.color === null ) {
            swal({
                title: 'Please give your sheet a name.',
                type: 'error'
            })
        } else if ( budget.length < 0) {
            swal({
                title: 'Please enter a valid budget',
                type: 'error'
            })
        }
    }

    render() {
        return (
            <div className="budget-card category-form">
                <h4>New Category</h4>
                <form action="">
                    <input type="text" maxLength="20"  id="name" onChange={this.handleChange} placeholder="Enter Category"/>
                    <input type="number" min="0" max="999999" id="budget" onChange={this.handleChange} placeholder="Budget"/>
                    {/* <input type="color" maxLength="6" id="color" onChange={this.handleChange} 
                    placeholder="Choose a color" /> */}
                    <GithubPicker onChangeComplete={this.handleChangeComplete} triangle="hide"/>
                    <input type="submit" pattern="[0-9]*" id="submit-category" value="Add Category" onClick={this.handleSubmit} className="dark-button"/>
                </form>
            </div>
        )
    }
}

export default CategoryForm 