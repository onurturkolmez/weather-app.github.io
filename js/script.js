var app = angular.module('weatherApp', []);
app.controller('weatherController', function ($scope, $http) {

    //get location and show weather data for that location when page loading
    //if location permission has denied,show default city weather data(ankara)
    $scope.init = function () {
        var lat = "",
            lon = "";
        var openCageApiKey = "0bd6b0e99eb949f397e21a95bec406c2";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                //document.getElementById("chkLoc").checked = true;
                lon = pos.coords.longitude;
                lat = pos.coords.latitude;
                var locationApiQuery = "https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + lon + "&key=" + openCageApiKey;
                $http.get(locationApiQuery)
                    .then(function (response) {
                        console.log(response);
                        var cityName = response.data.results[0].components.city;
                        $scope.searchText = cityName;
                        $scope.search();
                    });
            });
        }
        if (lat == "") {
            $scope.searchText = "Ankara";
            $scope.search();
        }
    }

    $scope.fonk = function (event) {
        if (event.key == "Enter") {
            $scope.search();
        }
    }



    //show city weather data by city name
    $scope.search = function () {
        $scope.showCel = true;
        $scope.futureData = [];
        var appId = "58b6f7c78582bffab3936dac99c31b25";
        var apiQuery = "//api.openweathermap.org/data/2.5/forecast?q=" + $scope.searchText + "&appid=" + appId;
        $http.get(apiQuery)
            .then(function (response) {

                var limit = response.data.list.length;

                //start for future days and for that day's future hours
                for (var i = 0; i < limit; i += 8) {

                    var weatherClass = "wi " + getWeatherIconClass(response.data.list[i].weather[0].id);
                    var day = new Date(response.data.list[i].dt_txt).getDay()
                    day = getDayName(day);

                    //find maximum and minimum temptatures for that day
                    var maxTemp = 0,
                        index = i,
                        minTemp = response.data.list[index].main.temp;
                    var lastPoint = 0;
                    i + 8 > limit ? lastPoint = limit : lastPoint = i + 8;

                    for (index; index < lastPoint; index++) {
                        var temp = response.data.list[index].main.temp;
                        if (temp > maxTemp)
                            maxTemp = temp;
                        if (temp < minTemp)
                            minTemp = temp;
                    }

                    var celcius = kelvinToCelcius(maxTemp).toString() + " - " + kelvinToCelcius(minTemp).toString() + "°C";
                    var fahrenheit = kelvinToFahrenheit(maxTemp).toString() + " - " + kelvinToFahrenheit(minTemp).toString() + "°F";

                    $scope.futureData.push({
                        "weatherClass": weatherClass,
                        "day": day,
                        "celcius": celcius,
                        "fahrenheit": fahrenheit
                    });
                }
                //end for future days and for that day's future hours

                //start for that day
                $scope.cityName = response.data.city.name;
                //$scope.countryName = response.data.city.country;
                //console.log(response.data.list[i]);
                $scope.cityWeatherClass = "wi " + getWeatherIconClass(response.data.list[0].weather[0].id);
                var tempKelvin = response.data.list[0].main.temp;
                $scope.temperatureCelcius = kelvinToCelcius(tempKelvin) + "°C";
                $scope.temperatureFahrenheit = kelvinToFahrenheit(tempKelvin) + "°F";

                $scope.main = response.data.list[0].weather[0].main;
                $scope.wind = "Wind: " + response.data.list[0].wind.speed + " mph";
                $scope.humidity = "Humidity: " + response.data.list[0].main.humidity + "%";

                $scope.country = response.data.city.country;
                $scope.population = response.data.city.population;
                //end for that day

            });
    }

    //show celcius degrees
    $scope.setC = function () {
        $scope.showCel = true;
    }

    //show fahrenheit degrees
    $scope.setF = function () {
        $scope.showCel = false;
    }
});

//show icon class accordin id
function getWeatherIconClass(id) {
    if (id >= 200 && id <= 299)
        return "wi-thunderstorm";
    else if (id >= 300 && id <= 399)
        return "wi-sprinkle";
    else if (id >= 500 && id <= 599)
        return "wi-rain";
    else if (id >= 300 && id <= 399)
        return "wi-thunderstorm";
    else if (id >= 600 && id <= 699)
        return "wi-snow";
    else if (id >= 700 && id <= 799)
        return "wi-fog";
    else if (id == 800)
        return "wi-day-sunny";
    else if (id == 801)
        return "wi-day-cloudy";
    else if (id >= 802 && id <= 804)
        return "wi-cloudy";
    else if (id >= 900 && id <= 909)
        return "wi-tornado";
    else if (id >= 910 && id <= 999)
        return "wi-sandstorm";
}

//convert celcius to kelvin
function kelvinToCelcius(kelvin) {
    return Math.round(kelvin - 273.15);
}

//convert fahrenheit to kelvin
function kelvinToFahrenheit(kelvin) {
    var fahrenheit = ((kelvin * 9) / 5 - 459.67);
    return Math.round(fahrenheit);
}

//get day name to day number
function getDayName(dayNumber) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return days[dayNumber];
}