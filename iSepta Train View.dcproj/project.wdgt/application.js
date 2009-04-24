var listDisplayed = false;

var isepta, trainview;

function setup() {
    var mockiSepta = "file:///Users/schapht/workspace/isepta-train-view.wdgt/examples/trains";
    var mockTrainView = "file:////Users/schapht/workspace/isepta-train-view.wdgt/examples/index.html";

    isepta = new iSeptaAdapter('');
    trainview = new TrainViewAdapter("http://trainview.septa.org", isepta);

    $(trainview).bind('loaded', showTrains);

    setupjQuery();
    loadPreferences();
}

function setupjQuery() {
    $.ajaxSettings.timeout = 10 * 1000;
    $.ajaxSettings.cache = true;

    $().ajaxError(function() {
        if (!listDisplayed) {
            $('#list').hide();
            $('#nextTrainLabel').hide();
            $('#error').show();
        }
    });

    $().ajaxSuccess(function() {
        $('#list').show();
        $('#nextTrainLabel').show();
        $('#error').hide();
    });
}

function loadPreferences() {
    var iSeptaUrl = widget.preferenceForKey(widget.identifier + "-iSeptaUrl");

    if (iSeptaUrl && iSeptaUrl.length > 0) {
        $('#iSeptaUrl').val(iSeptaUrl);
        isepta.set_source(iSeptaUrl);
        trainview.refresh();
        setRefreshIntervalInMinutes(10);
    } else {
        showBack();
    }
}

function setTrainLine(name) {
    var availableBackgrounds = ['r1', 'r2', 'r3', 'r5', 'r6', 'r7', 'r8'];

    if ($.inArray(name.toLowerCase(), availableBackgrounds) != -1) {
        $('#frontImg').attr('src', 'Backgrounds/' + name + '.png');
    } else {
        $('#frontImg').attr('src', 'Images/front.png');
    }
    $('#nextTrainLabel').html('Next: ' + name.toUpperCase());
}

function showTrains(e, statuses) {
    isepta.find_all(function(trains) {
        setTrainLine(trains[0].line);
    });

    var trainList = isepta.map_trains(function(train) { train.toString(); });

    document.getElementById('list').object.setDataArray(trainList);
    listDisplayed = true;
}

function openISepta() {
    widget.openURL('http://isepta.org');
}

function openMatschafferDotCom() {
    widget.openURL('http://matschaffer.com');
}

var refreshInterval;

function setRefreshIntervalInMinutes(minutes) {
    setRefreshIntervalInSeconds(minutes * 60);
}

function setRefreshIntervalInSeconds(seconds) {
    console.debug("Set refresh interval to " + seconds + " seconds");
    clearInterval(refreshInterval);
    setInterval(function() { trainview.refresh(); }, seconds * 1000);
}