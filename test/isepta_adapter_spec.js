Screw.Unit(function () {
  describe('An iSeptaAdapter', function(me) {
    before(function() {
      this.url = "../examples/trains";
    });

    it("should return a collection of trains given an iSepta URL", function(me) {
      var adapter = new iSeptaAdapter(this.url);
      adapter.load_trains();

      signal(me).when(adapter).triggers('loaded', function() {
        adapter.find_all(function(trains) {
          expect(trains.length).to(equal, 5);
        });
      });
    });

    it("should return trains by ID number", function(me) {
      var adapter = new iSeptaAdapter(this.url);
      adapter.load_trains();

      signal(me).when(adapter).triggers('loaded', function() {
        adapter.find('4656', function(train) {
          expect(train).to_not(be_undefined);
        });
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
      var weeklyUrl = "http://isepta.org/rr/start/7/end/147/wk/trains";
      var currentUrl = "http://isepta.org/rr/start/7/end/147/now/trains";
      expect(iSeptaAdapter.prototype.convert_url(weeklyUrl)).to(equal, currentUrl);
    });
  });
});