const Student = require("../model/Student");
const mongoose = require("mongoose");
const db = require("../config/db");


// Connect to the database
mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("the connection with mongo is established");
    }
);


// Students dummy data
const students = [
    { name: "Rawah" },
    { name: "Ranen" },
    { name: "Amina" },
    { name: "Rana" },
    { name: "Renad" },
    { name: "Hamad" },
    { name: "Hend" },
    { name: "Sammer" }
];


// Insert students array to the database
Student.insertMany(students)
    .then(() => console.log("Data added"))
    .catch(err => console.log(err));