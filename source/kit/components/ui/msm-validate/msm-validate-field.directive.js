(function() {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmValidateField', MsmValidateField);

  function MsmValidateField($compile) {
    return {
      restrict: 'A',
      require: '^^msmValidateForm',
      link: function(scope, elem, attrs, ctrl) {
        var fieldKey = attrs.validatedField;
        if (!fieldKey) {
          if (attrs.ngModel) {
            var ngModelParts = attrs.ngModel.split('.');
            fieldKey = ngModelParts[ngModelParts.length - 1];
          } else {
            throw 'Missing field key or ngModel';
          }
        }

        var repeat = 'error in ' + ctrl.key + '.fieldErrors | filter: { key: \'' + fieldKey + '\' }';
        elem.after($compile('<p class="help-block" ng-repeat="' + repeat + '" translate="{{ error.code }}"></p>')(scope));
        scope.$watch(ctrl.key, function(newVal, oldVal) {
          if (newVal !== oldVal) {
            var hasError = newVal && _.some(newVal.fieldErrors, { key: fieldKey });
            elem.closest('.form-group')[hasError ? 'addClass' : 'removeClass']('has-error');
          }
        });
      }
    }
  }
})();
