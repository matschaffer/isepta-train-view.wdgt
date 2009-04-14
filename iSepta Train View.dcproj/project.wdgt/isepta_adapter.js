iSeptaAdapter = function(source) {
  this.source = source;
}

iSeptaAdapter.prototype = {
  load_trains: function() {
    var self = this;
    $.get(this.source, function(response) {
        var listings = $(response).find("ol li a");
        self.trains = $.map(listings, function(listing) { return Train.create_from_listing(listing); });
        $(self).trigger('loaded');
    });
  }
}