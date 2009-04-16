iSeptaAdapter = function(source) {
  this.source = source;
  this.trains = [];
};

iSeptaAdapter.prototype = {
  load_trains: function() {
    var self = this;
    $.get(this.source, function(response) {
        var listings = $(response).find("ol li a");
        self.trains = $.map(listings, function(listing) { return self.parse(listing); });
        $(self).trigger('loaded');
    });
  },

  parse: function(listing) {
    var listing = $(listing);
    console.debug("Creating train from listing: " + listing.html());
    var number = listing.attr('href').match(/trains\/(\d+)/)[1];
    var line = listing.find('span.num').html();
    var departure_time = listing.find('.d-time').text().replace(/^\s+/, '');
    return new Train(number, line, departure_time);
  },

  find: function(number) {
    return $.grep(this.trains, function(train) { return train.number == number; } );
  }
};