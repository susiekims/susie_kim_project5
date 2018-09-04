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
            <div className="budget-card category-form">
                <h4>New Category</h4>
                <form action="">
                    <input type="text" maxLength="20"  id="name" onChange={this.handleChange} placeholder="Enter Category"/>
                    <input type="text" maxLength="6" id="budget" onChange={this.handleChange} placeholder="Budget"/>
                    <input type="color" maxLength="6" id="color" onChange={this.handleChange} 
                    placeholder="Choose a color" />
                    <input type="submit" pattern="[0-9]*" id="submit-category" value="Add Category" onClick={this.handleSubmit}/>
                </form>
            </div>
        )
    }
}

export default CategoryForm 