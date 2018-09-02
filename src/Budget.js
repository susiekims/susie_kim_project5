import React from 'react';

const Budget = (props) => {
    return (
        <div className="budget">
            {
                props.categories.map((category) => {
                    let divStyle = {
                        background: category.color,
                    }

                    return (
                        <div className="budget-card" style={divStyle} key={category.key}>
                            <h3>Category: {category.name}</h3>
                            <h3>Budget: ${category.budget}</h3>
                            <h3>Total: ${props.totals[category.name]}</h3>
                            <h3>Difference: ${category.budget - props.totals[category.name]}</h3>
                            <button id={category.key} onClick={props.deleteCategory}>Delete Category</button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Budget;