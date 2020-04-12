// Require necessary NPM packages
const mongoose = require('mongoose');


// Define Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: {type: String, required: true}
});


// Compile our Model based on the Schema
const Student = mongoose.model('Student', studentSchema);
// Export our Model for use
module.exports = Student;