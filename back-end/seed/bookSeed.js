const Book = require("../model/Book");
const mongoose = require("mongoose");
const db = require("../config/db");


mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("the connection with mongod is established");
    }
);


const Books = [{ 
//front-end
    title: "Front-end Developer Handbook",
    photo: "https://frontendmasters.com/books/front-end-handbook/2019/assets/images/FM_2019Cover_final.jpg",
    description: "This is a guide that everyone can use to learn about the practice of front-end development. It broadly outlines and discusses the practice of front-end engineering: how to learn it and what tools are used when practicing it in 2019.",
    link: "file:///C:/Users/Ranee/Downloads/Front-end%20Developer%20Handbook%202019.pdf",
    contributor:  "5e86064db395889c90db7ad1",
    students:[ "5e860576b395889c90db7ac9", "5e860576b395889c90db7aca"]},
{
//back-end 
    title: "Backend Development",
    photo: "https://i.gr-assets.com/images/S/photo.goodreads.com/books/1429014722i/25357705.jpg",
    description: "Design and Implementation of Software for the Web",
    link: "https://www.jonbell.net/wp-content/uploads/2016/12/Lecture-13-Backend-Development.pdf",
    contributor:  "5e86064db395889c90db7ad4",
    students:[ "5e860576b395889c90db7ac9", "5e860576b395889c90db7aca"]},
{
//English  
    title: "Learning English with easypacelearning.com",
    photo: "https://i.pinimg.com/originals/ec/ab/40/ecab40c8c02d408665098a6ece4c2acf.jpg",
    description: "Complete Phrasal Verbs List",
    link: "file:///C:/Users/Ranee/Downloads/phrasalverblisteasypacelearning.pdf",
    contributor:  "5e86064db395889c90db7ad3",
    students:[ "5e860576b395889c90db7acb"]},
{ 
//Java
    title: "java book pdf",
    photo: "https://i.pinimg.com/originals/06/9e/d0/069ed08689040b4b170c6bb8858ae87f.png",
    description: "Java is a high-level programming language originally developed by Sun Microsystems and released in 1995 .",
    link: "https://www.tutorialspoint.com/java/java_tutorial.pdf",
    contributor:  "5e86064db395889c90db7ad2",
    students:[ "5e860576b395889c90db7ace", "5e860576b395889c90db7acf"]
}]




// Insert Book array to the database
Book.insertMany(Books)
    .then(() => console.log("Data added"))
    .catch(err => console.log(err)); 