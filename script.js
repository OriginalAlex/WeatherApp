"use strict";

function setRespectivePicture(keyword) {
    var resourceLocation;
    switch (keyword) {
        case "drizzle":
            resourceLocation = "resources/rainy.svg";
            break;
        case "clouds":
            resourceLocation = "resources/cloudy.svg";
            break;
        case "rain":
            resourceLocation = "resources/rainy.svg";
            break;
        case "snow":
            resourceLocation = "resources/snowy.svg";
            break;
        case "thunderstorm":
            resourceLocation = "resources/thunder.svg";
            break;
        case "clear":
            resourceLocation = "resources/clear.svg";
    }
    document.getElementById("weatherImg").setAttribute("src", resourceLocation);
}

function getAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function initialize(latitude, longitude) {
    var weatherReq = "https://fcc-weather-api.glitch.me/api/current?lat=" + (latitude) + "&lon=" + (longitude),
        locationReq = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + (latitude) + "," + (longitude) + "&sensor=true/false";
    getAsync(weatherReq, function (response) {
        var json = JSON.parse(response);
        document.getElementById("temp").innerHTML = "<div class=\"temperature\">" + json.main.temp + "°</div><span class=\" convert\" onclick=\"handleClick()\" id =\"convert\">C</span>";
        document.getElementById("wind").innerHTML = "Wind Speed: " + json.wind.speed + " mph";
        document.getElementById("twitterLink").setAttribute("href", "https://twitter.com/intent/tweet?text=The temperature is " + json.main.temp + "°C and we have " + json.weather[0].main.toLowerCase() + " right now!");
        setRespectivePicture(json.weather[0].main.toLowerCase());
    });
    getAsync(locationReq, function (response) {
        var json = JSON.parse(response);
        document.getElementById("area").innerHTML = json.results[1].formatted_address;
    });
}

function geoSuccess(event) {
    initialize(event.coords.latitude, event.coords.longitude);
}

function convertCelsiusToFarenheit(num) {
    return Math.round(10 * ((num * 1.8) + 32)) / 10; // round to 1 dp
}

function convertFarenheitToCelsius(num) {
    return Math.round(10 * ((num - 32) * (5.0 / 9))) / 10; // round to 1 dp
}

function handleClick() {
    var cur = document.getElementById("convert").innerHTML,
        num = parseFloat(document.getElementsByClassName("temperature")[0].innerHTML.replace("°", "")),
        newVal;
    if (cur === "C") {
        document.getElementById("convert").innerHTML = "F";
        newVal = convertCelsiusToFarenheit(num);
    } else {
        document.getElementById("convert").innerHTML = "C";
        newVal = convertFarenheitToCelsius(num);
    }
    document.getElementsByClassName("temperature")[0].innerHTML = newVal + "°";
}

function cityRequested() {
    var req = "https://maps.googleapis.com/maps/api/geocode/json?address=" + ((document.getElementById("input").value).replace(" ", "+"));
    getAsync(req, function (response) {
        response = JSON.parse(response);
        var info = response.results[0].geometry.bounds.northeast;
        initialize(info.lat, info.lng);
    });
}

function getGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess);
    } else {
        console.log("failure");
    }
}

window.onload = function () {
    getGeoLocation();
};