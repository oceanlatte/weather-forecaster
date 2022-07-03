var todaysDate = moment().format("MM/DD/YY");

// searched city value to get the lat and lon
function currentCity(city) {
  var weatherByName = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=f29b5f7344e0cd4053782f0fead48c61";

  fetch(weatherByName)
    .then(function(response){
      response.json()
      .then(function(data){
        // get lattitue and longitude from city name search
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;

        // Weather City Name Header, Date, Icon
        var cityHeader = data[0].name + ", " + data[0].state;
        $("#city-name-header")
          .text(cityHeader + " (" + todaysDate + ")");

        // !!!!!! ADD: weather icon to end of header!!!!!!!
        // var weatherIcon = data.current.weather[0].icon;
        // console.log(weatherIcon);

        // pass values to next function
        getWeather(lat, lon);
        searchHistory(city);
        // historyChecker(city);
      });
    });
    var formEl = document.querySelector("#search-form");
    formEl.reset();
}

// function historyChecker(city) {
//   var matchCity = $("#history:contains(city)");
//   console.log(matchCity);

//   var historyCheck = $("#history.has(button)");
//   console.log(historyCheck, "history check for children")

//   // if (!historyCheck) {
//   //   searchHistory(city);
//   // }
//   // else {
//   //   console.log("not empty");
//   // }
// }


function getWeather(lat, lon) { // pass lat and lon through function to get city's weather in Results Container
  var weatherLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=f29b5f7344e0cd4053782f0fead48c61"; 
  
  fetch(weatherLatLon)
    .then(function(response) {
      response.json().then(function(data){
        console.log(data);
        // display temp
        var temp = Math.floor(data.current.temp);
        $("#temp").text(temp + "\u00B0F");
        // display wind
        var wind = data.current.wind_speed;
        $("#wind").text(wind + " MPH");
        // dispay humidity
        var humidity = data.current.humidity;
        $("#humidity").text(humidity + "%");
        // display UV index
        // !!! ADD: UV index indicator !!!!
        var uvi = data.current.uvi;
        $("#uvi").text(uvi);
        fiveDay(data);
      })
    })
};

// 5 day forecast
function fiveDay(weatherData) {
  for(var i = 1; i < 6; i++) {
    var cardContainer = $("<div>").addClass("card p-2");

    var newDate = moment.unix(weatherData.daily[i].dt).format("M/D/YY");
    var cardHeader = $("<h4>")
      .addClass("fs-5")
      .text(newDate)
    ;
    
    // add icon

    var dayTemp = weatherData.daily[i].temp.day;
    var cardTemp = $("<p>")
      .addClass("card-result mb-2")
      .text("Temp: " + dayTemp + " \u00B0F")
    ;
   
    var dayWind = weatherData.daily[i].wind_speed;
    var cardWind = $("<p>")
      .addClass("card-result mb-2")
      .text("Wind: " + dayWind + " MPH")
    ;

    var dayHumid = weatherData.daily[i].humidity;
    var cardHumid = $("<p>")
      .addClass("card-result mb-2")
      .text("Humidity: " + dayHumid + "%")
    ;

    cardContainer.append(cardHeader, cardTemp, cardWind, cardHumid)
    $(".forecast-cards").append(cardContainer);
  }
}


// History buttons, generate button for each city search
function searchHistory(city) {
  var historyButtons = $("<button>")
    .addClass("btn btn-secondary city-history")
    .text(city);
  $("#history").append(historyButtons);

  // on click of history buttons run through weather function again
  $(".city-history").on("click", function(){
    var savedCity = $(this).text();
    currentCity(savedCity);
  })
}


// handle bad responses


// Click search button handler
$("#search-weather").on("click", function(event) {
  event.preventDefault();
  var searchedCity = $("#city-search").val(); // city name searched value
  currentCity(searchedCity);
});