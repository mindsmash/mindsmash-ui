(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmEditableForm
   * @restrict 'A'
   *
   * @description Adds functionality to conditionally display text only to input elements.
   *
   * @param {expression} msmEditableForm Shows the edit view if the expression is truthy.
   */
  angular.module('msm.components.ui')
      .directive('msmEditableForm', EditableForm);

  function EditableForm($compile) {
    return {
      restrict: 'A',
      scope: {
        edit: '=msmEditableForm',
      },
      link: function(scope, elem, attrs) {
        scope.$watch('edit', function(newVal, oldVal) {
          if (newVal) {
            elem.removeClass('form-editable-display');
          } else {
            elem.addClass('form-editable-display');
          }
        });
      }
    }
  }

})();
