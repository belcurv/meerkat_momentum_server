/* jshint esversion:6 */
/* globals $, navigator */

var Weather = (function () {
    'use strict';


    // ip based geolocation
    function getLocation() {

        $.getJSON('https://freegeoip.net/json/184.58.233.92')
            .then(success)
            .catch(weatherErrors);
    }


    // handle location success
    function success(position) {

        var key = "3530553cce7adca5c5525b813494ada0",
            url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + key + "/" + position.latitude + "," + position.longitude;

        $.get({
            url: url,
            headers: 'Access-Control-Allow-Origin: *',
            dataTyoe: 'jsonp',
            success: function (data) {
                renderFeature(position, data);
                renderPanel(position, data);
            }
        });
    }
    
    
    // render feature
    function renderFeature(position, data) {
        var icon  = data.currently.icon,
            temp  = Math.round(data.currently.temperature),
            city  = position.city.toUpperCase(),
            $wi   = $('<div id="icon_img"></div>'),
            $temp = '<p class="temp">' + temp + ' &degF</p>',
            $loc  = '<p class="location">' + city + '</p>';

        $wi.append('<i class="wi wi-' + icon + '"></i>');

        $('#weather-feature')
            .append($wi)
            .append($temp)
            .append($loc);
    }
    
    // render weather-panel
    function renderPanel(position, data) {
        var summary = data.daily.summary,
            daily   = data.daily.data,
            city    = position.city.toUpperCase(),
            $weatherPanel = $('#weather-panel .panel-content'),
            $summary = $('<p>Summary: ' + summary + '</p>'),
            $table   = $('<table></table>'),
            $daily   = $('<pre>' + JSON.stringify(daily, null, 2) + '</pre>');
        
        $table
            .append(['<thead>',
                     '<tr>',
                     '<th>Day</th>',
                     '<th>Low</th>',
                     '<th>High</th>',
                     '<th>Weather</th>',
                     '</tr',
                     '</thead>',
                     '<tbody>'
                    ].join(''))
        
        
        daily.forEach(function (day) {
            
            var date = new Date(day.time * 1000).toDateString(),
                $tr = $('<tr></tr>');
            
            $tr
                .append('<td>' + date.slice(0, 10) + '</td>')
                .append('<td>' + Math.round(day.temperatureMin) + '</td>')
                .append('<td>' + Math.round(day.temperatureMax) + '</td>')
                .append('<td>' + day.icon + ' <i class="wi wi-' + day.icon + '"></i></td>');
            
            
            $table.append($tr);
            
        })
        
        $weatherPanel
            .append($summary)
            .append($table);

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