import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from 'react-bootstrap';
import Company from "./Company";



function Companies() {

    const Hidden_rows = [];
    const [items, setItems] = useState([]);
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
    // On rendring the page we fetch the items
    useEffect(() => {
        fetchItems();
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
     */
    const selectRow = {
        // You can change the mode from radio to checkbox to hide multiple rows at the same time
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            const selected_row_id = rowIndex + 1;
            if (!(isSelect) && selected_row_id in Hidden_rows) {
                removeA(Hidden_rows, selected_row_id);

            }
            if (isSelect && !(selected_row_id in Hidden_rows)) {
                Hidden_rows.push(selected_row_id);
            }

            console.log(Hidden_rows);
        },
        /**
        * Just to Handle the button that selects everything at the time (Side case)
        */
        onSelectAll: (isSelect, rows, e) => {
            if (isSelect) {
                rows.map(element => {
                    if (!(parseInt(element.id) in Hidden_rows)) {
                        Hidden_rows.push(parseInt(element.id));
                    }
                })
            }
            else { Hidden_rows.splice(0, Hidden_rows.length); }
            console.log(Hidden_rows);
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
                <BootstrapTable
                    hover
                    bordered
                    condensed
                    keyField="id"
                    data={items}
                    columns={columns}
                    pagination={paginationFactory()}
                    hiddenRows={Hidden_rows}
                    selectRow={selectRow}
                />
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
// Global function to remove elements from Hidden_rows when we unClick it
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

export default Companies;