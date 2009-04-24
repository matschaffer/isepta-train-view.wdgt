Screw.Unit(function() {
  describe("The Date parser", function() {
    it("should parse 12 noon", function() {
      var date = Date.parse("12:50 PM");
      expect(date.getHours()).to(equal, 12);
    });

    it("should parse afternoon times", function() {
      var date = Date.parse("3:50 PM");
      expect(date.getHours()).to(equal, 15);
    });

    it("should parse 12 midnight", function() {
      var date = Date.parse("12:50 AM");
      expect(date.getHours()).to(equal, 0);
    });
  });
});