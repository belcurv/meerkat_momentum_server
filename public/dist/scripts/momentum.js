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
/* jshint esversion:6 */
/* globals $ */

var BG = (function () {
    
    'use strict';
    
    
    /* public init method
    */
    function init() {
        
        var imgUrl = 'https://unsplash.it/1920/1080/?random';
        
        $.when(loadImg(imgUrl)).done(render);
    }
    
    
    /* asynchronous image loader
     *
     * @params   [string]   source   [the image API endpoint]
     * @returns  [object]            [promise object]
    */
    function loadImg(source) {
                
        return $.Deferred(function (task) {
            var image = new Image();
            image.onload = function() { task.resolve(image); };
            image.onerror = function() { task.reject(); };
            image.src = source;
        }).promise();
        
    }
    
    
    /* update the DOM
     *
     * @params   [object]   image   [image element]
    */
    function render(image) {
        $('.splash')
            .append(image)
            .css('opacity', 1);
    }
        
    
    // export public methods
    return {
        init: init
    };

}());
/* jshint esversion:6 */
/* globals $, LS */

var Focus = (function () {
    
    // init vars
    var DOM = {},
        ENTER_KEY = 13;
    
    
    // cache DOM elements
    function cacheDom() {
        DOM.$focusInput = $('#focus-input');
        DOM.$focusCheckbox = $('#focus-chkbx');
        DOM.$focusClose = $('#focus-close');
        DOM.$focusList  = $('.focus-list');
        DOM.$focusListMsg = $('.focus-list-message');
    }
    
    
    // bind events
    function bindEvents() {
        $("form").submit(function() { return false; });
        
        DOM.$focusInput.on('keyup', createDaily);
		DOM.$focusCheckbox.on('click', toggleDaily);
		DOM.$focusClose.on('click', closeDaily);
    }
    
	
    // handle create daily focus event
    function createDaily(event) {
        
        var objectStorage,
            $input = $(event.target),
            val = $input.val().trim();

		if ((event.which !== 13) || (!val)) {
			return;
		}
        
		objectStorage = {
            'val': val,
            'isChecked': false
        };
        
		LS.setData('focus-storage', objectStorage);
		
        $input.val('');
		
        render();
	}
    
    
    // handle close daily focus event
    function closeDaily(event) {
        
        var val = LS.getData('focus-storage'),
            objectStorage = {
                'val': null,
                'isChecked': false
            };
        
		LS.setData('focus-storage', objectStorage);
        
        render();
    }
    
    
    // handle toggle daily focus event
	function toggleDaily(event) {
		
        var focus = LS.getData('focus-storage'),
            newStorage = {
                'val': focus.val,
                'isChecked': !focus.isChecked
            };
        
		LS.setData('focus-storage', newStorage);
        
        render();
	}
    
    
    // render DOM
	function render() {

		var dailyFocus = LS.getData('focus-storage');

		if (!dailyFocus || !dailyFocus.val) {
            DOM.$focusInput.css('display', 'block');
			DOM.$focusList.css('display', 'none');
			return;
		} else {
            DOM.$focusInput.css('display', 'none');
			DOM.$focusList.css('display', 'block');
			DOM.$focusListMsg.html(dailyFocus.val);
		}

		if (dailyFocus.isChecked) {
            DOM.$focusListMsg.addClass('finished');
			DOM.$focusCheckbox.html('<i class="fa fa-check-square-o" aria-hidden="true"></i>');
			DOM.$focusClose.html('<i class="fa fa-plus" aria-hidden="true"></i>');
		}
		else{
			DOM.$focusListMsg.removeClass('finished');
			DOM.$focusCheckbox.html('<i class="fa fa-square-o" aria-hidden="true"></i>');
			DOM.$focusClose.html('<i class="fa fa-times" aria-hidden="true"></i>');
		}
	}
    
    
    // public init method
    function init() {
        cacheDom();
        bindEvents();
    }
    
    
    // export public methods
    return {
        init: init
    };
    
}());

/* jshint esversion:6 */
/* globals window */

var LS = (function() {

   /** 
    * localStorage feature detect & return local reference
    * @param       [none]
    * @returns     [BOOLEAN]   [returns true if stored string === uid]
    */
   var storage = (function() {
      var uid = new Date().toString(), // date must be a string
         storage,
         result;

      try {
         storage = window.localStorage;
         storage.setItem(uid, uid);
         result = storage.getItem(uid) === uid;
         storage.removeItem(uid);
         return result && storage;
      } catch (exception) {}
   }());

   /** 
    * Store item in local storage if storage exists
    * @param       [string]    loc         [local storage sub-location]
    * @param       [string]    val         [string to be stored]
    * @param       [function]  storage     [localStorage feature detect & local ref]
    */
   function setData(loc, val) {
      if (storage) {
         storage.setItem(loc, JSON.stringify(val));
      }
   }

   /** 
    * Get local storage if storage exists
    * @param       [string]    loc         [local storage sub-location]
    * @param       [function]  storage     [localStorage feature detect & local ref]
    * @returns     [JSON string]           [fetch stored string, return JSON]
    */
   function getData(loc) {
      if (storage) {
         return JSON.parse(storage.getItem(loc));
      }
   }

   /** 
    * Delete ALL keys from local storage if pass
    * @param       [function]  storage     [localStorage feature detect & local ref]
    * @returns     [function]  .clear      [wipes local storage]
    */
   function clearData() {
      if (storage) {
         return storage.clear();
      }
   }

   /** 
    * Delete ONE key from local storage if pass
    * @param       [string]    loc         [the key to delete from localStorage]
    * @param       [function]  storage     [localStorage feature detect & local ref]
    * @returns     [function]  .clear      [wipes local storage]
    */
   function deleteData(loc) {
      if (storage) {
         return storage.removeItem(loc);
      }
   }

   return {
      setData: setData,
      getData: getData,
      deleteData: deleteData,
      clearData: clearData
   };

}());
/* jshint esversion:6 */
/* globals $, document */

var Panels = (function () {
    
    'use strict';
    
    // placeholder object
    var DOM = {};
    
    
    // cache DOM elements
    function cacheDom() {
        DOM.$meerkatBtn   = $('#meerkat-btn');
        DOM.$aboutPanel   = $('#about-panel');

        DOM.$todosBtn     = $('#todos-btn');
        DOM.$todosPanel   = $('#todos-panel');

        DOM.$settingsBtn  = $('#settings-btn');
        DOM.$settingsPanel= $('#settings-panel');

        DOM.$weatherBtn   = $('#weather-feature');
        DOM.$weatherPanel = $('#weather-panel');

        DOM.$overlay      = $('<div id="overlay"></div>');
    }
    
    
    // bind events
    function bindEvents() {
        DOM.$overlay.on('click', overlayHandler);
        DOM.$meerkatBtn.on('click', aboutPanelHandler);
        DOM.$todosBtn.on('click', todosPanelHandler);
        DOM.$settingsBtn.on('click', settingsPanelHandler);
        DOM.$weatherBtn.on('click', weatherPanelHandler);
    }

    
    // handle modal overlay events    
    function overlayHandler(event) {
        event.preventDefault();
        
        DOM.$overlay.hide();
        DOM.$aboutPanel.removeClass('left-panel-show');
        DOM.$todosPanel.removeClass('right-panel-show');
        DOM.$settingsPanel.removeClass('left-panel-show');
        DOM.$weatherPanel.removeClass('right-panel-show');
        
        event.stopPropagation();
    }
    
    
    // about panel handler
    function aboutPanelHandler(event) {
        
        // add / remove CSS class
        DOM.$aboutPanel.toggleClass('left-panel-show');
        
        // show overlay
        DOM.$overlay.show();
                
        // hide other panels
        DOM.$todosPanel.removeClass('right-panel-show');
        DOM.$settingsPanel.removeClass('left-panel-show');
        DOM.$weatherPanel.removeClass('right-panel-show');
        
        event.stopPropagation();
    }
    
    
    // todo panel event handler
    function todosPanelHandler(event) {
        
        // add / remove CSS class
        DOM.$todosPanel.toggleClass('right-panel-show');
        
        // toggle overlay
        DOM.$overlay.toggle();
        
        // hide other panels
        DOM.$aboutPanel.removeClass('left-panel-show');
        DOM.$settingsPanel.removeClass('left-panel-show');
        DOM.$weatherPanel.removeClass('right-panel-show');
        
        event.stopPropagation();
    }
    
    
    // settings panel handler
    function settingsPanelHandler(event) {
        
        // add / remove CSS class
        DOM.$settingsPanel.toggleClass('left-panel-show');
        
        // toggle overlay
        DOM.$overlay.toggle();
        
        // hide other panels
        DOM.$aboutPanel.removeClass('left-panel-show');
        DOM.$todosPanel.removeClass('right-panel-show');
        DOM.$weatherPanel.removeClass('right-panel-show');
        
        event.stopPropagation();
    }
    
    
    // weather panel handler
    function weatherPanelHandler(event) {
        
        // add/remove CSS class
        DOM.$weatherPanel.toggleClass('right-panel-show');
        
        // toggle overlay
        DOM.$overlay.toggle();
        
        // hide other panels
        DOM.$aboutPanel.removeClass('left-panel-show');
        DOM.$settingsPanel.removeClass('left-panel-show');
        DOM.$todosPanel.removeClass('right-panel-show');
        
        event.stopPropagation();
        
    }
    
    
    // public init method
    function init() {
        cacheDom();
        
        DOM.$overlay.hide();  // hide overlay
        $('body').append(DOM.$overlay);  // then append it to DOM
        
        bindEvents();
    }
    
    
    // export public methods
    return {
        init: init
    };

}());
/* jshint esversion:6 */
/* globals $ */

var Quotes = (function () {
    
    // init placeholder
    var DOM = {};

    
    // cache DOM elements
    function cacheDom() {
        DOM.$quoteFeature = $('#quoteFeature');
    }
    

    // http GET random quote
    function getQuote() {

        // api parameters
        var api = {
            endpoint: 'https://quotesondesign.com/wp-json/posts',
            params: {
                'filter[orderby]': 'rand',
                'filter[posts_per_page]': 1,

                // Date query param to make each request unique.
                // this hack disables browser caching of results.
                'processdate': (new Date()).getTime()
            }
        };

        // do the work
        $.getJSON(api.endpoint, api.params)
            .then(renderQuote)
            .catch(handleError);
    }

        
    // clean quote response strings
    function clean(str) {
        var pTagRex = /(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig,

            // temporary element never actually added to DOM.
            // used to decode 'special html entities'
            $text = $('<textarea></textarea>');

        // set element = html quote string
        $text.html(str);

        // .value converts 'special entities' to regular text.
        // .replace removes the <p> tags
        return $text.val().replace(pTagRex, '');
    }

    
    // render to DOM
    function renderQuote(response) {
        
        var quote = clean(response[0].content);
        DOM.$quoteFeature
            .attr('href', response[0].link)
            .attr('target', '_blank')
            .html(quote);

    }
    

    // handle errors
    function handleError(err) {
        console.warn(err);
    }
    
    
    // public init method
    function init() {
        cacheDom();
        getQuote();
    }

    
    // export public methods
    return {
        init: init
    };

}());
/* jshint esversion:6 */
/* globals $, LS, time */

var Settings = (function () {
    
    var DOM = {},
        state = loadState();
    
    
    // cache DOM elements
    function cacheDom() {
        DOM.$settingsPanel = $('#settings-panel');
        DOM.$userName      = DOM.$settingsPanel.find('#name-input');
        DOM.$clockFormat   = DOM.$settingsPanel.find('#12-hr-clock-chkbx');
        DOM.$showWeather   = DOM.$settingsPanel.find('#show-weather-chkbx');
        DOM.$showTodos     = DOM.$settingsPanel.find('#show-todo-chkbx');
        DOM.$saveSettings  = DOM.$settingsPanel.find('#save-settings-btn');
        DOM.$clearSettings = DOM.$settingsPanel.find('#clear-settings-btn');
    }
    
    
    // bind events
    function bindEvents() {
        DOM.$saveSettings.on('click', saveSettings);
        DOM.$clearSettings.on('click', clearSettings);
    }
    
    
    // load state
    function loadState() {
        if (LS.getData('momentum-settings')) {
            return {
                userName   : LS.getData('momentum-settings').userName,
                clockFormat: LS.getData('momentum-settings').clockFormat,
                showWeather: LS.getData('momentum-settings').showWeather,
                showTodos  : LS.getData('momentum-settings').showTodos
            };
        } else {
            return {
                userName   : undefined,
                clockFormat: true,
                showWeather: true,
                showTodos  : true
            };
        }
    }
        
        
    // save settings event handler
    function saveSettings(event) {

        event.preventDefault();

        state = {
            userName   : DOM.$userName[0].value || undefined,
            clockFormat: DOM.$clockFormat[0].checked,
            showWeather: DOM.$showWeather[0].checked,
            showTodos  : DOM.$showTodos[0].checked
        };

        LS.setData('momentum-settings', state);

        updateDom();

        event.stopPropagation();
    }
        
        
    // clear settings event handler
    function clearSettings(event) {

        event.preventDefault();

        // erase 'momentum-storage'
        LS.deleteData('momentum-settings');

        // reset settings to defaults
        DOM.$userName[0].value      = '';
        DOM.$clockFormat[0].checked = true;
        DOM.$showWeather[0].checked = true;
        DOM.$showTodos[0].checked   = true;

        updateDom();

        event.stopPropagation();
    }
        
        
    // update DOM elements
    function updateDom() {
        
        // populate settings panel fields
        if (state.userName) {
            DOM.$userName[0].value  = state.userName;
        }
        DOM.$clockFormat[0].checked = state.clockFormat;
        DOM.$showWeather[0].checked = state.showWeather;
        DOM.$showTodos[0].checked   = state.showTodos;


        // call time module to re-render time & greeting
        Time.init();

        // re-load state
        loadState();

        // toggle todos feature
        if (!state.showTodos) {
            $('#todos-btn').css('display', 'none');
        } else {
            $('#todos-btn').css('display', 'block');
        }

        // toggle weather feature
        if (!state.showWeather) {
            $('#weather-feature').css('display', 'none');
        } else {
            $('#weather-feature').css('display', 'block');
        }

        // finally, close settings panel
        $('#settings-panel').removeClass('left-panel-show');
        $('#overlay').hide();

    }

    
    // public init method
    function init() {
        cacheDom();
        bindEvents();
        updateDom();
    }
    
    
    // export public methods
    return {
        init: init
    };

}());
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
            'meat bag'
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
/* jshint esversion:6 */
/* globals $, LS, document */

var Todos = (function () {
    
    var DOM = {},
        ENTER_KEY = 13;
    
    
    // cache DOM elements
    function cacheDom() {
        DOM.$todosPanel = $('#todos-panel');
        DOM.$todosInput = DOM.$todosPanel.find('#todos-input');
        DOM.todosList   = DOM.$todosPanel.find('#todos-list');
    }
    
    
    // bind events
    function bindEvents() {
        $("form").submit(function() { return false; });
        
		DOM.$todosInput.on('keyup', add);
		$(document).on('click', '.delete-task', removeTask);
		$(document).on('click', '.check-task', toggleTask);
	}

    
    // add todo item
    function add(e) {
        var newTask = DOM.$todosInput.val().trim(),
            currentTasks,
            lastId,
            newTaskObj,
            liItem;

		if ((e.which !== 13) || (!newTask)) {
			return;
		}
        
		// establish current tasks
        if (LS.getData('todo-list')) {
            currentTasks = LS.getData('todo-list');
        } else {
            currentTasks = [];
        }
		
        // getting last id
		lastId = (typeof currentTasks[0] === 'object') ? currentTasks[0].id + 1 : 0;
		
        // the new object task
		newTaskObj = {
            id: lastId,
            task: newTask,
            isChecked: false
        };
        
		// Adding the new task to the top
		currentTasks.unshift(newTaskObj);

		// save todo list
        LS.setData('todo-list', currentTasks);

        // reset input field
		DOM.$todosInput.val('');
        
		// rendering the newly added task
		DOM.todosList.prepend(
            '<li id="' + newTaskObj.id + '">' +
              '<span class="check-task">' +
                '<i class="fa fa-square-o" aria-hidden="true"></i>' +
              '</span>' +
              newTaskObj.task +
              '<span class="delete-task">' +
                '<i class="fa fa-times" aria-hidden="true"></i>' +
              '</span>' +
            '</li>'
        );
	}
    
    
    // get todo list
    function getList() {
		var todoList = LS.getData('todo-list');

		if (!todoList) return;

		todoList.forEach(function (item) {

			var liItemChecked = "<li class=\"finished\" id='" + item.id + "'>" +
			    "<span class=\"check-task\"><i class=\"fa fa-check-square-o\" aria-hidden=\"true\"></i></span>" + 
			    item.task + 
			    "<span class=\"delete-task\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span></li>";

			var liItemUnchecked = "<li id='" + item.id + "'>" +
			    "<span class=\"check-task\"><i class=\"fa fa-square-o\" aria-hidden=\"true\"></i></span>" + 
			    item.task + 
			    "<span class=\"delete-task\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span></li>";

			if (item.isChecked) {
				DOM.todosList.append(liItemChecked);
			} else {
				DOM.todosList.append(liItemUnchecked);
			}
		});
	}
    
    
    // remove task
    function removeTask(e) {
		var todoList = LS.getData('todo-list'),
            taskSelectedElement = $(e.target).parent().parent(),
            taskSelectedId = taskSelectedElement.attr('id'),
            
            index = todoList.findIndex(function(x) {
                return x.id == taskSelectedId;
            });

		todoList.splice(index, 1);
		taskSelectedElement.remove();
		LS.setData('todo-list', todoList);
	}
    
    
    // toggle task
	function toggleTask(e) {
		var todoList = LS.getData('todo-list'),
            $target = $(e.target),
            $taskSelected = $target.parent().parent(),
            taskId = $taskSelected.attr('id'),
            
            index = todoList.findIndex(function(x) {
                return x.id == taskId;
            });

		todoList[index].isChecked = !todoList[index].isChecked;

		if (todoList[index].isChecked) {
			$target.removeClass('fa-square-o').addClass('fa-check-square-o');
			$taskSelected.addClass('finished');
		} else {
			$target.removeClass('fa-check-square-o').addClass('fa-square-o');
			$taskSelected.removeClass('finished');
		}

		LS.setData('todo-list', todoList);
	}
    
    
    // public init method
    function init() {
        cacheDom();
        bindEvents();
        getList();
    }
    
    
    // export public methods
    return {
        init: init
    };
    
}());
/* jshint esversion:6 */
/* globals $, navigator, console */

var Weather = (function () {
    'use strict';

    // html5 geolocation
    function getLocation() {
        var geoOptions = {
            enableHighAccuracy: true,
            timeout    : 10000,
            maximumAge : 300000
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(geoSuccess, getIpLocation, geoOptions);
        } else {
            getIpLocation(); // fallback to ip-based location
        }

    }


    // handle html5 geolocation success
    function geoSuccess(res) {
        console.log('Using html5 geolocation...');

        // normalize position & call getWeather()
        getWeather({
            'latitude'  : res.coords.latitude,
            'longitude' : res.coords.longitude
        });
    }


    // ip-based location fallback
    function getIpLocation() {
        console.log('html5 geolocation failed, using IP-based location instead...');

        $.getJSON('https://freegeoip.net/json/184.58.233.92')
            .then(getWeather)
            .catch(weatherErrors);
    }


    // get weather
    function getWeather(position) {

        var api = {
            proxy    : 'https://cors-anywhere.herokuapp.com/',
            endpoint : 'https://api.darksky.net/forecast/',
            key      : "3530553cce7adca5c5525b813494ada0/",
            lat      : position.latitude,
            lon      : position.longitude
        };

        $.getJSON(api.proxy + api.endpoint + api.key + api.lat + ',' + api.lon)
            .then(function (weather) {
                return getCity({
                    position : position,
                    weather  : weather
                });
            })
            .then(function (data) {
                console.log(data); // Should >> Object {position: Object, weather: Object}
                renderFeature(data);
                renderPanel(data);
            })
            .catch(weatherErrors);

    }

    // obtain city name
    function getCity(data) {

        // just return if data.position already has city,
        // which it will if we used ip-based location
        if (data.position.city) {
            return {
                position : data.position,
                weather  : data.weather
            };

        } else {

            var api = {
                endpoint: 'https://nominatim.openstreetmap.org/reverse',
                params: {
                    format : 'json',
                    lat    : data.position.latitude,
                    lon    : data.position.longitude,
                    addressdetails: 1
                }
            };

            return $.getJSON(api.endpoint, api.params)
                .then(function (loc) {
                    return {
                        position : loc.address,
                        weather  : data.weather
                    };
                });
        }
    }


    // render feature
    function renderFeature(data) {
        var icon  = data.weather.currently.icon,
            temp  = Math.round(data.weather.currently.temperature),
            city  = data.position.city.toUpperCase(),
            $wi   = $('<div id="icon_img"></div>'),
            $temp = '<p class="temp">' + temp + ' &degF</p>',
            $loc  = '<p class="location">' + city + '</p>';

        $wi.append('<i class="wi wi-forecast-io-' + icon + '"></i>');

        $('#weather-feature')
            .append($wi)
            .append($temp)
            .append($loc);
    }


    // render weather-panel
    function renderPanel(data) {
        var summary  = data.weather.daily.summary,
            daily    = data.weather.daily.data,
            $weatherPanel = $('#weather-panel .panel-content'),
            $summary = $('<p>Summary: ' + summary + '</p>'),
            $table   = $('<table></table>'),
            $daily   = $('<pre>' + JSON.stringify(daily, null, 2) + '</pre>');

        $table
            .append(['<thead>',
                 '<tr>',
                 '<th class="left">Day</th>',
                 '<th>Low</th>',
                 '<th>High</th>',
                 '<th>Weather</th>',
                 '</tr',
                 '</thead>',
                 '<tbody>'
                ].join(''))

        daily.forEach(function (day) {

            var date = new Date(day.time * 1000).toDateString(),
                $trA = $('<tr></tr>'),
                $trB = $('<tr></tr>');

            $trA
                .append('<td class="left">' + date.slice(0, 10) + '</td>')
                .append('<td>' + Math.round(day.temperatureMin) + '</td>')
                .append('<td>' + Math.round(day.temperatureMax) + '</td>')
                .append('<td><i class="wi wi-forecast-io-' + day.icon + '"></i></td>');

            $trB
                .append('<td class="left" colspan="4">' + day.summary + '</td>');

            $table
                .append($trA)
                .append($trB);

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