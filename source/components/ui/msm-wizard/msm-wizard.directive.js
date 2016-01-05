(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmWizard
   * @restrict 'E'
   *
   * @description Renders a Bootstrap form wizard
   */
  angular.module('msm.components.ui')
    .directive('msmWizard', MsmWizard);

  function MsmWizard() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        current: '=',
        total: '=',
        labels: '='
      },
      templateUrl: 'components/ui/msm-wizard/msm-wizard.html',
      link: function (scope, elem, attrs) {
        scope.current = scope.current || 1;
        scope.total = scope.total || 1;

        if (angular.isUndefined(scope.current)) {
          scope.current = 0;
        }

        scope.steps = [];
        for (var i = 1; i <= (scope.total || 1); i++) {
          scope.steps.push(i);
        }

        scope.activate = function(step) {
          scope.current = Math.min(step, scope.current, scope.total);
        }
      }
    };
  }
})();
