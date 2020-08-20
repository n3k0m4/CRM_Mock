import React, { useEffect, useState } from 'react';
import './App.css';
function Company() {

    useEffect(({ match }) => {
        fetchItem();
    }, []);
    const [item, setItem] = useState([]);
    const fetchItem = async () => {
        const data = await fetch(`http://localhost:3000/api/companies/${match.params.id}.json`);
        //console.log(url.props.match.params.id)
        //const json_data = await data.json();
        console.log(data.json());
        //setItem(json_data);
    };

    return (

        <div>
            <h3> {item.name} page</h3>
        </div>


    );
}


export default Company;