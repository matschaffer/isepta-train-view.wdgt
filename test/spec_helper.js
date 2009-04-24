Screw.Utilities.signal = function(me) {
  return { when: function(target) {
    return { triggers: function(signal, fn) {
      $(target).one(signal, function() {
        try {
          fn(me);
        } catch (e) {
          me.trigger('failed', [e]);
          return;
        }
        me.trigger('passed');
      });
    }};
  }};
};
