import React from 'react';
import TableRow from './TableRow.js'

const Table = (props) => {
    return (
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
                props.data.map((Row)=> {
                    return <TableRow rowData={Row}/>
                })

                }
            </tbody>
        </table>
            <button onClick={props.addRow}>Add Row</button>
        </div>
    )
}


export default Table;