(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmEditableDisplay', EditableDisplay);

  function EditableDisplay($compile) {
    return {
      restrict: 'A',
      require: '^^msmEditableForm',
      compile: function compile(tElem, tAttrs) {
        tElem.addClass('msm-editable-field');

        var tDispl = null;
        var aModel = tAttrs.ngModel;
        var aTempl = tAttrs.msmEditableDisplay;
        if (aTempl && aTempl.match(/'[^']*'/)) {
          tDispl = $compile('<div class="msm-editable-display" ng-include="' + aTempl + '"></div>');
        } else if (aTempl) {
          tDispl = $compile('<p class="form-control-static msm-editable-display">' + aTempl + '</p>');
        } else if (aModel) {
          tDispl = $compile('<p class="form-control-static msm-editable-display">{{ ' + aModel + ' }}</p>');
        } else {
          throw 'Missing template or ngModel';
        }

        return {
          post: function postLink(scope, iElem, iAttrs, ctrl) {
            iElem.after(tDispl(scope));
          }
        }
      }
    }
  }

})();
