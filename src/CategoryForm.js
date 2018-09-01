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
        e.preventDefault()
        this.props.addCategory(this.state)
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