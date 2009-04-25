/**
 * Delays function execution until the given jQuery signal is triggered.
 *
 * Example:
 *   it("should wait for the signal", function(me) {
 *     var myObject;
 *     signal(me).when(myObject).triggers('explode', function() {
 *       // Specifications go here
 *     });
 *     $(myObject).trigger('explode');
 *   });
 *
 * Example:
 *   it("should only wait 2 seconds for the signal", function(me) {
 *     var myObject;
 *     signal(me).within(2).when(myObject).triggers('explode', function() {
 *       // Specifications go here
 *     });
 *     $(myObject).trigger('explode');
 *   });
 */
Screw.Utilities.signal = function(me) {
  var timeout, delay = 2000;
  return {
    within: function(seconds) {
      delay = seconds * 1000;
      return this;
    },
    when: function(target) {
      return { triggers: function(signal, fn) {
        $(target).one(signal, function() {
          clearTimeout(timeout);
          try {
            fn(me);
            me.trigger('passed');
          } catch (e) {
            me.trigger('failed', [e]);
          }
        });
        timeout = setTimeout(function() {
            me.trigger('failed', target + " did not trigger '" + signal + "' within " + delay + "ms");
          }, delay);
        }
      };
    }
  };
};
