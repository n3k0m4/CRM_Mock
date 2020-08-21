import React, { useEffect, useState } from 'react';
import './Company.css';
import Nav from "./Nav";

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
        //console.log(json_data);
        setItem(json_data);
    };

    return (
        <div style={{
            padding: "50px",
            textAlign: "center",
            cursor: "pointer",
            lineHeight: "normal",

        }}>
            <table className="table">
                <thead>
                    <tr>
                        <th>id </th>
                        <td>{item.id}</td>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>Company's name </th>
                        <td>{item.name}</td>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>Website  </th>
                        <td>{item.website === "" ? "Not available" : item.website}</td>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>City  </th>
                        <td>{item.city === "" ? "Not available" : item.city}</td>
                    </tr>
                </thead>
            </table>

        </div>

    );
}


export default Company;