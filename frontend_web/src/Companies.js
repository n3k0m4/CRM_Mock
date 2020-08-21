import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from 'react-bootstrap';
import Company from "./Company";



function Companies() {

    const hiddenRows = []; // This is to store the clicked element's id so we can hide them
    const [items, setItems] = useState([]); // To fetch the data from the jsons
    const [state, setState] = useState(false); // To check each row's state so we can update the table
    const All_data = [];

    // Fetch the data from all the companies jsons and storing them on Items
    const fetchItems = async () => {
        for (let index = 1; index < 88; index++) {
            const data = await fetch(`http://localhost:3000/api/companies-${index}.json`);
            const items = await data.json();
            items.results.forEach(element => {
                All_data.push(element);
            });
            setItems(All_data);
        }
    };

    // On rendring the page we fetch the items and the row's states
    useEffect(() => {
        fetchItems();
        setState(false);
    }, []);

    /**
     *   Defining the columns of our table with some styling (We must have a Primary key in our data)
     *   Using the rankformatter to put our buttons on the last column
     */
    const columns = [
        {
            dataField: "id",
            text: "id",
            headerAttrs: { width: 250 },
            attrs: { width: 250, className: "EditRow" }
        },
        {
            dataField: "name",
            text: "Company name",
        },
        {
            dataField: "edit",
            text: "Edit",
            sort: false,
            formatter: rankFormatter,
            headerAttrs: { width: 250 },
            attrs: { width: 250, className: "EditRow" }
        }
    ];
    /**
     * Making the rows selectable 
     * Defining the event onSelect to apply when the user selects one row
     * Defining the onSelectAll event to help selecting a whole page at the time
     * Check the console log to see how it works
     */
    const selectRow = {
        // You can change the mode from radio to checkbox to hide multiple rows at the same time
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            //console.log(isSelect);
            const selected_row_id = rowIndex + 1;

            if (isSelect && hiddenRows.indexOf(selected_row_id.toString()) < 0) {
                hiddenRows.push(selected_row_id.toString());
            }
            if (!(isSelect) && hiddenRows.indexOf(selected_row_id.toString()) > -1) {
                hiddenRows.splice(hiddenRows.indexOf(selected_row_id.toString()), 1);
            }
            console.log(hiddenRows);
            setState(true);
        },
        /**
        * Just to Handle the button that selects everything at the time (Side case)
        */
        onSelectAll: (isSelect, rows, e) => {
            if (isSelect) {
                rows.map(element => {
                    if ((hiddenRows.indexOf(element.id) < 0)) {
                        hiddenRows.push(element.id);
                    }
                })
            }
            else { hiddenRows.splice(0, hiddenRows.length); }
            console.log(hiddenRows);
        }

    };

    return (
        /**
         * Routing the Links created rankFormatter to the company component.
         * Creating the table with "id" as Primary key and "items" as data.
         * The pagination is completely handeled by paginationFactory.
         * hiddenRows is used to Hide rows in the Array given.
         * selectRow is doing an important job at dealing with selecting events
         */
        <Router>
            <Switch>
                <Route path='/companies/:id' component={Company} />
                <div>
                    <h4>All companies' data:</h4>
                    <h1>{state}</h1>
                    <BootstrapTable
                        keyField="id"
                        data={items}
                        columns={columns}
                        hiddenRows={hiddenRows}
                        pagination={paginationFactory()}
                        selectRow={selectRow}
                    />
                </div>
            </Switch>
        </Router>
    )
}
/**
 * Creating the buttons to Hide and Info
 * Each element of our data represented in the table is dynamically linked to "/companies/:id"
 */
function rankFormatter(cell, row, rowIndex, formatExtraData) {
    return (

        <div style={{
            textAlign: "center",
            cursor: "pointer",
            lineHeight: "normal"
        }}>
            <Link to={`/companies/${rowIndex + 1}`}>
                <Button key={rowIndex} style={{
                    textAlign: "center",
                    cursor: "pointer",
                    lineHeight: "normal"
                }} color="primary">Info</Button>{}
            </Link>

            <Button style={{
                textAlign: "center",
                cursor: "pointer",
                lineHeight: "normal"
            }} color="primary">Hide</Button>{}
        </div >
    );
};



export default Companies;