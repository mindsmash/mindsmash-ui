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
          if (newVal && newVal.restangularized === true) {
            // restangular can't handle angular.copy! :-(
            snapshot = newVal.clone();
          } else {
            snapshot = angular.copy(newVal);
          }
        });

        scope.$on('msm.components.ui:msmDelayForm-refreshModel', function(e, newModel) {
          if (newModel && newModel.restangularized === true) {
            // restangular can't handle angular.copy! :-(
            snapshot = newModel.clone();
          } else {
            snapshot = angular.copy(newModel);
          }
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
