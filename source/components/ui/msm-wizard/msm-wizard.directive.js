(function() {
  'use strict';

  angular
    .module('msm.components.ui')
    .directive('msmWizard', msmWizard);

  function msmWizard() {
    return {
      restrict: "AE",
      scope: {
        active: "=",
        states: "="
      },
      templateUrl: 'components/ui/msm-wizard/msm-wizard.html'
    }
  }
})();