(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('NotificationsController', NotificationsController);

  function NotificationsController($log, msmNotification) {
    var vm = this;

    vm.primary = function () {
      msmNotification.primary('Primary', false);
    };

    vm.error = function () {
      msmNotification.error('Error', false);
    };

    vm.success = function () {
      msmNotification.success('Success', false);
    };

    vm.info = function () {
      msmNotification.info('Info', false);
    };

    vm.warning = function () {
      msmNotification.warning('Warning', false);
    };

    vm.clearAll = function () {
      msmNotification.clearAll();
    };

    (function initController() {
      $log.debug('[NotificationsController] Initializing...');
    })();
  }

})(angular);