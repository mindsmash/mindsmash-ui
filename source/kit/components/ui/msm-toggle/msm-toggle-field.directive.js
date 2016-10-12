(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmToggleField', MsmToggleField);

  function MsmToggleField($compile, $sanitize) {
    return {
      restrict: 'A',
      require: '^^msmToggleForm',
      link: function(scope, elem, attrs) {
        elem.addClass('msm-toggle-show');

        var content = $compile('<div class="form-control-static msm-toggle-hide"></div>')(scope);
        elem.after(content);
        setContent();

        scope.$on('$destroy', scope.$on('msmToggleForm:isEditable', function(event, isEditable) {
          if (!isEditable) {
            setContent();
          }
        }));

        function setContent() {
          if (attrs.msmToggleField) {
            content.html($sanitize(scope.$eval(attrs.msmToggleField)));
          } else {
            content.text(scope.$eval(attrs.ngModel));
          }
        }
      }
    }
  }
})();
