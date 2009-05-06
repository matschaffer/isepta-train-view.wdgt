var listDisplayed = false;

var isepta, trainview;

  var stub = "file:////Users/schapht/workspace/isepta-train-view.wdgt/examples/index.html";
  var real = "http://trainview.septa.org";

function setup() {
  setupjQuery();


  createAdapters(real,
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
  // return "file:////Users/schapht/workspace/isepta-train-view.wdgt/examples/trains";

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
  /* setInterval(function() { if (trainview) { trainview.refresh(); } }, seconds * 1000); */
}