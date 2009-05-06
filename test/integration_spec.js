Screw.Unit(function() {
  describe("The iSepta Widget", function() {
    it("should display", function(me) {
      var isepta = new iSeptaAdapter("../examples/trains");
      var trainview = new TrainViewAdapter("../examples/index.html", isepta);

      $(trainview).bind('loaded', function() {
        $('#display').html('Got stuff?');
        $(me).trigger('done');
      });
      
      signal(me).when(me).triggers('done', function() {
        expect($('#display').html()).to_not(equal, '');
      });
      
      trainview.refresh();
    });
  });
});