(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('NotificationsController', NotificationsController);

  function NotificationsController($log, msmNotification) {
    var vm = this;

    vm.primary = function () {
      msmNotification.primary({
        title: 'Title',
        message: 'Primary'
      }, false);
    };

    vm.error = function () {
      msmNotification.error({
        title: 'Title',
        message: 'Error'
      }, false);
    };

    vm.success = function () {
      msmNotification.success({
        title: 'Title',
        message: 'Success'
      }, false);
    };

    vm.info = function () {
      msmNotification.info({
        title: 'Title',
        message: 'Info'
      }, false);
    };

    vm.warning = function () {
      msmNotification.warning({
        title: 'Title',
        message: 'Warning'
      }, false);
    };

    vm.clearAll = function () {
      msmNotification.clearAll();
    };

    (function initController() {
      $log.debug('[NotificationsController] Initializing...');
    })();
  }

})(angular);