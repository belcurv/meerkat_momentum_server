var BG = (function ($) {
    
    'use strict';
    
    function getBackground() {
        
        var img_array = [
                'static_background.jpg',
                '13.jpg'
            ],
            index = Math.floor(Math.random() * img_array.length);
        
        $('.splash')
            .css('background-image', 'url(assets/' + img_array[index] + ')')
            .css('opacity', 1);
    }
    
    return {
        getBackground: getBackground
    };

}(jQuery));