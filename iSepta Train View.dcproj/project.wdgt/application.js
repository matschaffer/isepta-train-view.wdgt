var listDisplayed = false;

var isepta, trainview;
var trainViewUrl = "http://trainview.septa.org";

function setup() {
  setupjQuery();

  createAdapters(trainViewUrl,
                 getiSeptaUrl());
}

function createAdapters(trainviewUrl, iSeptaUrl) {
  if (iSeptaUrl) {
    isepta = new iSeptaAdapter(iSeptaUrl);
    trainview = new TrainViewAdapter(trainviewUrl, isepta);
    $(trainview).bind('loaded', showTrains);
    trainview.refresh();
    setRefreshIntervalInSeconds(75);
  } else {
    showBack();
  }
}

function setupjQuery() {
  $.ajaxSettings.timeout = 10 * 1000;
  $.ajaxSettings.cache = true;

  $().ajaxError(function() {
    if (!listDisplayed) {
      $('#list, #nextTrainLabel').hide();
      $('#error').show();
    }
  });

  $().ajaxSuccess(function() {
    $('#list, #nextTrainLabel').show();
    $('#error').hide();
  });
}

function getiSeptaUrl() {
  var iSeptaUrl = widget.preferenceForKey(widget.identifier + "-iSeptaUrl");

  if (iSeptaUrl && iSeptaUrl.length > 0) {
    return iSeptaUrl;
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
  var trains = isepta.find_all();
  setTrainLine(trains[0].line);

  var trainList = $.map(trains.slice(0,5), function(train) { return train.toString(); });

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
  clearInterval(refreshInterval);
  if (trainview) {
    console.debug("Set refresh interval to " + seconds + " seconds");
    trainview.refresh();
    setInterval(trainview.refresh, seconds * 1000);
  }
}