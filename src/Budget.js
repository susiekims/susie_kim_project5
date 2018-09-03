import React from 'react';
import CategoryForm from './CategoryForm';

const Budget = (props) => {
    return (
        <section className="budget">
            <h2>Categories</h2>
            <div className="budget-list">
                {
                    props.categories.map((category) => {
                        let divStyle = {
                            background: category.color,
                        }

                        return (
                            <div className="budget-card" style={divStyle} key={category.key}>
                                <h4>Category</h4>
                                <h3>{category.name}</h3>

                                <h4>Budget </h4>
                                <h3>${category.budget}</h3>

                                <h4>Spent</h4> 
                                <h3>${props.totals[category.name]}</h3>
                                {
                                    category.budget - props.totals[category.name] < 0 &&
                                    <h5>You are ${ props.totals[category.name] - category.budget} over budget.</h5>   
                                }
                                {
                                    category.budget - props.totals[category.name] > 0 &&
                                    <h5>You have ${ category.budget - props.totals[category.name]} left to spend.</h5>   
                                }
                                <button id={category.key} onClick={props.deleteCategory}><i class="fas fa-times"></i></button>
                            </div>
                        )
                    })
                }
                <CategoryForm addCategory={props.addCategory}/>
            </div>
        </section>
    )
}

export default Budget;