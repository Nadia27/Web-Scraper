var mongoose = require("mongoose"); 

//Save a reference to the Schema constructor
var Schema = mongoose.Schema; 

//Using Schema constructor, create a new CommentSchema object 
var NoteSchema = new Schema({
    
    //body must be a string
    body: String
});

//Creates Model from above schema 
var Note = mongoose.model("Note", NoteSchema);

//Export the model
module.exports = Note; 