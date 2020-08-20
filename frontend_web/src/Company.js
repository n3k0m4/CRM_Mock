import React, { useEffect, useState } from 'react';
import './App.css';
import { matchPath, useRouteMatch } from 'react-router-dom';

function Company({ match }) {

    useEffect(() => {
        fetchItem();
        //console.log(match);
    }, []);
    const [item, setItem] = useState([]);
    const fetchItem = async () => {
        const data = await fetch(`http://localhost:3000/api/companies/${match.params.id}.json`);
        //console.log(url.props.match.params.id)
        const json_data = await data.json();
        console.log(json_data);
        setItem(json_data);
    };

    return (

        <div>

            <h3>ID : {item.id}</h3>
            <h3>Company's name : {item.name}</h3>
            <h3>{item.website}</h3>
            <h3>{item.city}</h3>

        </div>


    );
}


export default Company;