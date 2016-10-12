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
        var data = attrs.msmToggleField || attrs.ngModel;
        var body = $sanitize(scope.$eval(data));
        var html = $compile('<div class="form-control-static msm-toggle-hide">' + body + '</div>')(scope);
        elem.after(html);
      }
    }
  }
})();
