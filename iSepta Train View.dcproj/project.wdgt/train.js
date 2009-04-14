Train = function(number, line, departure_time) {
  this.number = number;
  this.line = line.toLowerCase();
  this.set_departure_time(departure_time);
};

Train.create_from_listing = function(listing) {
  console.debug("Creating train from listing: " + listing);
  return new Train();
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
    if (this.status.match(/\d/)) {
        this.status += " late";
    }
  }
};