(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmSpinner
   * @restrict 'E'
   *
   * @description Displays a spinner
   */
  angular.module('msm.components.ui')
    .directive('msmSpinner', MsmSpinner);

  function MsmSpinner() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        size: '@'
      },
      templateUrl: 'components/ui/msm-spinner/msm-spinner.html'
    };
  }
})();
