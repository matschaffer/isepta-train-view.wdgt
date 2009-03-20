function setTrainLine(name) {
    var availableBackgrounds = ['r1', 'r2', 'r3', 'r5', 'r6', 'r7', 'r8'];

    if ($.inArray(name.toLowerCase(), availableBackgrounds) != -1) {
        $('#frontImg').attr('src', 'Backgrounds/' + name.toLowerCase() + '.png');
    } else {
        $('#frontImg').attr('src', 'Images/front.png');
    }
    $('#nextTrainLabel').html(name);
}

function renderLine(iSeptaLine, status) {
    var line = $(iSeptaLine).find('span.num').html() + " departs " + $(iSeptaLine).find('.d-time').html();
    if (status) {
        line += " – " + status;
    }
    return line;
}

function showTrains(e, statuses) {
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
    if ($('#iSeptaUrl').val().length > 0) {
        $.get("http://trainview.septa.org", function(response) {
            var statuses = {};
            $.each($(response).find("#train_table tr:not(.subhead)"), function() {
                var numberCell = $(this).find("td[align=left]").html();
                var timeCell = $(this).find("td[align=right]:last").html();
                if (numberCell && timeCell) {
                    var number = numberCell.replace('&nbsp;', '');
                    var time = timeCell.replace("\n", '');
                    if (time.match(/\d/)) {
                        time += " late";
                    }
                    statuses[number] = time;
                }
            });
            $(document).trigger('statusesLoaded', statuses);
        });
    }
}

function openISepta() {
    widget.openURL('http://isepta.org');
}

var refreshInterval;

function setRefreshInterval(seconds) {
    console.debug("Set refresh interval to " + seconds + " seconds");
    clearInterval(refreshInterval);
    setInterval(loadStatuses, seconds * 1000);
}