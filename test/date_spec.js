Screw.Unit(function() {
  describe("The Date parser", function() {
    it("should return an object when parsing problem times", function() {
      expect(Date.parse("12:50 PM")).to_not(be_undefined);
    });
  });
});