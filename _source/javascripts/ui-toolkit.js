$(function () {
    if (document.location.hash.replace('#', '') === 'white') {
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
