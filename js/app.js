(function() {
    var $searchTitle; // Store the input value
    var $searchYear; // Store the input year
    var thisTitle, thisYear, thisIMDB; // Get clicked mover's title, year and imdbID
    var $movies = $("#movies");

    // Construct function to add filter by year
    var filterByYear = function() {
      var $inputYear = '<label class="is-hidden" for="year">Any Year</label><input type="text" maxlength="4" name="year" id="year" placeholder="Year">';
      $(".search-form").append($inputYear);
    };

    // Construct callback function to display data from Amdb API
    var displayMovies = function(data) {
      $movies.empty(); // Clear last searched data
      var htmlStatus = "";
      // If find results, append to <ul> and display them
      if(data.Response === "True") {
        $.each(data.Search, function(index, movie) {
          htmlStatus += '<li>';
          htmlStatus += '<div class="poster-wrap">';
          // If have no poster, display a placeholder
          if(movie.Poster === "N/A") {
            htmlStatus += '<a href="#"><i class="material-icons poster-placeholder">crop_original</i></a></div>';
          } else {
            htmlStatus += '<a href="#"><img class="movie-poster" src="' + movie.Poster + '"></a></div>';
          }
          htmlStatus += '<span class="movie-title">' + movie.Title + '</span>';
          htmlStatus += '<span class="movie-year">' + movie.Year + '</span>';
          htmlStatus += '</li>';
        });
      } else { // If no results found, display hint message
        htmlStatus += '<li class="no-movies">';
        htmlStatus += '<i class="material-icons icon-help">help_outline</i>No movies found that match:' + $searchTitle + '.';
        htmlStatus += '</li>';
      }
      $movies.html(htmlStatus);
    };

    // Construct function to search movies
    var movieSearch = function() {
      $searchTitle = $("#search").val();
      $searchYear = $("#year").val();
      var amdbapi = "http://www.omdbapi.com/?callback=?"; // Address for Omdb API
      // Declare the date type to get from Omdb API
      var amdbapiOptions = {
        s: $searchTitle,
        y: $searchYear,
        type: "movie",
        r: "json"
      };
      $.getJSON(amdbapi, amdbapiOptions, displayMovies); // Call Omdb API
    };

    // Display movie description
		var MovieDescription = function(data) {
			console.log(data);
			$("ul li").hide(); // Hide all movie results

			var htmlStatus = '<li class="movie-description">';
			htmlStatus += '<div class="grey-bar">';
			htmlStatus += '<div class="search-back"><a href="#"> << </a> Search Results</div>';
			htmlStatus += '<div class="title-year-rating"><h2>' + data.Title + "(" + data.Year + ")" + '</h2><p>Movie Rating: ' + data.imdbRating + '</p></div>';
			htmlStatus += '</div>';
      if(data.Poster !== "N/A") { // If movie has poster, diaplay in movie description
				htmlStatus += '<div class="movie-poster clearfix"><img src="' + data.Poster + '"></div>';
			} else { // Else display this placeholder icon
				htmlStatus += '<div class="movie-poster"><i class="material-icons poster-placeholder">crop_original</i></div>';
			}

			htmlStatus += '<div class="movie-fullplot">';
			htmlStatus += '<h3 class="movie-synopsis">Plot Synopsis:</h3>';
			htmlStatus += '<p>' + data.Plot + '</p>';
      htmlStatus += '<a id="imdb-button" href="#">View on IMDB</a>';
			htmlStatus += '</div>';

			htmlStatus += '</li>';
      $movies.html(htmlStatus);
			$("li.movie-description").show(); // Show cliked movie description
      thisIMDB = data.imdbID; // Store current imdbID to variable thisIMDB
		};

    // Construct the function to search movie's description, including title, year, poster, plot information and IMDB rating
		var descriptionSearch = function() {
			var amdbapi = "https://www.omdbapi.com/?callback?";
			var amdbapiOptions = { // Declare the date type to get from Omdb API
        t: thisTitle, // Title for searching movie
        y: thisYear,
				plot: "full",
        r: "json"
      };
			$.getJSON(amdbapi, amdbapiOptions, MovieDescription); // Call Omdb API
		};

    // When document is ready, add the input for searching by year
    $(document).ready(function() {
      filterByYear();
    });

    // When click the search button, get data from Amdb API
    $("form").submit(function(e) {
      e.preventDefault();
      if($searchTitle !== "") {
        movieSearch();
      }
    });

    // When click the poster image, display movie description
    $(document).on("click", "div.poster-wrap a", function(e) {
      e.preventDefault();
			thisTitle = $(this).parent().next().text(); // Get the clicked movie's title
      thisYear = $(this).parent().next().next().text(); // Get the clicked movie's year
			descriptionSearch();
			console.log(thisTitle, thisYear);
    });

		// When click arrow key << of movie description page, return search results
		$(document).on("click", ".search-back a", function(e) {
			e.preventDefault();
			movieSearch();
			$("li.movie-description").hide();
		});

   // When click the "View on IMDB" buttom on movie description page, link to IMDB page
   $(document).on("click", "#imdb-button", function(e) {
     //e.preventDefault();
     $("#imdb-button").prop("href", "http://www.imdb.com/title/" + thisIMDB + "/").prop("target", "_blank");
   });
})(jQuery);
