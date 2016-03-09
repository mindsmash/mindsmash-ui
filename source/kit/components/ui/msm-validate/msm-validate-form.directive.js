(function() {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmValidateForm', validatedForm);

  function validatedForm() {
    return {
      restrict: 'A',
      require: 'form',
      controller: function($attrs) {
        this.key = $attrs.msmValidateForm;
      }
    }
  }
})();
