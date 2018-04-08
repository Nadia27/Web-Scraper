//Dynamically create table in HTML
//Pulling data from db 
function displayResults(data) {
    // Add to the table here...
    //empty first!
    $("tbody").empty();
    data.forEach(function (headline) {
        $("tbody").append(`<tr><td>${headline.title}</td><td>${headline.url}</td></tr>`)
    });
}

// First thing: ask the back end for json with all animals
$.getJSON("/scrape", function (data) {
    // Call our function to generate a table body
    displayResults(data);
});
