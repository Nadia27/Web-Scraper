//
//Dependencies=====================================
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const request = require("request");
const Headline = require("./models/Headline.js")
//==================================================

//
//Scraping=========================================
//Axios promised based http library
const axios = require("axios");
const cheerio = require("cheerio");

//
//Require models ==========================================
const db = require("./models");


const PORT = 3001;

//intialize Express 
const app = express();

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
mongoose.connect("mongodb://localhost/mongoresults");
// If deployed, use the deployed database. Otherwise use the local mongoresults database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoresults";



//
//Routes=============================================================
// Simple index.html route
app.get("/", function (req, res) {
    res.send(index.html);
});




//Scrape Stories from Good News Site 
// A GET route for scraping the goodnews website
app.get('/scrape', function (req, res) {
    // First, we grab the body of the html with request
    axios
        .get('https://www.goodnewsnetwork.org')
        .then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // The list of results that need to be saved.
            const results = [];

            // Now, we grab every h2 within an article tag, and do the following:
            $('h3.td-module-title').each(function (i, element) {
                // Save an empty headline object
                const headline = {};

                // Add the text and href of every link, and save them as properties of the result object
                headline.title = $(this).text();

                headline.url = $(this).children().attr('href');

                // Check to see if headline already exists in the array
                if (!results.some(h => h.title === headline.title)) {
                    // Add the headline to the `results` array
                    results.push(headline);
                }
            });

            console.log(results);
            //Now that I have the scraped headlines...put into db
             // Remove all headlines that exist
                 db.Headline.remove()
                .then(() => {
                    // Insert the new headlines
                db.Headline.insertMany(results)
                .then(() => {
                    console.log(results); 
                }).catch(function(err) {
                    return res.json(err);
                });
                res.send("Scrape Complete");
                    
                }); 
        });
    }); 

      
// Getting the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {
    // grab every doc in the Articles array
    // Get the new headlines
    db.Headline.find({})
        // Return the new headlines
        .then(docs => res.json(docs))

        // There was an error getting the headlines
        .catch(err => res.status(500).json(err));
});

// Saving an article
app.post("/saved/:id", function (req, res) {
    db.Headline.findOneAndUpdate(
        {
             "_id": req.params.id 
        }, 
        { 
            "saved": true 
        }, 
        function (err, doc) {
        // Log any errors
        if (err) {
            console.log(err);
        } else {
            // Or send the user back to the all articles page once saved
            res.redirect("/saved");
        }
    });
});

// Showing saved articles
app.get("/saved", function (req, res) {
    // Grab every saved article in Articles db
    Headline.find(
        { 
            "saved": true 
        }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.render("saved", {
                allHeadlines: doc
            });
        }
    });
});




// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});