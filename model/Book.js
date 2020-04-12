// Require necessary NPM packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photo:{ type:String ,default:"https://a.loveholidays.com/react/6f353ee/default-hotel-img.jpg" },
  description:{ type: String, required: true },
  link:{ type:String, required: true },
  contributor:{
    type: Schema.Types.ObjectId,
    ref: "Contributor"
  },
  students:[
    {
      type: Schema.Types.ObjectId,
      ref: "Student"
  }]
});

// Compile our Model based on the Schema
const Book = mongoose.model('Book', bookSchema);

// Export our Model for use
module.exports = Book;