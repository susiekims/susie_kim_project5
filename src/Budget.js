import React, { Component } from 'react';
import CategoryForm from './CategoryForm';


class Budget extends Component {
    showHistory(e) {
        console.log(e.target.id);
        let historyList = document.getElementById(`${e.target.id}-history`).style;
        if (historyList.display === 'none') {
            document.getElementById(`${e.target.id}-history`).style.display = 'block';
            document.querySelectorAll(`${e.target.id}-history`)
        } else {
            document.getElementById(`${e.target.id}-history`).style.display = 'none';
        }

    }
    render() {
        return (
            <section className="budget">
                <h2>Categories</h2>
                <div className="budget-list">
                    {
                        this.props.categories.map((category) => {
                            let divStyle = {
                                background: category.color,
                            }
    
                            return (
                                <div className="budget-card" style={divStyle} key={category.key}>
                                    <h4>Category</h4>
                                    <h3>{category.name}</h3>
    
                                    <h4>Budget</h4>
                                    <h3>${category.budget}</h3>
    
                                    <h4>Spent</h4>
                                    <h3>${this.props.totals[category.name]}</h3>
                                    {
                                        category.budget - this.props.totals[category.name] < 0 &&
                                        <h5>You are ${(this.props.totals[category.name] - category.budget).toFixed(2)} over budget.</h5>   
                                    }
                                    {
                                        category.budget - this.props.totals[category.name] > 0 &&
                                        <h5>You have ${ (category.budget - this.props.totals[category.name]).toFixed(2)} left to spend.</h5>   
                                    }
                                    <button className="delete-category" id={category.key} onClick={this.props.deleteCategory}><i className="fas fa-times"></i></button>
                                    {/* <button className="button show-history" id={category.key} onClick={this.showHistory}>Show History</button> */}
                                    {/* <ul id={`${category.key}-history`}>
                                        {
                                            this.props.rows.filter((row) => {
                                                return row.category === category.name && row.spent
                                            }).map((item) => {
                                                return (<li>
                                                    <p>{item.item}</p>
                                                    <p>{item.date}</p>
                                                    <p>${item.spent}</p>
                                                </li>)
                                            })
                                        }
                                    </ul> */}
                                </div>
                            )
                        })
                    }
                    <CategoryForm addCategory={this.props.addCategory}/>
                    <div className="budget-card margin-div"></div>
                </div>
            </section>
        )
    }
}

export default Budget;