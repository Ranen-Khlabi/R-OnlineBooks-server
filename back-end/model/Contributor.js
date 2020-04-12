// Require necessary NPM packages
const mongoose = require('mongoose');

// Define Article Schema
const contributorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: {type: String, required: true}

});

// Compile our Model based on the Schema
const Contributor = mongoose.model('Contributor', contributorSchema);

// Export our Model for use
module.exports = Contributor;