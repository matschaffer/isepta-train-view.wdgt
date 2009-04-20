Train = function(number, line, departure_time) {
  console.debug("Creating train with number: " + number + " line: " + line + " departure_time: " + departure_time);
  this.number = number;
  this.line = line.toLowerCase();
  this.set_departure_time(departure_time);
};

Train.prototype = {
  set_departure_time: function(time) {
    this.departure_time_string = time;
    this.departure_time_object = Date.parse(time);
  },
  departure_time: function() {
    return this.departure_time_string;
  },
  departed: function() {
    return this.departure_time_object < new Date();
  },
  set_status: function(status_string) {
    this.status = status_string.replace("\n", '');
    var minutes = this.status.match(/\d/);
    if (minutes) {
      this.minutes_late = parseInt(minutes[1], 10);
      this.status += " late";
    } else {
      this.minutes_late = 0;
    }
  }
};