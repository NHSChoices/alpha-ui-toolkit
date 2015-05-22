$(function () {
    // load white stylesheet when url has '?white'
    if (document.location.search.indexOf('white') > 0) {
        var url = '/stylesheets/site-white.css';
        if (document.createStyleSheet) {
            document.createStyleSheet(url);
        }
        else {
            $('<link rel="stylesheet" type="text/css" href="' +
            url + '" />').appendTo('head'); 
        }
    }
});
