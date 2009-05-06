TrainViewAdapter = function(source, isepta_adapter) {
  this.source = source;
  this.isepta_adapter = isepta_adapter;
};

TrainViewAdapter.prototype = {
  refresh: function() {
    var self = this;
    $(this.isepta_adapter).one('loaded', function() {
      console.debug("Refreshing trainview information from " + self.source);
      $.get(self.source, function(response) {
          $.each($(response).find("#train_table tr:not(.subhead)"), function() {
              var numberCell = $(this).find("td[align=left]").html();
              var timeCell = $(this).find("td[align=right]:last").html();
              if (numberCell && timeCell) {
                  var number = numberCell.replace('&nbsp;', '');
                  self.isepta_adapter.find(number, function(train) {
                    train.set_status(timeCell);
                  });
              }
          });
          $(self).trigger('loaded');
      });
    });
    this.isepta_adapter.load_trains();
  }
};