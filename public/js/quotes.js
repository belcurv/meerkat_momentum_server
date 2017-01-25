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