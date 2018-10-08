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
        this.setState({
            color: color.hex
        })
    }

    handleSubmit = (e,) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let budget = document.getElementById('budget').value;
        
        if (name.length > 0 && this.state.color && budget.length > 0 && budget <= 999999) {
            this.props.addCategory(this.state);
            document.getElementById('name').value = '';
            document.getElementById('budget').value = '';
            this.setState({
                color: null
            })
        } 
    
        if ( name.length === 0) {
            swal({
                title: 'Please give your sheet a name.',
                type: 'error'
            })
        } else if ( this.state.color === null ) {
            swal({
                title: 'Please choose a color.',
                type: 'error'
            })
        } else if ( budget.length === 0) {
            swal({
                title: 'Please enter a budget.',
                type: 'error'
            })
        } else if (budget > 999999) {
            swal({
                title: 'Please enter a lower budget.',
                type: 'error'
            })
        }
    }

    render() {
        const colors = [
            '#d41a0e',
            '#c90044',
            '#840b9a',
            '#491c9c',
            '#1f329a',
            '#0074d2',
            '#008ea2',
            '#2c9430',
            '#6ba427',
            '#ddc813',
            '#c69500',
            '#fe7c25',
            '#633e2f',
            '#646464'
        ]
        return (
            <div className="budget-card category-form">
                <h4>New Category</h4>
                <form action="">
                    <input type="text" maxLength="20"  id="name" onChange={this.handleChange} placeholder="Enter Category"/>
                    <input type="number" min="1" max="5" id="budget" onChange={this.handleChange} placeholder="Budget"/>
                    <GithubPicker colors={colors} width={'100%'} onChangeComplete={this.handleChangeComplete} triangle="hide"/>
                    <input type="submit" pattern="[0-9]*" id="submit-category" value="Add Category" onClick={this.handleSubmit} className="dark-button"/>
                </form>
            </div>
        )
    }
}

export default CategoryForm 