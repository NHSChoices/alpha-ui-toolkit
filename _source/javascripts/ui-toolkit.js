$(function () {

    //Determine if styles are requested and set cookie
    if (document.location.search.length > 0) {
        $.cookie("styleToLoad", document.location.search.replace("?", ""));
    }

    //load styles from cookie
    var stylesToLoad = "";
    if($.cookie("styleToLoad")) stylesToLoad = $.cookie("styleToLoad").split('&');

    //apply styles requested / persisted
    for (var i = 0; i < stylesToLoad.length; i++) {
        var url = '/stylesheets/site-' + stylesToLoad[i] + '.css';
        if (document.createStyleSheet) {
            document.createStyleSheet(url);
        } else {
            $('<link rel="stylesheet" type="text/css" href="' +
                url + '" />').appendTo('head');
        }
    }
});