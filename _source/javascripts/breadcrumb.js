var lookup = function(location) {

    var url = "/sitemap.json";

    return $.ajax({
            dataType: "json",
            url: url
        })
        .done(function (response) {
            var whereIsLocation = function(item) { return item.key == location; };
            return $(response).filter(whereIsLocation);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus);
    });

}