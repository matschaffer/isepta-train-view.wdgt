function setTrainLine(name) {
    $('#frontImg').attr('src', 'Backgrounds/' + name.toLowerCase() + '.png');
}

function renderLine(iSeptaLine, status) {
    return $(iSeptaLine).html() + " -- " + status;
}

function showTrains(e, statuses) {
    $('#iSeptaUrl').val('file:///Users/schapht/workspace/septatrainview/examples/trains');
    $.get($('#iSeptaUrl').val(), function(response) {
        var listings = $(response).find("ol li a");

        setTrainLine($(listings[0]).find('span.num').html());

        document.getElementById('list').object.setDataArray(
            $.map(listings, function(listing) {
                var number = $(listing).attr('href').match(/trains\/(\d+)/)[1];
                return renderLine(listing, statuses[number]);
            }));
    });
}

function loadStatuses() {
    $.get("file:///Users/schapht/workspace/septatrainview/examples/index.html", function(response) {
        var statuses = {};
        $.each($(response).find("#train_table tr:not(.subhead)"), function() {
            var numberCell = $(this).find("td[align=left]").html();
            if (numberCell) {
                var number = numberCell.replace('&nbsp;', '');
                var status = $(this).attr('class').replace('train_', '');
                statuses[number] = status;
            }
        });
        $(document).trigger('statusesLoaded', statuses);
    });
}