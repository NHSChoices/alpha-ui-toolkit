var breadCrumbViewModel = function () {
    var self = this;
    var SEARCH_PATH = '/search?';
    self.breadCrumbs = ko.observableArray();
    self.searchReferals = ko.observableArray();
    self.addCrumb = function (url, text, active) {
        self.breadCrumbs.push({ 'url': url, 'text': text, 'active': active });
    }

    self.reset = function () {
        self.breadCrumbs.removeAll();
    }

    var setSearchReferrer = function (locationurl, searchUrl) {

        var t = {};
        if (sessionStorage.searchReferals)
            t = JSON.parse(sessionStorage.searchReferals);
        t[locationurl.toLocaleLowerCase()] = searchUrl.toLocaleLowerCase();

        sessionStorage.searchReferals = ko.toJSON(t);

    };

    var isSearchUrl = function(url) {
        return url.toLowerCase().indexOf(SEARCH_PATH) > -1;
    };

    var getSearchResultsCrumb = function (referredPageUrl) {
        if (sessionStorage.searchReferals &&
            JSON.parse(sessionStorage.searchReferals)[referredPageUrl]) {
            return { 'url': JSON.parse(sessionStorage.searchReferals)[referredPageUrl], 'text': 'Search Results', 'active': true }
        }
        return null;
    };

    var init = function (location, referrer) {
        if (isSearchUrl(referrer.toLocaleLowerCase())) setSearchReferrer(location, referrer);
        var url = "http://localhost:5000/sitemap.json";
        return $.ajax({
            dataType: "json",
            url: url
        })
            .done(function (response) {
                var whereIsLocation = function (index) { return response[index].key == location; };
                if ($(response).filter(whereIsLocation).length > 0) {
                    var items = $(response).filter(whereIsLocation)[0].items;
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            var searchCrumb = getSearchResultsCrumb(items[i].url.toLowerCase());
                            var active = i === (items.length - 1);
                            if (searchCrumb) self.addCrumb(searchCrumb.url, searchCrumb.text);
                            self.addCrumb(items[i].url, items[i].text, active);
                        };
                    }
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(textStatus);
            });

    }

    init(document.location.pathname.toLocaleLowerCase(), document.referrer.toLocaleLowerCase());
}


