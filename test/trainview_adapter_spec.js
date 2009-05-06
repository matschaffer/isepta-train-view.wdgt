Screw.Unit(function () {
  describe('A TrainView adapter', function(me) {
    it('should insert train status into a train object', function(me) {
      var train = new Train(363, 'R3', '3:00 PM');
      var isepta = {
        find: function(number, callback) {
          callback(train);
        },
        load_trains: function() {
          $(isepta).trigger('loaded');
        }};

      var adapter = new TrainViewAdapter('../examples/index.html', isepta);

      signal(me).when(adapter).triggers('loaded', function() {
        expect(train.status).to(equal, '2 mins late');
      });

      adapter.refresh();
    });
  });
});