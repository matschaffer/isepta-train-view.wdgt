Date.prototype.add = function(thisMany) {
  var self = this;
  return { minutes: function() {
    var newDate = new Date(self);
    newDate.setMinutes(self.getMinutes() + thisMany);
    return newDate; }};
};

Date.prototype.next = function() {
  var self = this;
  return { minute: function() {
    return self.add(1).minutes(); }};
};

Date.prototype.previous = function() {
  var self = this;
  return { minute: function() {
    return self.add(-1).minutes(); }};
};

Date.parse = function(iSeptaTime) {
  if (iSeptaTime instanceof Date) {
    return iSeptaTime;
  } else {
    var parts = iSeptaTime.match(/(\d+):(\d+)\s+(AM|PM)/);
    if (parts[1] < 12 && parts[3] == 'PM') {
      parts[1] = parseInt(parts[1], 10) + 12;
    } else if (parts[1] == 12 && parts[3] == 'AM') {
      parts[1] = 0;
    }
    var date = new Date();
    date.setHours(parts[1]);
    date.setMinutes(parts[2]);
    return date;
  }
};