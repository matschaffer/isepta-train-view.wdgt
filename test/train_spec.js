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
      var train = new Train(123, "R6", (new Date()).previous().minute());
      expect(train.departed()).to(equal, true);
    });

    it("should know if it has not yet departed", function() {
      var train = new Train(123, "R6", (new Date()).next().minute());
      expect(train.departed()).to(equal, false);
    });

    it("should account for status when reporting departed status", function() {
      var train = new Train(123, "R6", (new Date()).previous().minute());
      train.set_status('3 mins');
      expect(train.departed()).to(equal, false);
    });

    it("should set status from trainview style string", function() {
      this.train.set_status("4 mins\n");
      expect(this.train.status).to(equal, "4 mins late");
      this.train.set_status("On-time\n");
      expect(this.train.status).to(equal, "On-time");
    });
  });
});