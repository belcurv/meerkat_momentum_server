/* jshint esversion:6 */
/* globals $, navigator */

var Weather = (function () {
    'use strict';
    
    
    // ip based geolocation
    function getLocation() {
        
        $.getJSON('https://ipinfo.io/geo')
            .then(function(json) {
            
                // Response lat/long comes as single sting.
                // getWeather() expects a serparate lat & long.
                // Convert json string to array
                var coords = json.loc.split(',');

                // then 'return' as a lat/long object
                 return {
                     loctnObj : json,
                     latitude : coords[0],
                     longitude: coords[1]
                 };
            })
            .then(success)
            .catch(weatherErrors);
        
    }
    
    
    // handle location success
    function success(position) {
        
        console.log(position);
        
        var key = "3530553cce7adca5c5525b813494ada0",
            url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + key + "/" + position.latitude + "," + position.longitude;

        $.get({
            url: url,
            headers: 'Access-Control-Allow-Origin: *',
            dataTyoe: 'jsonp',
            success: function (data) {
                var icon = data.currently.icon;
                $('#icon_img').attr('src', "./assets/SVG/" + icon + ".svg");
                $('#weather-feature').append('<p class="temp">' + Math.round(data.currently.temperature) + ' &degF</p>');
                $('#weather-feature').append('<p class="location">' + position.loctnObj.city.toUpperCase() + '</p>');
            }
        });
    }

    
    // handle location errors
    function weatherErrors() {
        console.warn('Error fetching weather');
    }
    
    
    // public init method
    function init() {
        getLocation();
    }
    
    
    // export public methods
    return {
        init: init
    };

}());