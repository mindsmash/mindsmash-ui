(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmFormSubmit
   * @scope
   * @restrict 'A'
   *
   * @description Directive for setting a 'loading' true/false flag on a form controller. You need to make sure that
   * your submit function returns a promise for this to work. Use this as a replacement for angular's 'ngSubmit' directive.
   *
   * @example <form msm-form-submit="submitMyFormMethod">...</form>
   */
  angular
      .module('msm.components.ui')
      .directive('msmFormSubmit', MsmFormSubmit);

  function MsmFormSubmit() {
    return {
      restrict: 'A',
      require: '^form',
      transclude: true,
      template: '<fieldset ng-disabled="_form.loading"><ng-transclude></ng-transclude></fieldset>',
      scope: {
        msmFormSubmit: '&'
      },
      link: function (scope, element, attrs, formCtrl) {
        scope._form = formCtrl;
        element.on('submit', function () {
          var submitPromise = scope.msmFormSubmit();
          if (submitPromise && angular.isFunction(submitPromise.finally)) {
            formCtrl.loading = true;
            submitPromise.finally(function () {
              formCtrl.loading = false;
            });
          }
        });
      }
    };
  }
})();
