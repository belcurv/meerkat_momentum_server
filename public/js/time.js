/* jshint esversion:6 */
/* globals $, LS */

var Time = (function() {
    
    
    // init vars
    var tehDate,
        defaultNames = [
            'pal',
            'sexy',
            'handsome',
            'smarty pants',
            'good looking',
            'classy',
            'human shield',
            'meat bag',
            'Dave'
        ],
        dummy = selectName();
    
    
    // pick a name from defaults
    function selectName() {
        var ind = Math.floor(Math.random() * defaultNames.length);
        
        return defaultNames[ind];
    }
    
    
    // asign time-based message to 'greet' on initial load
    function getMessage() {
        var timeOfDay,
            initialHour = getHours(createDate()),
            userName;
        
        // set userName
        if (LS.getData('momentum-settings')) {
            userName = LS.getData('momentum-settings').userName;
        } else {
            userName = dummy;
        }
        
        // set timeOfDay
        if (initialHour < 12) {
            timeOfDay = "morning";
        } else if (initialHour >= 12 && initialHour < 17) {
            timeOfDay = "afternoon";
        } else {
            timeOfDay = "evening";
        }

//        return `Good ${timeOfDay}, ${userName}.`;
        return 'Good ' + timeOfDay + ', ' + userName + '.';
    }
    

    // get clock format from LS or defaults
    function checkStandard() {
        var std = LS.getData('momentum-settings');
        return (std) ? std.clockFormat : true;
    }
    

    // generate new date and assign to var 'tehDate'
    function createDate() {
        tehDate = new Date();
    }
    
        
    // get hour value from tehDate
    function getHours() {
        return tehDate.getHours();
    }
    
    
    // get minutes value from tehDate
    function getMinutes() {
        return tehDate.getMinutes();
    }
    
    
    // generate hours:minutes time string
    function getTime() {
        var hours,
            minutes;
        
        if (checkStandard()) {
            if ((getHours() >= 13) && (getHours() < 24)) {
                hours = getHours() % 12;
            } else if (getHours() === 0) {
                hours = 12;
            } else {
                hours = getHours();
            }
        } else {
            hours = getHours();
        }
        
        minutes = ("0" + getMinutes()).slice(-2);
        
        return (hours + ":" + minutes);
    }
    
    
    // generate AM/PM period
    function getPeriod() {
        return (getHours() > 12) ? "PM" : "AM";
    }
    
    
    // render time to DOM
    function displayTime() {
        $('#time').text(getTime());
    }
    
    
    // render period to DOM
    function displayPeriod() {
        $('#time-period').text(getPeriod());
    }
    
    
    // render message to DOM
    function displayMessage() {
        $('#time-message').text(getMessage());
    }
    
    
    // public init method
    function init() {
        
        createDate();
        displayTime();

        if (checkStandard()) {
            displayPeriod();
        }
        
        displayMessage();
    }
    
    
    // export public methods
    return {
        init: init
    };
    
}());