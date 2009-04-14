Screw.Utilities.signal = function(me) {
  return { when: function(target, signal, fn) {
    (function($) {
      $(target).bind(signal, function() {
        try {
          fn(me);
        } catch (e) {
          me.trigger('failed', [e]);
          return;
        }
        me.trigger('passed');
      });      
    })(jQuery);
  }};
};
