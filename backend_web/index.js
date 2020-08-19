const express = require("express");
const app = express();

// Implementing the router to our routes
const routeMatches = require("./routes/matches");
const routeCompanies = require("./routes/companies");

// Routes middleware
app.use("/matches", routeMatches);
app.use("/companies", routeCompanies);

// Just a HOME page 
app.get("/", (req, res) => {
    res.send("<h1>HOME</h1>");
})

// denying any other access
app.use(function (req, res) {
    res.status(404).send("You are not allowed here ^^'");
});

const server = app.listen(3000, () => {
    console.log("Listening at port 3000");
})

module.exports = server;