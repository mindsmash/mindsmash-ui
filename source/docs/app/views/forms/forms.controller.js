(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('FormsController', FormsController);

  function FormsController($log, $q, $timeout) {
    var vm = this;

    vm.submit = function () {
      $log.debug('[FormsController] Submit called');

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve('Success');
      }, 1000);

      return deferred.promise;
    };

    (function initController() {
      $log.debug('[FormsController] Initializing...');
    })();
  }
})(angular);