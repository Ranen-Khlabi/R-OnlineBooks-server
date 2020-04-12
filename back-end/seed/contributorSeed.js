const Contributor = require("../model/Contributor");
const mongoose = require("mongoose");
const db = require("../config/db");


mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("the connection with mongod is established");
    }
);


// contributors dummy data
const contributors = [
    { name: "Hanouf" },
    { name: "Asmaa" },
    { name: "Reem" },
    { name: "Aseel" },
    { name: "Sara" },
    { name: "Dana" }
];


// Insert contributors array to the database
Contributor.insertMany(contributors)
    .then(() => console.log("Data added"))
    .catch(err => console.log(err));