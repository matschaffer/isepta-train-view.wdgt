Screw.Unit(function () {
  describe('An iSeptaAdapter', function(me) {
    it("should return a collection of trains given an iSepta URL", function(me) {
      var adapter = new iSeptaAdapter("../examples/trains");
      adapter.load_trains();
      
      signal(me).when(adapter, 'loaded', function() {
        expect(adapter.trains.length).to(equal, 5);
      });
    });
  });
});