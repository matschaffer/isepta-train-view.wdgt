function showTrains(e, statuses) {
    $.get($("#iSeptaUrl").val(), function(response) {
        var trains = [];
        $.each($(response).find("ol li a"), function() {
            var number = $(this).attr('href').match(/trains\/(\d+)/)[1];
            trains.push($(this).html() + " -- " + statuses[number]);
        });
        document.getElementById("list").object.setDataArray(trains);
    });
}

function loadStatuses() {
    $.get("http://trainview.septa.org", function(response) {
        var statuses = {};
        //console.log($(response).find("#train_table tr:not(.subhead)").html());
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