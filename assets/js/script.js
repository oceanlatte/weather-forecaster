var searchedCity = $("#city-search").val(); // city name searched val

// get location lat and long
var weatherByName = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=f29b5f7344e0cd4053782f0fead48c61";
var lat = "";
var lon = "";

// search button

$("#search-weather").on("click", function(event) {
  event.preventDefault();

  fetch(weatherByName)
    .then(function(response){
      response.json()
      .then(function(data){
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeather(lat, lon);
      });
    });
  // show values 
  console.log("clicked search button");
}); 

// pass lat and lon through new function to get city's weather
function getWeather(lat, lon) {
  var weatherLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&units=imperial&appid=f29b5f7344e0cd4053782f0fead48c61"; 
  
  fetch(weatherLatLon)
    .then(function(response) {
      response.json()
      .then(function(data){
        console.log(data);

        var temp = console.log("temp", data.current.temp);
        $("#temp").text(temp);
        var wind = console.log("windspeed", Math.floor(data.current.wind_speed));
        var humidity = console.log("humidity", data.current.humidity);
        var uvi = console.log("UV index", data.current.uvi)
      })
    })
};

// button history 

// display search hero

// 5 day forecast
