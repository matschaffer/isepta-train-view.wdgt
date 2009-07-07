var listDisplayed = false;

var isepta, trainview;
var trainViewUrl = "http://trainview.septa.org";

function setup() {
  // trainViewUrl = "file:///Users/schapht/workspace/isepta-train-view.wdgt/examples/index.html";
  // $('#iSeptaUrl').val("file:///Users/schapht/workspace/isepta-train-view.wdgt/examples/trains");
  setupjQuery();
  loadPrefs();
  setupAdapters($('#iSeptaUrl').val());
}

function storePrefs() {
  $.each(['iSeptaUrl', 'trainName'], function() {
    var val = $('#'+this).val();
    if (val && val.length > 0) {
      widget.setPreferenceForKey(val, widget.identifier + '-' + this);
    }
  });
}

function loadPrefs() {
  $.each(['iSeptaUrl', 'trainName'], function() {
    var val = widget.preferenceForKey(widget.identifier + '-' + this);
    if (val && val.length > 0) {
      $('#'+this).val(val);
    }
  });
}

function createAdapters(iSeptaUrl) {
  if (typeof(trainview) == "undefined") {
    isepta = new iSeptaAdapter(iSeptaUrl);
    trainview = new TrainViewAdapter(trainViewUrl, isepta);
    $(trainview).bind('loaded', showTrains);
  } else {
    isepta.set_source(iSeptaUrl);
  }
}

function setupAdapters(iSeptaUrl) {
  if (iSeptaUrl) {
    createAdapters(iSeptaUrl);
    setRefreshIntervalInSeconds(75);
  } else {
    showBack();
  }
}

function showError() {
  $('#list, #nextTrainLabel').hide();
  $('#error').show();
}

function hideError() {
  $('#list, #nextTrainLabel').show();
  $('#error').hide();
}

function setupjQuery() {
  $.ajaxSettings.timeout = 10 * 1000;
  $.ajaxSettings.cache = true;

  $().ajaxError(function() {
    if (!listDisplayed) {
      showError();
    }
  });

  $().ajaxSuccess(function() {
    hideError();
  });
}

function setTrainLine(name) {
  var availableBackgrounds = ['r1', 'r2', 'r3', 'r5', 'r6', 'r7', 'r8'];

  if ($.inArray(name.toLowerCase(), availableBackgrounds) != -1) {
    $('#frontImg').attr('src', 'Backgrounds/' + name + '.png');
  } else {
    $('#frontImg').attr('src', 'Images/front.png');
  }

  $('#nextTrainLabel').html($('#trainName').val() + ': ' + name.toUpperCase());
}

function showTrains(e, statuses) {
  var trains = isepta.find_all();
  if (trains.length > 0) {
    setTrainLine(trains[0].line);

    var trainList = $.map(trains.slice(0,5), function(train) { return train.toString(); });

    document.getElementById('list').object.setDataArray(trainList);
    listDisplayed = true;
  } else {
    document.getElementById('list').object.setDataArray(["No upcoming trains"]);
  }
}

function openISepta() {
  widget.openURL('http://www.isepta.org/m');
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
    setInterval(function() { trainview.refresh(); }, seconds * 1000);
  }
}