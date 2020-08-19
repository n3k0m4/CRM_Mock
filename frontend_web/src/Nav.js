import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav>
            <h3>
                <img src="./logo192.png" alt='logo' />
            </h3>
            <ul className="nav-links">
                <Link to='/companies'>
                    <li>
                        Companies
                </li>
                </Link>
            </ul>
        </nav>
    )
}
export default Nav;