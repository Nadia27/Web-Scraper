var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new HeadlineSchema object
// This is similar to a Sequelize model
var HeadlineSchema = new Schema({
    // `headline` must be of type String
    headline: {
        type: String,
        unique: true,
        required: true  
    }, 
    // `url` must be of type String
    url:{
        type: String,
        unique: true,
        required: true
    }, 
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows to populate the Headline with an associated Note 
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

});

// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export the Headline model
module.exports = Headline;
