(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('NavsController', NavsController);

  function NavsController($log) {
    var vm = this;

    vm.active = 1;
    vm.states = ['Step 1', 'Step 2', 'Step 3'];

    (function initController() {
      $log.debug('[NavsController] Initializing...');
    })();
  }
})(angular);