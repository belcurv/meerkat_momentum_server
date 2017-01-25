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