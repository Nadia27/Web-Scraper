//
//Dependencies=====================================
var express = require("express");  
var bodyParser = require("body-parser"); 
var mongoose = require("mongoose");
var logger = require("morgan");  
var request = require("request"); 
//==================================================

//
//Scraping=========================================
//Axios promised based http library
var axios = require("axios"); 
var cheerio = require("cheerio"); 

//
//Require models ==========================================
 var db = require("./models");  

var PORT = 3001; 

//intialize Express 
var app = express(); 

// Set the app up with morgan.
// morgan is used to log our HTTP Requests.
//Concise output colored by response status for development use
//package will return color coded error codes and uncolored for other codes  
app.use(logger("dev"));
// Setup the app with body-parser and a static folder
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoHeadlines"); 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



//
//Routes=============================================================
// Simple index.html route
app.get("/", function (req, res) {
    res.send(index.html);
}); 


//Scrape Stories for New Site 
// A GET route for scraping the goodnews website
app.get('/scrape', function (req, res) {
    // First, we grab the body of the html with request
    axios
        .get('https://www.goodnewsnetwork.org')
        .then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // The list of headlines that need to be saved.
            const headlines = [];

            // Now, we grab every h2 within an article tag, and do the following:
            $('h3.td-module-title').each(function (i, element) {
                // Save an empty headline object
                const headline = {};

                // Add the text and href of every link, and save them as properties of the result object
                headline.title = $(this).text();

                headline.url = $(this).children().attr('href');

                // Check to see if headline already exists in the array
                if (!headlines.some(h => h.title === headline.title)) {
                    // Add the headline to the `headlines` array
                    headlines.push(headline);
                }
            });

            console.log(headlines);

            // Remove all headlines that exist
            db.Headline.remove()
                .then(() => {
                    // Insert the new headlines
                    db.Headline.insertMany(headlines)
                        .then(() => {
                            // Get the new headlines
                            db.Headline.find()
                                // Return the new headlines
                                .then(docs => res.json(docs))

                                // There was an error getting the headlines
                                .catch(err => res.status(500).json(err));
                        })

                        // There was an error inserting the new headlines
                        .catch(err => res.status(500).json(err));
                })

                // There was an error deleting the old headlines
                .catch(err => res.status(500).json(err));
        })
        .catch(function (err) {
            // There was an error with Axios, set the response status to 500 and return the error as a JSON object
            res.status(500).json(err);
        });
});

/* // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
}); */


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});