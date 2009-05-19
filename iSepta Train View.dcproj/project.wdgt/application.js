var listDisplayed = false;

var isepta, trainview;
var trainViewUrl = "http://trainview.septa.org";

function setup() {
  // trainViewUrl = "file:///Users/schapht/workspace/isepta-train-view.wdgt/examples/index.html";
  // $('#iSeptaUrl').val("file:///Users/schapht/workspace/isepta-train-view.wdgt/examples/trains");
  setupjQuery();
  loadPrefs();
  createAdapters(trainViewUrl, $('#iSeptaUrl').val());
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
  console.debug("Set refresh interval to " + seconds + " seconds");
  clearInterval(refreshInterval);
  setInterval(function() { if (trainview) { trainview.refresh(); } }, seconds * 1000);
}