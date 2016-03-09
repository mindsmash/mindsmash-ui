(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('TablesController', TablesController);

  function TablesController($log) {
    var vm = this;

    vm.model = {
      isHover: false,
      isStriped: false,
      isBordered: false,
      isCondensed: false
    };

    (function initController() {
      $log.debug('[TablesController] Initializing...');
    })();
  }
})(angular);