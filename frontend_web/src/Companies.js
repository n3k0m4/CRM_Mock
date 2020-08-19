import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import * as ReactBootStrap from "react-bootstrap";


function Companies() {


    const [items, setItems] = useState([]);
    const All_data = [];
    const fetchItems = async () => {

        for (let index = 1; index < 88; index++) {
            const data = await fetch(`http://localhost:3000/api/companies-${index}.json`);
            const items = await data.json();
            items.results.forEach(element => {
                All_data.push(element);
            });

            setItems(All_data);
        }

        //console.log(All_data);

        //console.log(All_data[1000]);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const columns = [
        { dataField: "id", text: "id" },
        { dataField: "name", text: "Company name" },
    ];




    return (
        <BootstrapTable
            keyField="id"
            data={items}
            columns={columns}
            pagination={paginationFactory()}
        />
    )
}
export default Companies;