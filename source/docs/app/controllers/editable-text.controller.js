(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('EditableTextController', EditableTextController);

  function EditableTextController($log) {
    var vm = this;

    vm.isEditable = false;
    vm.model = {
      text1: 'First text',
      text2: 'Second text'
    };

    vm.submit = function () {
      vm.model = angular.extend({}, vm.model); // reset model reference
      vm.isEditable = false;
    };

    vm.reset = function () {
      vm.isEditable = false;
    };

    (function initController() {
      $log.debug('[EditableTextController] Initializing...');
    })();
  }
})(angular);