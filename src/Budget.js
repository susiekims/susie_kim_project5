import React from 'react';

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
                                <h3>Category: {category.name}</h3>
                                <h4>Budget: ${category.budget}</h4>
                                <h4>Total: ${props.totals[category.name]}</h4>
                                {
                                    category.budget - props.totals[category.name] < 0 &&
                                    <h5>You went ${ props.totals[category.name] - category.budget} over budget!</h5>   
                                }
                                {
                                    category.budget - props.totals[category.name] > 0 &&
                                    <h5>You have $ { category.budget - props.totals[category.name]} left for this category.</h5>   
                                }
                                <button id={category.key} onClick={props.deleteCategory}>Delete Category</button>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Budget;