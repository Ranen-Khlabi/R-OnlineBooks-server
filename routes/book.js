//Require necearry NPM pacjage
const express = require("express");
//Require Mongoose Model for Organization
const Book = require('../model/Book')
//Instantiate a Router (min app that only handles routes)
const router = express.Router();



/**
 * @method  GET
 * @route  /api/books
 * @action  INDEX
 * @desc    Get All books 
 */
router.get('/api/books', (req, res) => {
    Book.find()
    .populate("contributor", "name")
    .populate("students", "name")
    // Return all book as an Array
    .then((book) => {
      res.status(200).json({ book });
      console.log(books)
    })
    // Catch any errors that might occur
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });



/**
 * @method GET
 * @route  /api/books:id
 * @action  SHOW
 * @desc    Get An books by books ID
 */
router.get('/api/books/:id', (req, res) => {
    Book.findById(req.params.id)
    .populate("contributor", "name")
    .populate("students", "name")
        .then((book) => {
          if (book) {
            res.status(200).json({books: book});
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
 * @method  POST
 * @route   /api/books
 * @action  CREATE
 * @desc    Create a new books
 */
router.post("/api/books", (req, res) => {
    // Add the books recieved from the request body to the database
    Book.create(req.body.book)
        .then(book => res.status(201).json({ book }))
        .catch(error => res.status(500).json({ error }));
});



/**
 * @method PATCH
 * @route   /api/books/:id
 * @action  UPDATE
 * @desc    Update a books by ID
 */
router.patch("/api/books/:id", (req, res) => {
    // Find the book with the passed ID
    Book.findById(req.params.id)
        .then(book => {
            // Check if a book is found by the passed ID
            if (book) {
                // Update the existing book with the new data from the request body
                return book.update(req.body.books);

            } else {
                // If no book was found by the passed ID, send an error message as response
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
 * @method  DELETE
 * @route   /api/books/id
 * @action  DESTROY
 * @desc    Delete An book by book ID
 */
router.delete("/api/books/:id", (req, res) => {
    // Find the book with the passed ID
    Book.findById(req.params.id)
        .then(book => {
            // Check if a book is found by the passed ID
            if (book) {
               // pass the result of Mongoose's  .delete method to next.then statment
                return book.delete();
            } else {
                // If no book was found by the passed ID, send an error message as response
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



//export the Router 
module.exports = router;