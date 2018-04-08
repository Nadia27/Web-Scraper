//Dynamically create table in HTML
//Pulling data from db 
function displayResults(data) {
    // Add to the table here...
    //empty first!
    $(".card").empty();
    data.forEach(function (headline) {
        $(".container").append(`<div class="card">
                        <div class="card-header">Featured Headline:</div>
                        <div class="card-body">
                        <h5 class="card-title title">${headline.title}</h5>
                        <p class="card-text url">${headline.url}</p>
                        <a href="#" class="btn btn-primary">Save Article</a>
                        </div>
                        </div>`);
    });

}    


//When Scrape button is pressed grab new articles 
$("#scrape").on("click", function () {
    // Do an api call to the back end for json with all animals sorted by weight
    $.getJSON("/scrape", function (data) {
        // Call our function to generate a table body
        displayResults(data);
    });
});

