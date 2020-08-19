import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Link, Route } from 'react-router-dom';

function App() {
  useEffect(() => {
    fetchItems();
  }, []);
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    const data = await fetch(`http://localhost:3000/api/companies-1.json`);
    const items = await data.json();
    console.log(items);
    setItems(items.results);
  };
  return (
    <BrowserRouter>
      <div>
        {items.map(item => (
          <h3 key={item.id}>
            <Route path='/0' component={item} />
            <Link to={`/${item.id}`}>
              {item.name}
            </Link>
          </h3>
        ))}
      </div>
    </BrowserRouter>

  );
}

export default App;
