/* jshint esversion:6 */
/* globals $, document */

$(document).ready(function () {
    
    BG.init();
    Panels.init();
    Settings.init();
    Quotes.init();
    Time.init();
    Focus.init();
    Todos.init();
    Weather.init();
    
    // update time every 20 seconds
    setInterval(Time.init, 20000);
    
});