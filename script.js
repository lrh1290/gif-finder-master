// "topics" array is named movies, includes both movies and TV shows...
var movies = ["Rick and Morty","Droste Effect","Like A Boss"];
var data = {};
var urls = [];
var favorites = [];

$("#add-movie").hide();

// Generates the Header for each item in array
function renderHeader() {
    $("#header").empty();
    for (var i=0; i < movies.length; i++) {
        var btn = $("<button>");
        btn.addClass('btn btn-primary movie');  
        btn.attr("data-name", movies[i]);
        btn.text(movies[i]);
        $("#header").append(btn);
    };
    if (favorites.length !== 0) {
        var btnFavs = $("<button id='favorites'>");
        btnFavs.addClass("btn btn-danger");
        btnFavs.text("favorites");
        $("#header").append(btnFavs);
    };
};

function updateGifs() {

    $("#gif-holder").empty();

    var movie = $(this).attr("data-name").replace(/ /g, "+");
    var limit = $('input[name=limit]:checked').val();
    
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=3ObUg1ak1zHjGy1m2YGZ0lGR1gTDPqBl&q=" + movie + "&limit=" + limit;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        data = response;

        for (var j=0; j < limit; j++) {
            var imageURL_still = response.data[j].images.fixed_height_still.url;
            var imageURL_gif = response.data[j].images.fixed_height.url;
            var imageRating = response.data[j].rating;
            var imageTitle = response.data[j].title;
            var imageId = response.data[j].id;
            urls[j] = {
                still: imageURL_still,
                gif: imageURL_gif,
                titled: imageTitle,
                rating: imageRating,
                id: imageId
            };
            var displayBox = $("<div class='col-md-3 col-sm-6 image-box'>")
            var ImageHolder = $("<img class='image img-responsive'>");
            ImageHolder.attr("id", j);
            ImageHolder.attr("src", imageURL_still);
            displayBox.append(ImageHolder);
            displayBox.append("<div>" + imageTitle + "</div><div>Rating: " + imageRating + "</div>");
            var favsBtn = $("<button title='Save to favorites' class='btn btn-danger btn-sm save' id='btn" + j + "'>");
            favsBtn.val(j);
            favsBtn.html("<i class='fas fa-heart'></i>");
            displayBox.append(favsBtn);
            var downloadBtn = $("<a title='Download' target='_blank' class='btn btn-success btn-sm' href='https://i.giphy.com/media/" + imageId + "/giphy.gif' download><button class='btn btn-info btn-sm></button></a>");
            downloadBtn.val(j);
            downloadBtn.html("<i class='fas fa-download'></i>");
            displayBox.append(downloadBtn);
            $("#gif-holder").append(displayBox);

        };
    });
};

// When click "add," make button for it
$("#add-movie").on("click", function(event) {
    event.preventDefault();
    var inputText = $("#movie-input").val();
    if (inputText == "") {
        alert("The field is blank. Please enter some text!")
        return;
    }
    if (movies.includes(inputText)) {
        alert("You already have a button for " + inputText + ". Make another choice!");
        return;
    };
    movies.push(inputText.toLowerCase());
    $("#movie-input").val('').attr("placeholder", " ");
    renderHeader();
});


// When click an image animate/deanimate it
function animate() {
    var currentImage = $(this);
    var currentImageId = currentImage.attr("id");
    if (currentImage.attr("src") == urls[currentImageId].still) {
        document.getElementById(currentImageId).setAttribute("src", urls[currentImageId].gif)
    } else {
        document.getElementById(currentImageId).setAttribute("src", urls[currentImageId].still)
    };
};
$(document).on("click", ".image", animate);

// Save to favorites
function save() {
    var id = $(this).val();
    var addToFavs = {
        still: urls[id].still,
        gif: urls[id].gif,
        titled: urls[id].titled,
        rating: urls[id].rating,
        id: urls[id].imageId
    }
    favorites.push(addToFavs);
    renderHeader();
}
$(document).on("click", ".save", save);

// Render the favorites screen
function loadFavorites() {
    $("#gif-holder").empty();
    for (var k=0; k < favorites.length; k++) {
        var imageURL_still = favorites[k].still;
        var imageURL_gif = favorites[k].gif;
        var imageTitle = favorites[k].titled;
        var imageRating = favorites[k].rating;
        var imageId = favorites[k].id;
        
        urls[k] = {
            still: imageURL_still,
            gif: imageURL_gif,
            titled: imageTitle,
            rating: imageRating,
            id: imageId
        };
        
        var displayBox = $("<div class='col-md-4 col-sm-6 image-box'>")
        var ImageHolder = $("<img class='image img-responsive'>");
        ImageHolder.attr("id", k);
        ImageHolder.attr("src", imageURL_still);
        displayBox.append(ImageHolder);
        displayBox.append("<div>" + imageTitle + "</div><div>Rating: " + imageRating + "</div>");
        
        var downloadBtn = $("<a class='btn btn-info btn-sm' href='https://i.giphy.com/media/" + imageId + "/giphy.gif' download target='_blank'><button class='btn btn-info btn-sm></button></a>");
        downloadBtn.val(k);
        downloadBtn.text("Download");
        displayBox.append(downloadBtn);
        
        $("#gif-holder").append(displayBox);
    };
};

$(document).on("click", "#favorites", loadFavorites);

// When click a button, fetch gifs
$(document).on("click", ".movie", updateGifs);

renderHeader();
