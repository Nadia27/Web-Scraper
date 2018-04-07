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

var PORT = 3000; 

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
mongoose.connect("mongodb://localhost/mongoHeadlines", {
    useMongoClient: true
}); 
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
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.goodnewsnetwork.org/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("h3.td-module-title").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.headline = $(this).text();
            
            result.url = $(this).children().attr("href");

            // Create a new Headline using the `result` object built from scrapin
            db.Headline.findOneAndUpdate({},result, 
                {
                     upsert: true, 
                     new: true, 
                     setDefaultsOnInsert: true }).
            //db.Headline.create(result)
                then(function (dbHeadline) {
                    // View the added result in the console
                    console.log(dbHeadline);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        console.error(err);
        /* res.send("Scrape Complete"); */
    });
});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});