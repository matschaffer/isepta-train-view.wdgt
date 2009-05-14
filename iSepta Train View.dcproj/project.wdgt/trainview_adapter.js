TrainViewAdapter = function(source, isepta_adapter) {
  this.source = source;
  this.isepta_adapter = isepta_adapter;
};

TrainViewAdapter.prototype = {
  refresh: function() {
    var self = this;
    $(this.isepta_adapter).one('ready', function() {
      console.debug("Refreshing trainview information from " + self.source);
      $.get(self.source, function(response) {
          console.debug("TrainView data " + $(response).find('.lastupdated:first').text());
          $.each($(response).find("#train_table tr:not(.subhead)"), function() {
            self.process(this);
          });
          $(self).trigger('loaded');
      });
    });
    this.isepta_adapter.load_trains();
  },
  process: function(row) {
    var numberCell = $(row).find("td[align=left]").html();
    var timeCell = $(row).find("td[align=right]:last").html();
    if (numberCell && timeCell) {
      this.updateTrain(numberCell.replace('&nbsp;', ''), timeCell);
    }
  },
  updateTrain: function(number, status) {
    var train = this.isepta_adapter.find(number);
    if (train) {
      train.set_status(status);
    }
  }
};