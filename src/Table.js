import React from 'react';
import TableRow from './TableRow.js'

// create new simple component Table that accepts a props parameter
// simple component because it simply renders the Table rows, does not have its own state or methods
const Table = (props) => {
    return (
        <section>
            <h2>Transactions</h2>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Earned</th>
                            <th>Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            // map the data, which is the array of rows passed down from App.js
                            // data was passed down from firebase and sorted in sortData function
                            props.rows.map((Row)=> {
                                return (
                                    <TableRow key={Row.key} 
                                        deleteRow={props.deleteRow} 
                                        rowData={Row} 
                                        pushToFirebase={props.pushToFirebase}
                                        categories={props.categories}
                                    />
                                )
                            })
                            
                        }
                    </tbody>
                </table>
            </div>
            <button className="add-row" onClick={props.addRow}>Add Row</button>
        </section>
    )
}


export default Table;