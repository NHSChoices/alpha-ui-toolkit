function Geolocation() {

    var self = this;

    this.latitude = null;
    this.longitude = null;

    this.readCurrentPosition = function () {
        var setGeoLocation = function (position) {
            self.latitude = position.coords.latitude;
            self.longitude = position.coords.longitude;

            $('#latitude').val(position.coords.latitude);
            $('#longitude').val(position.coords.longitude);
            $('#allowGeoLocation').val('true');
        };

        var getGeoLocationError = function (err) {
            $('#allowGeoLocation').val('false');
            console.error(err.message);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setGeoLocation, getGeoLocationError);
        } else {
            getGeoLocationError({ message: 'GeoLocation not supported' });
        }
    }
};


$(function () {
    $("#q_nav").autocomplete({ source: "http://alpha.nhs.uk/search/home/suggest" });
    $("#q_page").autocomplete({ source: "http://alpha.nhs.uk/search/home/suggest" });
  
    console.log("Goelocation currently disabled");
    return;

    var geolocation = new Geolocation();
    geolocation.readCurrentPosition();
});