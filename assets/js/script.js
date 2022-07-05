var searchArr = [];
var todaysDate = moment().format("MM/DD/YY");

// set localStorage
function cityStorage(search) {
  if (localStorage.getItem("cities") == null) {
    localStorage.setItem("cities", searchArr);
  }
  else {
  searchArr.push(search);
  localStorage.setItem("cities", JSON.stringify(searchArr));
  }
  currentCity(search);
  searchHistory(search);
};

// Click on History Buttons
$("#history").on("click", "button", function() {
  console.log("clicked");
  var savedCity = $(this).text();
  currentCity(savedCity);
});

// History buttons, generate button for each city search
function searchHistory(city) {
  var historyButtons = $("<button>")
    .addClass("btn btn-secondary city-history")
    .text(city);
  $("#history").append(historyButtons);
};

// searched city value to get the lat and lon
function currentCity(city) {
  var weatherByName = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=f29b5f7344e0cd4053782f0fead48c61";

  fetch(weatherByName)
    .then(function(response){
      response.json()
      .then(function(data){
        // get lattitue and longitude from city name search
        var lat = data[0].lat;
        var lon = data[0].lon;

        // Weather City Name Header, Date, Icon
        var cityHeader = data[0].name + ", " + data[0].state;
        $("#city-name-header")
          .text(cityHeader + " (" + todaysDate + ")");

        // pass values to next function
        getWeather(lat, lon);
      });
    });
    var formEl = document.querySelector("#search-form");
    formEl.reset();
}

function getWeather(lat, lon) { // pass lat and lon through function to get city's weather in Results Container
  var weatherLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=f29b5f7344e0cd4053782f0fead48c61"; 
  
  fetch(weatherLatLon)
    .then(function(response) {
      response.json().then(function(data){
        console.log(data);
  
        // weather icon 
        var weatherIcon = data.current.weather[0].icon;
        console.log("header icon", weatherIcon);
        $("#icon").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");

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
        var uvi = data.current.uvi;
        // UV index conditional
        if (uvi <= 2) {
          $("#uvi").text(uvi)
          .css("backgroundColor", "green")
          .css("color", "white");
        }
        else if (uvi > 2 && uvi <= 5) {
          $("#uvi").text(uvi)
          .css("backgroundColor", "#ff9900")
          .css("color", "white");
        }
        else {
          $("#uvi").text(uvi)
          .css("backgroundColor", "#800000")
          .css("color", "white");
        }
        fiveDay(data);
      })
    })
};

// 5 day forecast
function fiveDay(weatherData) {
  // remove any cards from another city search
  $(".card").remove();

  // generate information for each card
  for(var i = 1; i < 6; i++) {
    var cardContainer = $("<div>").addClass("card p-2");

    // format Unix UTC to date
    var newDate = moment.unix(weatherData.daily[i].dt).format("M/D/YY");
    var cardHeader = $("<h4>")
      .addClass("fs-5")
      .text(newDate)
    ;
    
    var dayIcon = weatherData.daily[i].weather[0].icon;
    console.log(dayIcon);
    var createIcon = $("<img>")
      .attr("src", "http://openweathermap.org/img/wn/" + dayIcon +"@2x.png")
    ;

    var cardIcon = $("<p>")
    .addClass("card-result mb-2")
    .text(createIcon)
    ;


    var dayTemp = weatherData.daily[i].temp.day;
    var cardTemp = $("<p>")
      .addClass("card-result mb-2")
      .text("Temp: " + Math.floor(dayTemp) + " \u00B0F")
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

    // !!! ADD Icon to list of appended children !!!
    
    cardContainer.append(cardHeader, cardIcon, cardTemp, cardWind, cardHumid)
    $(".forecast-cards").append(cardContainer);
  }
}

// handle bad responses

function loadStorage() {
  var previousCity = JSON.parse(localStorage.getItem("cities"));

  for (var i = 0; i < previousCity.length; i++) {
    searchHistory(previousCity[i]);
  }
};

// Click search button handler
$("#search-weather").on("click", function(event) {
  event.preventDefault();
  var searchedCity = $("#city-search").val(); // city name searched value
  cityStorage(searchedCity);
});

loadStorage();