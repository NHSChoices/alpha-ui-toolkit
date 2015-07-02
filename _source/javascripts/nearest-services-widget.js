var LocationModel = function (coords) {
    self = this;
    self.longitude = ko.observable(coords.longitude);
    self.latitude = ko.observable(coords.latitude);

    self.updateLocation = function (location) {
        self.latitude(location.coords.latitude);
        self.longitude(location.coords.longitude);
    };
}

var ServicesModel = function (data) {
    var self = this;
    self.hasLocation = ko.observable(false);
    self.hasError = ko.observable(false);
    self.errorMessage = ko.observable('');
    self.serviceList = ko.observableArray([]);
    self.locationQuery = ko.observable('');
    self.serviceType = ko.observable('pha');
    self.savedServices = {};

    var googleMapscurrentLocation = ko.observable('saddr=Current+Location');
    var googleMapsServiceLocation = ko.observable('');
    var searchParams = ko.observable('');

    var addMapsLink = function (serviceDetails) {
        serviceDetails.googleMapsDirectionsURL = 'https://maps.google.com?' + googleMapscurrentLocation() + '&' + googleMapsServiceLocation();
        return serviceDetails;
    };

    var addTelephonedetailsLink = function (serviceDetails) {
        serviceDetails.telephoneNumberLink = 'tel:' + serviceDetails.telephoneNumber;
        return serviceDetails;
    };

    var addPartialPostcode = function (serviceDetails) {
        serviceDetails.partialPostcode = serviceDetails.address.postcode.substring(0, serviceDetails.address.postcode.indexOf(' '))
        return serviceDetails;
    };

    self.templateToUse = ko.computed(function () {
        return self.serviceType() === 'gpp' ? 'gp-template' : 'ph-template';
    });

    if (data && data.serviceType) self.serviceType(data.serviceType);

    self.location = new LocationModel({ longitude: 0, latidude: 0 });

    self.checkIsOpen = function(openingTimes) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        var now = new Date();

        var todaysOpeningTimes = openingTimes.times.filter(function (item) {
            return item.day == days[now.getDay()]
        });

        if (todaysOpeningTimes.length < 1) {
            console.log("The nearest pharmacy had no opening times for today.");
            return false;
        }

        for (var i = 0; i < todaysOpeningTimes.length; ++i) {
            var openingHours = parseInt(todaysOpeningTimes[i].opens.substring(0, 2));
            var openingMinutes = parseInt(todaysOpeningTimes[i].opens.substring(3, 5));
            var opening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openingHours, openingMinutes);

            var closingHours = parseInt(todaysOpeningTimes[i].closes.substring(0, 2));
            var closingMinutes = parseInt(todaysOpeningTimes[i].closes.substring(3, 5));
            var closing = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closingHours, closingMinutes);

            if (now > opening && now < closing)
                return true;
        }

        return false;
    };

    var gpSearchInitialised = false;
    self.nearestService = ko.computed(function () {
        if (self.serviceList() && self.serviceList().length > 0) {
            googleMapsServiceLocation('daddr=' + self.serviceList()[0].latitude + ',' + self.serviceList()[0].longitude);
            var serviceDetails =  addPartialPostcode(
                                    addTelephonedetailsLink(
                                        addMapsLink(self.serviceList()[0])));
            serviceDetails.isOpen = self.checkIsOpen(serviceDetails.openingTimes);
            if ($.cookie("styleToLoad") && $.cookie("styleToLoad").indexOf("closeServices") > -1)
                serviceDetails.isOpen = false;
            if ($.cookie("styleToLoad") && $.cookie("styleToLoad").indexOf("openServices") > -1)
                serviceDetails.isOpen = true;
            return serviceDetails;
        }
        return '';
    });

    self.searchLinkUrl = ko.computed(function () {
        var params = searchParams();
        if (params.length == 0 && self.nearestService()) {
            params = 'location=' + self.nearestService().partialPostcode;
        }
        return '/services?' + params;
    });

    self.isSavedService = ko.computed(function () {
        if (self.nearestService() && self.nearestService().organisationType
            && self.savedServices && self.savedServices[self.nearestService().organisationType.toLowerCase()])
            return self.nearestService().id === self.savedServices[self.nearestService().organisationType.toLowerCase()].id;
        return false;
    });

    self.location.longitude.subscribe(function () {
        this.findNearestService(this.location);
        googleMapscurrentLocation('saddr=' + this.location.latitude() + ',' + this.location.longitude());

    }, self);

    self.setLocalService = function() {
        var nearestServiceJson = ko.toJSON(self.nearestService());
        if (nearestServiceJson.length > 0) {
            $.cookie("localService_" + self.serviceType(), nearestServiceJson, { path: '/' });
        }
        return true;

    };

    self.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                self.location.latitude(position.coords.latitude);
                self.location.longitude(position.coords.longitude);
            });
        } else {
            self.hasError(true);
            self.errorMessage("Geolocation is not supported by this browser.");
        }
    };

    self.searchService = function (model, event) {
        if (event.keyCode == 13) {
            self.findNearestService(self.locationQuery());
            googleMapscurrentLocation('saddr=' + self.locationQuery());
        }
    };



    self.findNearestService = function (location) {
        if (!gpSearchInitialised) {
            gpSearchInitialised = true;
            return;
        }
        var params = {
            // Specify your subscription key
            // Specify values for optional parameters, as needed
            // location: "",
            //latitude: location.coords.latitude,
            // longitude: location.coords.longitude,
            // providedservicetypes: "",
            organisationtypes: self.serviceType()
            // limit: "",
            // offset: "",
            // genders: "",
            // open: "",
            // providedservicetypes_option: "ANY",
        };

        if (location.latitude && location.longitude) {
            params.latitude = location.latitude();
            params.longitude = location.longitude();
        }

        if (typeof (location) === 'string') {
            params.location = location;
        }

        searchParams($.param(params));

        $.ajax({
            url: 'http://staging.alpha.nhs.uk/api/servicessearch?' + searchParams(),
            type: 'GET',
            dataType: 'json',
            headers: { 'Ocp-Apim-Subscription-Key': "37eaf996fe3e42cb9b3bca8452d6dbff" }

        })
            .done(function (data) {
                self.hasError(false);
                self.serviceList(data.data);
            })
            .fail(function () {
                self.hasError(true);
                self.errorMessage("Unable to find nearst GP");
            });
    }

    var init = function() {
        var localService = $.cookie("localService_" + self.serviceType());
        if (localService && localService.length > 0) {
            self.savedServices[self.serviceType()] = JSON.parse(localService);
            self.serviceList.push(self.savedServices[self.serviceType()]);
        }
    };

    init();
}

function ensureAndBindTemplates(list, viewModel, elementId) {
    var loadedTemplates = [];
    var thisPath = getScriptDomainandPath('nearest-services-widget.js');
    ko.utils.arrayForEach(list, function (name) {
        $.get(thisPath + "/koTemplates/" + name + ".html?v=1", function (template) {
            $("body").append(template);
            loadedTemplates.push(name);
            if (list.length === loadedTemplates.length) {
                if (elementId)
                    ko.applyBindings(viewModel, document.getElementById(elementId));
                else {
                    ko.applyBindings(viewModel);
                }
            }
        });
    });
}

function getScriptDomainandPath(scriptFileName) {
    var jsscript = document.getElementsByTagName("script");
    for (var i = 0; i < jsscript.length; i++) {
        var pattern = RegExp("\\b" + scriptFileName + "\\b", "g");
        if (pattern.test(jsscript[i].getAttribute("src")))
            return jsscript[i].getAttribute("src").replace(scriptFileName, "");
    }

    return '';
}