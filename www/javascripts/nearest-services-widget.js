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
    self.location = new LocationModel({ longitude: 0, latidude: 0 });
    self.serviceList = ko.observableArray([]);
    self.locationQuery = ko.observable('');
    self.serviceType = ko.observable('pha');
    var googleMapscurrentLocation = ko.observable('saddr=Current+Location');
    var googleMapsServiceLocation = ko.observable('');
    var searchParams = ko.observable('');

    var addMapsLink = function (serviceDetails) {
        serviceDetails.googleMapsDirectionsURL = 'https://maps.google.com?' + googleMapscurrentLocation() + '&' + googleMapsServiceLocation();
        return serviceDetails;
    };

    self.searchLinkUrl = ko.computed(function () {
        return '/services?' + searchParams();
    });

    self.templateToUse = ko.computed(function () {
        return self.serviceType() === 'gpp' ? 'gp-template' : 'ph-template';
    });

    if (data && data.serviceType) self.serviceType(data.serviceType);

    var gpSearchInitialised = false;
    self.nearestService = ko.computed(function () {
        if (self.serviceList() && self.serviceList().length > 0) {
            googleMapsServiceLocation('daddr=' + self.serviceList()[0].latitude + ',' + self.serviceList()[0].longitude);
            var serviceDetails = addMapsLink(self.serviceList()[0]);
            return serviceDetails;
        }
        return '';
    });


    self.location.longitude.subscribe(function () {
        self.findNearestService(self.location);
        googleMapscurrentLocation('saddr=' + self.location.latitude() + ',' + self.location.longitude());

    });

    //ko.mapping.fromJS(data, self);

    self.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(self.location.updateLocation);
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
            url: '/api/servicessearch?' + searchParams(),
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
}

function ensureAndBindTemplates(list, viewModel) {
    var loadedTemplates = [];
    ko.utils.arrayForEach(list, function (name) {
        $.get("/javascripts/koTemplates/" + name + ".html?v=1", function (template) {
            $("body").append(template);
            loadedTemplates.push(name);
            if (list.length === loadedTemplates.length) {
                ko.applyBindings(viewModel);
            }
        });
    });
}