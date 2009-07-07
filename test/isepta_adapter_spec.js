Screw.Unit(function () {
  describe('An iSeptaAdapter', function(me) {
    var url = "../examples/trains";

    it("should return a collection of trains given an iSepta URL", function(me) {
      var adapter = new iSeptaAdapter(url);

      signal(me).when(adapter).triggers('loaded', function() {
        expect(adapter.find_all().length).to(equal, 5);
      });

      adapter.load_trains();
    });

    it("should return trains by ID number", function(me) {
      var adapter = new iSeptaAdapter(url);

      signal(me).when(adapter).triggers('loaded', function() {
        expect(adapter.find(4656)).to_not(be_undefined);
        expect(adapter.find(4656).number).to(equal, 4656);
      });

      adapter.load_trains();
    });

    it("should build Train objects from html listings", function() {
      var html_listing = $('<a href="/rr/start/8/end/111/now/trains/4656/stops">' +
                           '  <span class="num">R6</span>' +
                           '  <span class="d-time"> 6:02 <small>PM</small></span>' +
                           '  <span class="a-time"> 6:28 <small>PM</small></span>' +
                           '  <small class="rte"></small>' +
                           '</a>');
      var adapter = new iSeptaAdapter();
      adapter.parse(html_listing);
      var train = adapter.trains[0];
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

    it("should refresh if first train is departed", function(me) {
      var adapter = new iSeptaAdapter(url);

      $(adapter).one('loaded', function() {
        adapter.trains[0].departed = function() { return true; };
        adapter.load_trains();
      });

      signal(me).expecting(2).triggers_of(adapter, 'ready');
      signal(me).expecting(2).triggers_of(adapter, 'loaded');
      adapter.load_trains();
    });

    it("should skip any trains labeled 'Gone'", function(me) {
      var adapter = new iSeptaAdapter("../examples/gonetrains");
      signal(me).when(adapter).triggers('ready', function() {
        expect(adapter.trains.length).to(equal, 1);
      });
      adapter.load_trains();
    });

    describe("with no trains available", function() {
      it("should refresh data every 30 minutes", function(me) {
        var adapter = new iSeptaAdapter("../examples/notrains");

        $(adapter).one('loaded', function() {
          adapter.last_update_time = (new Date).add(-40).minutes();
          adapter.load_trains();
        });

        signal(me).expecting(2).triggers_of(adapter, 'ready');
        signal(me).expecting(2).triggers_of(adapter, 'loaded');
        adapter.load_trains();
      });

      it("should not refresh data rapidly", function(me) {
        var adapter = new iSeptaAdapter("../examples/notrains");

        signal(me).expecting(2).triggers_of(adapter, 'ready');
        signal(me).expecting(1).triggers_of(adapter, 'loaded');

        $(adapter).one('ready', function() {
          adapter.load_trains();
        });

        adapter.load_trains();
      });
    });
  });
});