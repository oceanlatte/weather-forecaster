// get location lat and long
var lat = "";
var lon = "";

// search button

$("#search-weather").on("click", function(event) {
  $("#city-name-header").text("");
  event.preventDefault();
  var searchedCity = $("#city-search").val(); // city name searched val

  var weatherByName = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity + "&limit=1&appid=f29b5f7344e0cd4053782f0fead48c61";
  console.log("Searched Name, line 12", searchedCity);

  fetch(weatherByName)
    .then(function(response){
      response.json()
      .then(function(data){
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;

        var cityHeader = data[0].name + ", " + data[0].state;
        $("#city-name-header").text(cityHeader);
        getWeather(lat, lon);
      });
    });
}); 

// pass lat and lon through new function to get city's weather
function getWeather(lat, lon) {
  var weatherLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&units=imperial&appid=f29b5f7344e0cd4053782f0fead48c61"; 
  
  fetch(weatherLatLon)
    .then(function(response) {
      response.json()
      .then(function(data){
        console.log(data);
        var temp = Math.floor(data.current.temp);
        $("#temp").text(temp + "\u00B0");

        var wind = Math.floor(data.current.wind_speed);
        $("#wind").text(wind + " mph");

        var humidity = data.current.humidity;
        $("#humidity").text(humidity + "%");

        var uvi = data.current.uvi;
        $("#uvi").text(uvi + " of 10");
      })
    })
};

// button history 

// display search hero

// 5 day forecast
