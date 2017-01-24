/*
 * server.js
*/

(function () {
    
    'use strict';
    
    // ================================ SETUP =================================

    var express = require('express'),
        app     = express(),
        morgan  = require('morgan'),
        path    = require('path'),
        port    = process.env.PORT || 3000;


    // ============================ CONFIGURATION =============================

    app.use(express.static(__dirname + '/public'));  // static files location
    app.use(morgan('combined'));                          // log requests to console


    // ========================== APPLICATION ROUTES ==========================

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });


    // ============================= START SERVER =============================

    app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });
    
}());