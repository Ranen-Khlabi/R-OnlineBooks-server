//Require necearry NPM pacjage
const express = require("express");
//Require Mongoose Model for Students
const Student = require("../model/Student")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Autherization Middleware
const auth = require('../middlewares/studentAuth');
const cors = require('cors');
//Instantiate a Router (min app that only handles routes)
const router = express.Router();



//method to Add Student to DataBase
const saveStudent = (student, res) => {
  // Hash the password before saving the student to the DB
  bcrypt
      .hash(student.password, 10)
      .then(hashedPassword => {
          // Replace the plain password with the hashed password
          student.password = hashedPassword;
          // Create new student in the database
          return Student.create(student);
      })
      .then(student => res.status(201).json({ student: {name: student.name, id: student._id}}))
      .catch(err => res.status(500).json({ msg: err.message }));
};



/**
 * @method : GET
 * @route  : /api/students/logout
 * @action :  Logout
 * @desc   : logout students
 */
router.get('/api/students/logout', (req,res) => {
  if(req.cookies.studentToken){
      res.status(200).clearCookie("studentToken").end();
  }else{
      res.status(500).json({error: 'Failed to logout'})
  }
})



/**
 * @method : GET
 * @route : /api/students
 * @action :  index
 * @desc    : get all student
 */
router.get("/api/students", (req, res) => {
    Student.find()
      .then(student => {
        res.status(200).json({ students: student });
      })
      //catch any errors that may accours
      .catch(error => {
        res.status(500).json({ error: error });
      });
  });



/**
 * @method : GET
 * @route  : /api/student/id
 * @action :  Show
 * @desc   : get an student by student ID
 */
router.get("/api/students/:id", (req, res) => {
  Student.findById(req.params.id)
    .then(student => {
      if (student) {
        res.status(200).json({ students: student });
      } else {
        // if we coudn't find a document with matching ID
        res.status(404).json({
          error: {
            name: "DocumentNotFoundError ",
            message: "The  providednId dosen't match any documents"
          }
        });
      }
    })
    //catch any errors that may accours
    .catch(error => {
      res.status(500).json({ error: error });
    });
});



/**
 * @method POST
 * @route   /api/students
 * @action  CREATE
 * @desc    Create a new student
 */
router.post("/api/students", (req, res) => {
    // Get the student object from the request body
  const newStudent = req.body.student;
  // Check if the name already exists
  Student.findOne({ name: newStudent.name })
      .then(student => {
          if (student) {
              return res.status(500).json({ msg: "Name already exists." });
          } else {
              // In case the name is not already used save the new student.
              saveStudent(newStudent, res);
          }
      })
      .catch(err => res.status(500).json({ msg: err.message }));
});



/**
 * @method PATCH
 * @route   /api/students/id
 * @action  UPDATE
 * @desc    Update a student by ID
 */
router.patch("/api/students/:id", auth, (req, res) => {
  // Find the student with the passed ID
  Student.findById(req.params.id)
    .then(student => {
      // Check if a student is found by the passed ID
      if (student) {
        // Update the existing student with the new data from the request body
        return student.update(req.body.student);
      } else {
        // If no student was found by the passed ID, send an error message as response
        res.status(404).json({
          error: {
            name: "DocumentNotFoundError",
            message: "The provided ID doesn't match any documents"
          }
        });
      }
    })
    .then(() => {
      // If the update succeeded, return 204 and no JSON response
      res.status(204).end();
    })
    .catch(error => res.status(500).json({ error }));
});



/**
 * @method : POST
 * @route : /api/students/login
 * @action :  Login
 * @desc    : Login Student
 */
router.post("/api/students/login", cors(), (req, res, next) => {
  // Get student object from the request body
  const student = req.body.student;
  // validate student inputs
  if (!student.name || !student.password) {
      return res
          .status(500)
          .json({ msg: "Please enter your name and password" });
  }
  // Var to hold student id if found
  let studentId = 0;

  // Authenricate student
  Student.findOne({ name: student.name })
      .then(studentDoc => {
          // If the name doesn't exist return error message
          if (!studentDoc) {
              return res.status(500).json({ msg: "Name doesn't exist" });
          }
          studentId = studentDoc._id;
          // Check if the given password matches the one in the database
          return bcrypt.compare(student.password, studentDoc.password);
      })
      .then(same => {
          // If the 'same' parameter is true that means the password is correct
          if (same) {
              // Issue token for authenticated student
              const payload = { name: student.name };
              const token = jwt.sign(payload, process.env.JWT_SECRET, {
                  expiresIn: "12h"
              });
              // // Save the issued token in cookies
              // return res.cookie("studentToken", token, { httpOnly: true })
              //     .status(200)
              //     .json({student: {name: student.name, id: studentId}})
              //     .end();
                  // Respond With the Generated JWT and Student object
                return res.status(200).json({student:{name: student.name, id: studentId}, token});
          }
          // Case of wrong password
          return res.status(500).json({ msg: "Wrong password" });
      })
      .catch(err => res.status(500).json({ msg: err.message }));
});




/**
 * @method  : delete
 * @route   : /api/students/id
 * @action  : Destory
 * @desc    : delete an student by student ID
 */
router.delete("/api/students/:id", auth, (req, res) => {
  Student.findById(req.params.id)
    .then(student => {
      if (student) {
        //pass the result of mongooes's ".delete" method to thee next ".then"
        student.remove();
      } else {
        // if we coudn;t find a document with matching ID
        res.status(404).json({
          error: {
            name: "DocumentNotFoundError ",
            message: "The  providednId dosen't match any documents"
          }
        });
      }
    })
    //another then
    .then(() => {
      // if the deletion succeeded , return 204 and no JSON
      res.status(204).end();
    })
    .catch(error => {
      res.status.json({ error: error });
    });
});



//export the Router 
module.exports = router;