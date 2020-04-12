//Require necearry NPM pacjage
const express = require("express");
//Require Mongoose Model for Contributor
const Contributor = require('../model/Contributor')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// Autherization Middleware 
const auth = require('../middlewares/contributorAuth');
//Require Mongoose Model for Book
const Book = require('../model/Book')
//Instantiate a Router (min app that only handles routes)
const router = express.Router();




const saveContributor = (contributor, res) => {
  // Hash the password before saving the Contributor to the database
  bcrypt
      .hash(contributor.password, 10)
      .then(hashedPassword => {
          // Replace the plain password with the hashed password
          contributor.password = hashedPassword;
          // Create new Contributor in the database
          return Contributor.create(contributor);
      })
      .then(contributor => res.status(201).json({ contributor :{name: contributor.name, id: contributor._id}}))
      .catch(err => res.status(500).json({ msg: err.message }));
};



/**
 * @method : GET
 * @route  : /api/contributors/logout
 * @action :  Logout
 * @desc   : logout contributors
 */
router.get('/api/contributors/logout', (req,res) => {
  if(req.cookies.contributorToken){
      res.status(200).clearCookie("contributorToken").end();
  }else{
      res.status(500).json({error: 'Failed to logout'})
  }
})



/**
 * @method  GET
 * @route  /api/contributors
 * @action  INDEX
 * @desc    Get All contributors 
 */
router.get('/api/contributors', (req, res) => {
    Contributor.find()
    // Return all contributor as an Array
    .then((contributor) => {
      res.status(200).json({ contributors: contributor });
      console.log(contributors)
    })
    // Catch any errors that might occur
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });



/**
 * @method  GET
 * @route  /api/contributors:id
 * @action  SHOW
 * @desc    Get An contributors by contributors ID
 */
router.get('/api/contributors/:id', (req, res) => {
    Contributor.findById(req.params.id)
        .then((contributor) => {
          if (contributor) {
            res.status(200).json({contributors: contributor});
          } else {
            // If we couldn't find a document with the matching ID
            res.status(404).json({
              error: {
                name: 'DocumentNotFoundError',
                message: 'The provided ID doesn\'t match any documents'
              }
            });
          }
        })
        // Catch any errors that might occur
        .catch((error) => {
          res.status(500).json({ error: error });
        })
    });



/**
 * @method POST
 * @route   /api/contributors
 * @action  CREATE
 * @desc    Create a new contributors
 */
router.post("/api/contributors", (req, res) => {
    // Get the Contributor object from the request body
    const newContributor = req.body.contributor;
    // Check if the name already exists
    Contributor.findOne({ name: newContributor.name })
        .then(contributor => {
            if (contributor) {
                return res.status(500).json({ msg: "Name already exists." });
            } else {
                // In case the name is not already used save the new Contributor.
                saveContributor(newContributor, res);
            }
        })
        .catch(err => res.status(500).json({ msg: err.message }));
});



/**
 * @method  PATCH
 * @route   /api/contributors/:id
 * @action  UPDATE
 * @desc    Update a contributors by ID
 */
router.patch("/api/contributors/:id", auth, (req, res) => {
    // Find the contributor with the passed ID
    Contributor.findById(req.params.id)
        .then(contributor => {
            // Check if a contributor is found by the passed ID
            if (contributor) {
                // Update the existing contributor with the new data from the request body
                return contributor.update(req.body.contributors);
            } else {
                // If no contributor was found by the passed ID, send an error message as response
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
 * @route : /api/contributor/login
 * @action :  Login
 * @desc    : Login Contributor
 */
router.post("/api/contributors/login", (req, res) => {
  // Get Contributor object from the request body
  const contributor = req.body.contributor;
  // validate user inputs
  if (!contributor.name || !contributor.password) {
      return res
          .status(500)
          .json({ msg: "Please enter your name and password" });
  }

  let contrId = 0;
  // Authenricate Contributor
  Contributor.findOne({ name: contributor.name })
      .then(contributorDoc => {
          // If the name doesn't exist return error message
          if (!contributorDoc) {
              return res.status(500).json({ msg: "Name doesn't exist" });
          }

          contrId = contributorDoc._id
          // Check if the given password matches the one in the database
          return bcrypt.compare(contributor.password, contributorDoc.password);
      })
      .then(same => {
          // If the 'same' parameter is true that means the password is correct
          if (same) {
              // Issue token for authenticated Contributor
              const payload = { name: contributor.name };
              const token = jwt.sign(payload, process.env.JWT_SECRET, {
                  expiresIn: "12h"
              });
            //   // Save the issued token in cookies
            //   return res.cookie("contributorToken", token, { httpOnly: true })
            //       .status(200)
            //       .json({contributor: {id: contrId, name: contributor.name}})
            //       .end();
                  // Return the token and contributor object in the response
              return res.status(200).json({contributor: {id: contrId, name: contributor.name}, token});
          }
          // Case of wrong password
          return res.status(500).json({ msg: "wrong password" });
      })
      .catch(err => res.status(500).json({ msg: err.message }));
});



/**
 * @method  DELETE
 * @route   /api/contributors/id
 * @action  DESTROY
 * @desc    Delete An contributor by contributor ID
 */
router.delete("/api/contributors/:id", auth, (req, res) => {
    // Find the contributor with the passed ID
    Contributor.findById(req.params.id)
        .then(contributor => {
            // Check if a contributor is found by the passed ID
            if (contributor) {
               // pass the result of Mongoose's  .delete method to next.then statment
                return contributor.delete();
            } else {
                // If no user was found by the passed ID, send an error message as response
                res.status(404).json({
                    error: {
                        name: "DocumentNotFoundError",
                        message: "The provided ID doesn't match any documents"
                    }
                });
            }
        })
        .then(() => {
          return Book.deleteMany({contributor:req.params.id})
        })
        .then(()=>{
           res.status(204).end();
        })
        .catch(error => res.status(500).json({ error }));
});



//export the Router 
module.exports = router;