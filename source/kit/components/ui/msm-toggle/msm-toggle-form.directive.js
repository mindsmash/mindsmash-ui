(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmToggleForm', MsmToggleForm);

  function MsmToggleForm() {
    return {
      restrict: 'A',
      require: 'form',
      controller: angular.noop,
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.msmToggleForm, function(isEditable) {
          scope.$broadcast('msmToggleForm:isEditable', isEditable);
          if (isEditable) {
            elem.addClass('msm-toggle-active');
            elem.removeClass('msm-toggle-inactive');
          } else {
            elem.addClass('msm-toggle-inactive');
            elem.removeClass('msm-toggle-active');
          }
        });
      }
    }
  }
})();
