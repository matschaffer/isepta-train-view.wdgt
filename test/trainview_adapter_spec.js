Screw.Unit(function () {
  describe('A TrainView adapter', function(me) {
    it('should insert train status into a train object', function(me) {
      var train = new Train(363, 'R3', '3:00 PM');
      var isepta = { find: function(number, callback) {
        if (number == train.number) {
          callback(train);
        } else {
          callback(new Train());
        }
      }};
      
      var adapter = new TrainViewAdapter('../examples/index.html', isepta);

      signal(me).when(adapter).triggers('loaded', function() {
        expect(train.status).to(equal, '1 min late');
      });
      
      adapter.refresh();      
    });
    
    it('should refresh every 75 seconds', function(me) {
      skip(me).because('not implemented yet');
    });
  });
});