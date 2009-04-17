Screw.Unit(function () {
  describe('A Train', function() {
    before(function() {
      this.train = new Train(123, "R6", "8:51 AM");
    });

    it("should store it's number, downcased line and departure time as given", function() {
      expect(this.train.number).to(equal, 123);
      expect(this.train.line).to(equal, "r6");
      expect(this.train.departure_time()).to(equal, "8:51 AM");
    });

    it("should know if it has already departed", function() {
      var train = new Train(123, "R6", (new Date()).previous().minute().toString("h:mm tt"));
      expect(train.departed()).to(equal, true);
    });

    it("should know if it has not yet departed", function() {
      var train = new Train(123, "R6", (new Date()).next().minute().toString("h:mm tt"));
      expect(train.departed()).to(equal, false);
    });

    it("should set status from trainview style string", function() {
      this.train.set_status("4 mins\n");
      expect(this.train.status).to(equal, "4 mins late");
    });
  });
});