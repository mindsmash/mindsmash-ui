(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmButton
   * @restrict 'E'
   *
   * @description Renders a delete button which executes the callback you passed on click
   *
   * @param {function} cb the function that should be executed on click
   */
  angular
    .module('msm.components.ui')
    .directive('msmButton', MsmButton);

  function MsmButton($translate) {
    return {
      restrict: 'E',
      scope: {
        labelText: '@',
        buttonType: '@'
      },
      templateUrl: 'components/ui/msm-button/msm-button.html',
      controller: function($scope) {
        $translate($scope.labelText).then(function(translatedValue) {
          $scope.text = translatedValue;
        });

        switch ($scope.buttonType) {
          case 'delete':
              $scope.iconClass = 'zmdi zmdi-delete';
              $scope.buttonClass = 'btn-danger';
            break;

          default:
              $scope.iconClass = '';
              $scope.buttonClass = 'btn-default';

        }
      }
    };
  }

})();
