var sqlite3 = require('sqlite3').verbose();

// Setting up the .env file.
require("dotenv").config();

// Hiding the directory of our DB file #MUST gitignore .env file and db file.
const DBSOURCE = process.env.DB_FILE;

// Creating a connection to the database 
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
    }
});


module.exports = db