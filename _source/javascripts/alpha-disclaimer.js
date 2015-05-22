$(function () {
    var disclaimeraccepted = $.cookie("acceptedDisclaimer");

    if (!disclaimeraccepted) $('#disclaimerModal').modal('show');
    $('#aboutPrototype').click(function () {
        $('#disclaimerModal').modal('show');
    });
    $('#disclaimerModal').on('hidden.bs.modal', function () {
        $.cookie("acceptedDisclaimer", 1);
    });

});
