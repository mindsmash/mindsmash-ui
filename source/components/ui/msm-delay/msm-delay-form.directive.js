(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmDelayForm', MsmDelayForm);

  function MsmDelayForm($parse) {
    return {
      restrict: 'A',
      require: 'form',
      link: function (scope, elem, attrs, ctrl) {
        var snapshot = null;

        // watch model reference - no deep watch!
        // to manually trigger copy, use angular.extend({}, model)
        scope.$watch(attrs.msmDelayForm, function(newVal, oldVal) {
          snapshot = angular.copy(newVal);
        });

        elem.on('reset', function(event) {
          event.preventDefault();
          scope.$eval(attrs.ngReset);
          scope.$apply(function() {
            $parse(attrs.msmDelayForm).assign(scope, snapshot);
          });
        });
      }
    }
  }
})();
