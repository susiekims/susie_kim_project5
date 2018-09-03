import React, { Component } from 'react';

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
        // console.log(e.target.value);
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let color = document.getElementById('color').value;
        let budget = document.getElementById('budget').value;
        console.log(color);
        
        if (name.length > 0 && color !== '#000000' && budget.length > 0) {
            this.props.addCategory(this.state);
            document.getElementById('name').value = '';
            document.getElementById('color').value = '';
            document.getElementById('budget').value = '';
        } else {
            alert('Please enter a category, budget, and colour.');
        }
    }

    render() {
        return (
        <form action="">
            <input type="text" id="name" onChange={this.handleChange} placeholder="Enter Category"/>
            <input type="text" id="budget" onChange={this.handleChange} placeholder="Budget"/>
            <input type="color" id="color" onChange={this.handleChange} />
            <input type="submit" id="submit-category" value="create new category" onClick={this.handleSubmit}/>
        </form>
        )
    }
}

export default CategoryForm 