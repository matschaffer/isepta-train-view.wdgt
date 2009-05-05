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
  var timeout, delay = 2;

  var helpers = {
    running: function() {
      setTimeout(function() { me.trigger('running'); }, 0);
    },
    timeout: function(message) {
      this.running();
      timeout = setTimeout(function() {
          me.trigger('failed', message);
        }, delay * 1000);
    }
  };

  return {
    expecting: function(expectedCalls) {
      return {
        triggers_of: function(target, signal) {
          var calls = 0;
          helpers.timeout(target + " did not trigger '" + signal + "' " + expectedCalls + " times within " + delay + " seconds.");
          $(target).bind(signal, function() {
            calls++;
            if (calls == expectedCalls) {
              clearTimeout(timeout);
              me.trigger('passed');
            } else if (calls > expectedCalls) {
              clearTimeout(timeout);
              me.trigger('failed', target + " triggered '" + signal +"' " + calls + " times. Expected " + expectedCalls + ".");
            }
          });
        }
      };
    },
    within: function(seconds) {
      delay = seconds;
      return this;
    },
    when: function(target) {
      return {
        triggers: function(signal, fn) {
          helpers.timeout(target + " did not trigger '" + signal + "' within " + delay + " seconds.");
          $(target).one(signal, function() {
            clearTimeout(timeout);
            try {
              fn(me);
              me.trigger('passed');
            } catch (e) {
              me.trigger('failed', [e]);
            }
          });
        }
      };
    }
  };
};
