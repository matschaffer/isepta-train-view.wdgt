Screw.Unit(function () {
  describe('An iSeptaAdapter', function(me) {
    var url = "../examples/trains"
    var doNothing = function() {};

    it("should return a collection of trains given an iSepta URL", function(me) {
      var trains, adapter = new iSeptaAdapter(url);

      signal(me).when(me).triggers('loaded', function() {
        expect(trains.length).to(equal, 5);
      });

      adapter.find_all(function(returnedTrains) {
        trains = returnedTrains;
        $(me).trigger('loaded');
      });
    });

  it("should provide convenience methods for mapping over available trains", function(me) {
    var trainNumbers = [], adapter = new iSeptaAdapter(url);

    signal(me).when(me).triggers('done', function() {
      expect(trainNumbers).to(equal, [6652, 4656, 4664, 4668, 4670]);
    });

    adapter.map_trains(function(train, i) {
      trainNumbers.push(train.number);
      if (i == 4) { $(me).trigger('done'); }
    })
  });

    it("should return trains by ID number", function(me) {
      var train, adapter = new iSeptaAdapter(url);
      adapter.load_trains();

      signal(me).when(me).triggers('loaded', function() {
        expect(train).to_not(be_undefined);
      });

      adapter.find('4656', function(returnedTrain) {
        train = returnedTrain;
        $(me).trigger('loaded');
      });
    });

    it("should build Train objects from html listings", function() {
      var html_listing = $('<a href="/rr/start/8/end/111/now/trains/4656/stops">' +
                           '  <span class="num">R6</span>' +
                           '  <span class="d-time"> 6:02 <small>PM</small></span>' +
                           '  <span class="a-time"> 6:28 <small>PM</small></span>' +
                           '  <small class="rte"></small>' +
                           '</a>');
      var train = iSeptaAdapter.prototype.parse(html_listing);
      expect(train.number).to(equal, 4656);
      expect(train.line).to(equal, 'r6');
      expect(train.departure_time()).to(equal, '6:02 PM');
    });

    it("should convert any weekday or weekend urls to a current url", function() {
      var adapter = new iSeptaAdapter(url);
      adapter.set_source("http://isepta.org/rr/start/7/end/147/wk/trains");
      var currentUrl = "http://isepta.org/rr/start/7/end/147/now/trains";
      expect(adapter.source).to(equal, currentUrl);
    });

    it("should auto-refresh if first train is departed", function(me) {
      var adapter = new iSeptaAdapter(url);

      signal(me).and_expect(2).triggers_of(adapter, 'loaded');

      adapter.find_all(function(trains) {
        trains[0].departed = function() { return true; };
        adapter.find_all(doNothing);
      });
    });

    it("shouldn't auto-refresh more than once in 30 minutes if no trains are available", function(me) {
      var adapter = new iSeptaAdapter("../examples/notrains");

      signal(me).and_expect(2).triggers_of(adapter, 'loaded');

      adapter.find_all(function() {
        adapter.find_all(function() {
          //set time to > 30 minutes
          adapter.find_all(doNothing);
        });
      });
    });

  });
});