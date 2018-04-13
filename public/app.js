//Dynamically create table in HTML
//Pulling data from db 
function displayResults(data) {
    // Add to the table here...
    //empty first!
    $(".card").empty();
    data.forEach(function (headline) {
        $(".container").append(`<div class="card" >
                        <div class="card-header">Featured Headline:</div>
                        <div class="card-body">
                        <h5 class="card-title title">${headline.title}</h5>
                        <p class="card-text url">${headline.url}</p>
                        <button type="button" class="btn btn-primary" 
                        data-toggle="modal" data-target="#exampleModal" id="change-save"
                        value=${headline.saved} data-id=${headline._id}>Save Headline</button>
                        </div>
                        </div>`);
    });

}    

//When Scrape button is pressed grab new headlines 
$("#scrape").on("click", function () {
    // Do an api call to the back end for json with all scraped headlines
    $.getJSON("/scrape", function (data) {
        // Call our function to generate headline cards 
        displayResults(data);
    });
});

//Change-save button loaded dynamically
//Document ready needed to pick up click event 
$(document).ready(function () {
    $(document).on("click", "#change-save", function () {
        var thisId = $(this).attr("data-id");
        console.log(thisId);
        //alert(event.target.id);
    });
});


//When Saved Articles button press grab all saved headlines
$("#saved").on("click", function() {
    //change saved column in db to true for
    console.log("grabbing all saved articles!"); 
   
});






