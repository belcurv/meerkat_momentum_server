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
