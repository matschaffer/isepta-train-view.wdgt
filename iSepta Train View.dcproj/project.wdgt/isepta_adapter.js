iSeptaAdapter = function(source) {
  this.set_source(source);
  this.trains = [];
  this.loading = false;
};

iSeptaAdapter.prototype = {
  convert_url: function(url) {
    if (url) {
      return url.replace(/(wk|sat|sun)/, 'now');
    }
  },

  finish_loading: function() {
    this.last_update_time = new Date();
    this.loading = false;
    $(this).trigger('loaded');
    $(this).trigger('ready');
  },

  load_trains: function() {
    if (this.source && !this.loading) {
      if (this.trains_are_current()) {
        $(this).trigger('ready');
      } else {
        this.loading = true;
        console.debug("Loading trains from " + this.source);
        var self = this;

        $.ajax({
          url: this.source,
          error: function() { self.loading = false; },
          success: function(response) {
            var listings = $(response).find("ol li a");
            self.trains = [];
            $.each(listings, function() { self.parse(this); });
            self.finish_loading();
          }
        });
      }
    }
  },

  train_is_gone: function(listing) {
    return listing.find('.gone').length;
  },

  parse: function(listing) {
    var listing = $(listing);
    console.debug("Creating train from listing: " + listing.html());
    var trainLink = listing.attr('href').match(/trains\/(\d+)/);
    if (trainLink && !this.train_is_gone(listing)) {
      console.log(listing.html());
      var number = trainLink[1];
      var line = listing.find('span.num').html();
      var departure_time = listing.find('.d-time').text().replace(/^\s+/, '');
      this.trains.push(new Train(number, line, departure_time));
    }
  },

  set_source: function(source) {
    this.loading = false;
    this.last_update_time = null;
    this.source = this.convert_url(source);
  },

  find: function(number) {
    var matches = $.grep(this.find_all(), function(train) { return train.number == number; });
    if (matches[0]) {
      return matches[0];
    }
  },

  find_all: function() {
    return this.trains;
  },

  trains_are_current: function() {
    return (this.trains.length > 0 && !this.trains[0].departed()) || (this.trains.length == 0 && this.last_call_happened_recently());
  },

  last_call_happened_recently: function() {
    return this.last_update_time && (new Date() < this.last_update_time.add(30).minutes());
  }
};